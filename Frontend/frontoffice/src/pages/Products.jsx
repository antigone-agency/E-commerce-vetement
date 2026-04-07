import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/* ── Helper: first image from colorImages JSON ── */
function resolveImage(p) {
  if (p.imageUrl) return p.imageUrl
  if (p.colorImages) {
    try {
      const ci = typeof p.colorImages === 'string' ? JSON.parse(p.colorImages) : p.colorImages
      for (const arr of Object.values(ci)) {
        if (Array.isArray(arr) && arr[0]) return arr[0]
      }
    } catch { /* ignore */ }
  }
  return null
}

/* ── Helper: parse color swatches ── */
function resolveColorSwatches(p) {
  if (p.variants && p.variants.length > 0) {
    const unique = [...new Set(p.variants.map(v => v.colorSwatch).filter(Boolean))]
    return unique.slice(0, 5)
  }
  if (p.colors) {
    return p.colors.split(',').map(c => c.trim()).filter(Boolean).slice(0, 5)
  }
  return []
}

/* ── Static filter data ── */
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const PRICE_RANGES = [
  { label: '0 – 100 DT', min: 0, max: 100 },
  { label: '100 – 300 DT', min: 100, max: 300 },
  { label: '300+ DT', min: 300, max: Infinity },
]

export default function Products() {
  const navigate = useNavigate()
  const { categorySlug, subCategorySlug, collectionSlug } = useParams()

  /* ── State ── */
  const [categories, setCategories] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [collectionInfo, setCollectionInfo] = useState(null)

  // Filters
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [sortBy, setSortBy] = useState('nouveautes')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 12

  /* ── Fetch categories ── */
  useEffect(() => {
    axios.get(`${API}/public/categories/menu`)
      .then(res => setCategories(res.data || []))
      .catch(() => {})
  }, [])

  /* ── Resolve current category & subcategory from URL ── */
  const { parentCat, subCat, pageTitle, breadcrumb } = useMemo(() => {
    // Collection mode — title & breadcrumb handled separately
    if (collectionSlug) {
      const title = collectionInfo?.nom || 'Collection'
      return { parentCat: null, subCat: null, pageTitle: title, breadcrumb: [{ label: title, slug: `/collection/${collectionSlug}` }] }
    }

    if (!categories.length) return { parentCat: null, subCat: null, pageTitle: 'Tous les produits', breadcrumb: [] }

    let parent = null
    let sub = null

    const stripSlash = (s) => s ? s.replace(/^\//, '') : ''
    if (categorySlug) {
      parent = categories.find(c => stripSlash(c.slug) === categorySlug) || null
      if (parent && subCategorySlug) {
        sub = (parent.children || []).find(c => stripSlash(c.slug) === subCategorySlug) || null
      }
    }

    const title = sub ? sub.nom : parent ? parent.nom : 'Tous les produits'
    const bc = []
    if (parent) bc.push({ label: parent.nom, slug: stripSlash(parent.slug) })
    if (sub) bc.push({ label: sub.nom, slug: `${stripSlash(parent.slug)}/${stripSlash(sub.slug)}` })

    return { parentCat: parent, subCat: sub, pageTitle: title, breadcrumb: bc }
  }, [categories, categorySlug, subCategorySlug, collectionSlug, collectionInfo])

  /* ── Fetch products based on route ── */
  useEffect(() => {
    // Collection mode
    if (collectionSlug) {
      setLoading(true)
      setCurrentPage(1)
      Promise.all([
        axios.get(`${API}/public/products/collection/${collectionSlug}`),
        axios.get(`${API}/public/collections/slug/${collectionSlug}`),
      ])
        .then(([prodRes, colRes]) => {
          setAllProducts(prodRes.data || [])
          setCollectionInfo(colRes.data || null)
        })
        .catch(() => { setAllProducts([]); setCollectionInfo(null) })
        .finally(() => setLoading(false))
      return
    }

    setCollectionInfo(null)
    if (!categories.length && categorySlug) return // wait for categories to resolve

    setLoading(true)
    setCurrentPage(1)

    let url = `${API}/public/products`

    if (subCat) {
      url = `${API}/public/products/category/${subCat.id}`
    } else if (parentCat) {
      url = `${API}/public/products/parent-category/${parentCat.id}`
    }

    axios.get(url)
      .then(res => setAllProducts(res.data || []))
      .catch(() => setAllProducts([]))
      .finally(() => setLoading(false))
  }, [parentCat, subCat, categories.length, categorySlug, collectionSlug])

  /* ── Filter + Sort ── */
  const filteredProducts = useMemo(() => {
    let items = [...allProducts]

    // Size filter
    if (selectedSize) {
      items = items.filter(p => {
        const sizes = (p.sizes || '').split(',').map(s => s.trim())
        return sizes.includes(selectedSize)
      })
    }

    // Price filter
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice]
      if (range) {
        items = items.filter(p => {
          const price = p.promoActive && p.promoPrice > 0 ? p.promoPrice : p.salePrice
          return price >= range.min && price < range.max
        })
      }
    }

    // Sort
    if (sortBy === 'prix') {
      items.sort((a, b) => {
        const pa = a.promoActive && a.promoPrice > 0 ? a.promoPrice : a.salePrice
        const pb = b.promoActive && b.promoPrice > 0 ? b.promoPrice : b.salePrice
        return pa - pb
      })
    }

    return items
  }, [allProducts, selectedSize, selectedPrice, sortBy])

  /* ── Pagination ── */
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const paginated = filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  /* ── Subcategories for sidebar ── */
  const sidebarSubs = parentCat?.children || []

  return (
    <main className="pt-32 px-6 md:px-12 pb-24">
      {/* Breadcrumb */}
      {breadcrumb.length > 0 && (
        <nav className="mb-6 flex items-center gap-2 text-[10px] font-label uppercase tracking-[0.1em] text-neutral-400">
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/produits') }} className="hover:text-black">
            Produits
          </a>
          {breadcrumb.map((bc, i) => (
            <span key={bc.slug} className="flex items-center gap-2">
              <span>/</span>
              {i === breadcrumb.length - 1 ? (
                <span className="text-black">{bc.label}</span>
              ) : (
                <a href="#" onClick={(e) => { e.preventDefault(); navigate(`/produits/${bc.slug}`) }} className="hover:text-black">
                  {bc.label}
                </a>
              )}
            </span>
          ))}
        </nav>
      )}

      {/* Header */}
      <header className="mb-20 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-headline font-black text-4xl md:text-5xl tracking-tighter uppercase">
            {pageTitle}
          </h1>
          <p className="text-neutral-400 text-sm mt-2">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <span className="font-label text-[11px] uppercase tracking-[0.05em] text-neutral-400">Trier par:</span>
          {['nouveautes', 'prix'].map(s => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`font-label text-[11px] uppercase tracking-[0.05em] ${
                sortBy === s ? 'font-bold border-b border-black pb-1' : 'text-neutral-400 hover:text-black'
              }`}
            >
              {s === 'nouveautes' ? 'Nouveautés' : 'Prix'}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 flex-shrink-0 space-y-12">
          {/* Sub-categories */}
          {sidebarSubs.length > 0 && (
            <div>
              <h3 className="font-label text-[11px] font-bold uppercase tracking-[0.1em] mb-6">Catégories</h3>
              <div className="space-y-3">
                <a
                  href="#"
                  onClick={(e) => { e.preventDefault(); navigate(`/produits/${parentCat.slug.replace(/^\//, '')}`) }}
                  className={`block font-label text-[11px] uppercase tracking-[0.05em] ${
                    !subCat ? 'text-black font-bold' : 'text-neutral-500 hover:text-black'
                  }`}
                >
                  Tout voir
                </a>
                {sidebarSubs.map(sc => (
                  <a
                    key={sc.id}
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigate(`/produits/${parentCat.slug.replace(/^\//, '')}/${sc.slug.replace(/^\//, '')}`) }}
                    className={`block font-label text-[11px] uppercase tracking-[0.05em] ${
                      subCat?.id === sc.id ? 'text-black font-bold' : 'text-neutral-500 hover:text-black'
                    }`}
                  >
                    {sc.nom}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Taille */}
          <div>
            <h3 className="font-label text-[11px] font-bold uppercase tracking-[0.1em] mb-6">Taille</h3>
            <div className="grid grid-cols-4 gap-2">
              {SIZE_OPTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSize(prev => prev === s ? null : s)}
                  className={`py-2 text-[10px] uppercase tracking-wide ${
                    selectedSize === s
                      ? 'bg-black text-white border border-black'
                      : 'border border-outline-variant/20 hover:border-black'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Prix */}
          <div>
            <h3 className="font-label text-[11px] font-bold uppercase tracking-[0.1em] mb-6">Prix</h3>
            <div className="space-y-3">
              {PRICE_RANGES.map((range, idx) => (
                <label key={range.label} className="flex items-center gap-3 cursor-pointer group" onClick={() => setSelectedPrice(prev => prev === idx ? null : idx)}>
                  <div className={`w-4 h-4 flex items-center justify-center ${
                    selectedPrice === idx ? 'border border-black' : 'border border-outline-variant/30 group-hover:border-black'
                  }`}>
                    {selectedPrice === idx && <div className="w-2 h-2 bg-black" />}
                  </div>
                  <span className={`font-label text-[11px] uppercase tracking-[0.05em] ${
                    selectedPrice === idx ? 'text-black' : 'text-neutral-500 group-hover:text-black'
                  }`}>
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Parent categories (when on /produits without a specific category) */}
          {!parentCat && categories.length > 0 && (
            <div>
              <h3 className="font-label text-[11px] font-bold uppercase tracking-[0.1em] mb-6">Catégories</h3>
              <div className="space-y-3">
                {categories.map(cat => (
                  <a
                    key={cat.id}
                    href="#"
                    onClick={(e) => { e.preventDefault(); navigate(`/produits/${cat.slug.replace(/^\//, '')}`) }}
                    className="block font-label text-[11px] uppercase tracking-[0.05em] text-neutral-500 hover:text-black"
                  >
                    {cat.nom}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-neutral-400">
              <span className="text-4xl mb-4">∅</span>
              <p className="text-sm">Aucun produit trouvé.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-16">
                {paginated.map(product => {
                  const img = resolveImage(product)
                  const swatches = resolveColorSwatches(product)
                  const currentPrice = product.promoActive && product.promoPrice > 0 ? product.promoPrice : product.salePrice
                  const badge = product.badgeNouveau ? 'NEW' : product.badgeBestSeller ? 'BEST' : product.badgePromo ? 'PROMO' : null

                  return (
                    <div key={product.id} className="product-card cursor-pointer" onClick={() => navigate(`/produit/${product.slug}`)}>
                      {/* Image */}
                      <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-surface-container-low group">
                        {img ? (
                          <img
                            src={img}
                            alt={product.nom}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 text-neutral-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        {badge && (
                          <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold px-2 py-1 tracking-wider">
                            {badge}
                          </span>
                        )}
                        {product.promoActive && product.promoPrice > 0 && (
                          <span className="absolute top-3 right-3 bg-red-600 text-white text-[9px] font-bold px-2 py-1 tracking-wider">
                            -{Math.round(((product.salePrice - product.promoPrice) / product.salePrice) * 100)}%
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h2 className="font-label text-[13px] font-bold tracking-tight uppercase">{product.nom}</h2>
                          <div className="text-right whitespace-nowrap">
                            <span className="font-label text-[13px] tracking-tight">
                              {currentPrice?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DT
                            </span>
                            {product.promoActive && product.promoPrice > 0 && product.promoPrice < product.salePrice && (
                              <span className="block text-[10px] text-neutral-400 line-through">
                                {product.salePrice?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DT
                              </span>
                            )}
                          </div>
                        </div>
                        {swatches.length > 0 && (
                          <div className="flex gap-1.5 mt-3">
                            {swatches.map((c, i) => (
                              <div
                                key={i}
                                className="w-2.5 h-2.5"
                                style={{
                                  backgroundColor: c,
                                  border: c === '#ffffff' ? '1px solid #c6c6c6' : 'none',
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-32 flex justify-center gap-10">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className={`font-label text-[11px] uppercase tracking-[0.1em] ${currentPage === 1 ? 'text-neutral-300 cursor-not-allowed' : 'text-neutral-400 hover:text-black'}`}
                  >
                    Précédent
                  </button>
                  <div className="flex gap-6">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`font-label text-[11px] uppercase tracking-[0.1em] ${
                          currentPage === p
                            ? 'font-black border-b border-black pb-1'
                            : 'text-neutral-400 hover:text-black cursor-pointer'
                        }`}
                      >
                        {String(p).padStart(2, '0')}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className={`font-label text-[11px] uppercase tracking-[0.1em] ${currentPage === totalPages ? 'text-neutral-300 cursor-not-allowed' : 'text-black'}`}
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  )
}
