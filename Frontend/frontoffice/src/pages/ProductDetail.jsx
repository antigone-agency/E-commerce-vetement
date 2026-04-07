import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

/* ── Full size catalogs (must match backoffice AjouterProduit) ── */
const SIZE_CATALOG = {
  standard:   ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  eu:         ['36', '38', '40', '42', '44', '46', '48', '50', '52'],
  chaussures: ['39', '40', '41', '42', '43', '44', '45', '46'],
}

/* Detect which catalog a product's sizes belong to */
function detectSizeType(sizesStr) {
  const sizes = (sizesStr || '').split(',').map(s => s.trim()).filter(Boolean)
  if (sizes.length === 0) return null
  // Letters → standard
  if (sizes.some(s => SIZE_CATALOG.standard.includes(s))) return 'standard'
  // Chaussures-only sizes: 39, 41, 43, 45
  if (sizes.some(s => ['39', '41', '43', '45'].includes(s))) return 'chaussures'
  // EU-only sizes: 36, 38, 48, 50, 52
  if (sizes.some(s => ['36', '38', '48', '50', '52'].includes(s))) return 'eu'
  // Ambiguous numbers (40,42,44,46) → default to chaussures
  if (sizes.every(s => SIZE_CATALOG.chaussures.includes(s))) return 'chaussures'
  return 'eu'
}

/* ── Parse colorImages JSON → { colorName: [url1, url2, …] } ── */
function parseColorImages(raw) {
  if (!raw) return {}
  try {
    const ci = typeof raw === 'string' ? JSON.parse(raw) : raw
    return ci && typeof ci === 'object' ? ci : {}
  } catch { return {} }
}

/* Case-insensitive lookup in colorImages map */
function getImagesForColor(colorImagesMap, colorName) {
  if (!colorName) return null
  // Direct match first
  if (colorImagesMap[colorName]) return colorImagesMap[colorName]
  // Case-insensitive fallback
  const lower = colorName.toLowerCase()
  for (const [key, val] of Object.entries(colorImagesMap)) {
    if (key.toLowerCase() === lower) return val
  }
  return null
}

/* ── Extract unique colours from variants ── */
function extractColors(variants) {
  const map = new Map()
  for (const v of variants || []) {
    const name = v.label?.split(' - ')[0]?.trim()
    if (name && v.colorSwatch && !map.has(name)) {
      map.set(name, v.colorSwatch)
    }
  }
  return [...map.entries()].map(([name, swatch]) => ({ name, swatch }))
}

/* ── Check if a specific color+size combination is in stock ── */
function isVariantInStock(variants, colorName, sizeName) {
  const v = (variants || []).find((vt) => {
    const parts = vt.label?.split(' - ')
    return parts?.[0]?.trim() === colorName && parts?.[1]?.trim() === sizeName
  })
  return v ? v.stock > 0 : false
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [selectedColorIdx, setSelectedColorIdx] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [openAccordion, setOpenAccordion] = useState('description')

  const [similarProducts, setSimilarProducts] = useState([])

  /* ── Fetch product by slug ── */
  useEffect(() => {
    setLoading(true)
    setError(null)
    axios.get(`${API}/public/products/${slug}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError('Produit introuvable.'))
      .finally(() => setLoading(false))
  }, [slug])

  /* ── Fetch similar products (same parent category) ── */
  useEffect(() => {
    if (!product) return
    const catId = product.parentCategoryId || product.categoryId
    if (!catId) return
    axios.get(`${API}/public/products/parent-category/${catId}`)
      .then((res) => {
        const others = (res.data || []).filter((p) => p.id !== product.id).slice(0, 4)
        setSimilarProducts(others)
      })
      .catch(() => {})
  }, [product])

  /* ── Derived data ── */
  const colors = useMemo(() => product ? extractColors(product.variants) : [], [product])
  const sizeType = useMemo(() => product ? detectSizeType(product.sizes) : null, [product])
  const allSizes = useMemo(() => sizeType ? SIZE_CATALOG[sizeType] : [], [sizeType])
  const colorImagesMap = useMemo(() => product ? parseColorImages(product.colorImages) : {}, [product])

  const selectedColor = colors[selectedColorIdx] || null

  /* ── Images for the selected colour (case-insensitive lookup) ── */
  const images = useMemo(() => {
    if (!selectedColor) return []
    const imgs = getImagesForColor(colorImagesMap, selectedColor.name)
    if (Array.isArray(imgs) && imgs.length > 0) return imgs.filter(Boolean)
    // Fallback: try first available color
    for (const arr of Object.values(colorImagesMap)) {
      if (Array.isArray(arr) && arr.length > 0) return arr.filter(Boolean)
    }
    return product?.imageUrl ? [product.imageUrl] : []
  }, [selectedColor, colorImagesMap, product])

  /* ── Reset size when colour changes ── */
  useEffect(() => { setSelectedSize(null) }, [selectedColorIdx])

  /* ── Price display ── */
  const hasPromo = product?.promoActive && product?.promoPrice > 0 && product?.promoPrice < product?.salePrice
  const displayPrice = hasPromo ? product.promoPrice : product?.salePrice || 0

  const toggleAccordion = (key) => setOpenAccordion(openAccordion === key ? null : key)

  /* ── Helper: resolve first image for a similar product card ── */
  function resolveThumb(p) {
    if (p.imageUrl) return p.imageUrl
    const ci = parseColorImages(p.colorImages)
    for (const arr of Object.values(ci)) {
      if (Array.isArray(arr) && arr[0]) return arr[0]
    }
    return null
  }

  /* ── Loading state ── */
  if (loading) {
    return (
      <main className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3 text-neutral-500">
          <span className="material-symbols-outlined text-3xl animate-spin">autorenew</span>
          <p className="text-sm">Chargement du produit…</p>
        </div>
      </main>
    )
  }

  /* ── Error state ── */
  if (error || !product) {
    return (
      <main className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="material-symbols-outlined text-5xl text-neutral-300">error</span>
        <p className="text-neutral-500">{error || 'Produit introuvable.'}</p>
        <Link to="/produits" className="text-sm underline underline-offset-4 hover:text-black">
          Retour aux produits
        </Link>
      </main>
    )
  }

  return (
    <main className="pt-32 pb-20 px-4 md:px-12 max-w-[1600px] mx-auto">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-black transition-colors mb-6 group"
      >
        <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
        Retour
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

        {/* ═══ LEFT: Image Gallery — changes with selected colour ═══ */}
        <div className="lg:col-span-7 grid grid-cols-1 gap-4">
          {images.length === 0 && (
            <div className="aspect-[2/3] w-full bg-neutral-100 flex items-center justify-center text-neutral-400">
              <span className="material-symbols-outlined text-6xl">image</span>
            </div>
          )}
          {/* Main image */}
          {images.length >= 1 && (
            <div className="aspect-[2/3] w-full bg-surface-container overflow-hidden">
              <img src={images[0]} alt={product.nom} className="w-full h-full object-cover" />
            </div>
          )}
          {/* Two-column detail images */}
          {images.length >= 3 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-[2/3] bg-surface-container overflow-hidden">
                <img src={images[1]} alt="Détail" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[2/3] bg-surface-container overflow-hidden">
                <img src={images[2]} alt="Vue alternative" className="w-full h-full object-cover" />
              </div>
            </div>
          )}
          {/* Fallback for exactly 2 images */}
          {images.length === 2 && (
            <div className="aspect-[2/3] w-full bg-surface-container overflow-hidden">
              <img src={images[1]} alt="Vue alternative" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* ═══ RIGHT: Product Details (Sticky) ═══ */}
        <div className="lg:col-span-5 flex flex-col h-fit lg:sticky lg:top-32">

          {/* Title & Price */}
          <div className="mb-10">
            {product.categoryNom && (
              <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 mb-2 block font-label">
                {product.categoryNom}
              </span>
            )}
            <h1 className="text-4xl font-bold tracking-tight uppercase mb-4">{product.nom}</h1>
            <div className="flex items-center gap-3">
              {hasPromo && (
                <span className="text-lg text-neutral-400 line-through">
                  {product.salePrice.toFixed(2)} DT
                </span>
              )}
              <span className={`text-2xl font-light ${hasPromo ? 'text-red-600' : 'text-on-surface'}`}>
                {Number(displayPrice).toFixed(2)} DT
              </span>
            </div>
          </div>

          {/* ── Colour Selection ── */}
          {colors.length > 0 && (
            <div className="mb-8">
              <span className="text-[11px] font-bold tracking-[0.1em] uppercase block mb-4 font-label">
                Couleur : {selectedColor?.name}
              </span>
              <div className="flex gap-3">
                {colors.map((c, i) => (
                  <button
                    key={c.name}
                    title={c.name}
                    onClick={() => setSelectedColorIdx(i)}
                    className="w-8 h-8 transition-all"
                    style={{
                      backgroundColor: c.swatch,
                      border: c.swatch?.toLowerCase() === '#ffffff' ? '1px solid #c6c6c6' : '1px solid transparent',
                      outline: selectedColorIdx === i ? '2px solid rgba(0,0,0,0.6)' : 'none',
                      outlineOffset: '3px',
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Size Selection ── */}
          {allSizes.length > 0 && selectedColor && (
            <div className="mb-10">
              <div className="flex justify-between items-end mb-4">
                <span className="text-[11px] font-bold tracking-[0.1em] uppercase block font-label">
                  Sélectionner la Taille
                </span>
                <button className="text-[11px] uppercase underline underline-offset-4 text-neutral-500 hover:text-black">
                  Guide des tailles
                </button>
              </div>
              <div
                className="grid gap-0 border border-neutral-200"
                style={{ gridTemplateColumns: `repeat(${Math.min(allSizes.length, 6)}, 1fr)` }}
              >
                {allSizes.map((s, i) => {
                  const inStock = isVariantInStock(product.variants, selectedColor.name, s)
                  const isSelected = selectedSize === s

                  return (
                    <button
                      key={s}
                      onClick={() => inStock && setSelectedSize(s)}
                      disabled={!inStock}
                      className={`relative py-4 text-[13px] transition-colors ${
                        i < allSizes.length - 1 ? 'border-r border-neutral-200' : ''
                      } ${
                        !inStock
                          ? 'text-neutral-300 cursor-not-allowed'
                          : isSelected
                            ? 'bg-black text-white'
                            : 'hover:bg-black hover:text-white'
                      }`}
                    >
                      {s}
                      {/* Barre diagonale pour les tailles en rupture */}
                      {!inStock && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span
                            className="block w-[1px] bg-neutral-300"
                            style={{ height: '120%', transform: 'rotate(-45deg)' }}
                          />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Actions ── */}
          <div className="flex flex-col gap-4 mb-12">
            <button
              disabled={!selectedSize}
              onClick={() => {
                if (!selectedSize || !selectedColor || !product) return
                addToCart(product, selectedColor.name, selectedSize, displayPrice, images[0] || '')
                toast.success(`${product.nom} ajouté au panier`)
              }}
              className={`w-full fo-btn py-6 text-[14px] font-bold uppercase tracking-widest transition-opacity ${
                !selectedSize ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Ajouter au Panier
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-4 border border-neutral-200 hover:border-black uppercase text-[12px] font-bold tracking-widest">
              <span className="material-symbols-outlined">favorite</span>
              Ajouter aux favoris
            </button>
          </div>

          {/* ── Accordions ── */}
          <div className="border-t border-neutral-200">
            {product.description && (
              <div className="py-6 border-b border-neutral-200 cursor-pointer" onClick={() => toggleAccordion('description')}>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-bold tracking-[0.1em] uppercase font-label">Description</span>
                  <span className="material-symbols-outlined">{openAccordion === 'description' ? 'expand_less' : 'expand_more'}</span>
                </div>
                {openAccordion === 'description' && (
                  <p className="mt-4 text-[14px] leading-relaxed text-neutral-600">{product.description}</p>
                )}
              </div>
            )}
            <div className="py-6 border-b border-neutral-200 cursor-pointer" onClick={() => toggleAccordion('shipping')}>
              <div className="flex justify-between items-center">
                <span className="text-[12px] font-bold tracking-[0.1em] uppercase font-label">Livraison & Retours</span>
                <span className="material-symbols-outlined">{openAccordion === 'shipping' ? 'expand_less' : 'expand_more'}</span>
              </div>
              {openAccordion === 'shipping' && (
                <p className="mt-4 text-[14px] leading-relaxed text-neutral-600">
                  Livraison standard gratuite (3-5 jours ouvrables). Retours offerts sous 30 jours.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Similar Products ═══ */}
      {similarProducts.length > 0 && (
        <section className="mt-40">
          <h2 className="text-[13px] font-bold tracking-[0.2em] uppercase mb-12 text-center font-label">
            Vous aimerez aussi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {similarProducts.map((item) => {
              const thumb = resolveThumb(item)
              const itemPrice = item.promoActive && item.promoPrice > 0 && item.promoPrice < item.salePrice
                ? item.promoPrice : item.salePrice
              return (
                <Link key={item.id} to={`/produit/${item.slug}`} className="group cursor-pointer">
                  <div className="aspect-[3/4] bg-surface-container mb-4 overflow-hidden">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-300">
                        <span className="material-symbols-outlined text-4xl">image</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[12px] font-bold uppercase tracking-tight">{item.nom}</p>
                    <p className="text-[12px] text-neutral-500">{itemPrice.toFixed(2)} DT</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}
    </main>
  )
}
