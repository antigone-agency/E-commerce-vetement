import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import LoadingScreen from '../components/LoadingScreen'
import { parseColorImages } from '../utils/mixMatch'

export default function Home() {
  const navigate = useNavigate()
  const [heroBanners, setHeroBanners] = useState([])
  const [heroIdx, setHeroIdx] = useState(0)
  const [direction, setDirection] = useState('next')
  const [homepageCols, setHomepageCols] = useState({})
  const [lsGone, setLsGone] = useState(false)
  const [dataReady, setDataReady] = useState(false)
  const [nouveautes, setNouveautes] = useState([])
  const nouvScrollRef = useRef(null)
  const [nouvAtStart, setNouvAtStart] = useState(true)
  const [nouvAtEnd, setNouvAtEnd] = useState(true)

  const getNouveautesLink = () => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      const g = (u?.gender || '').toLowerCase()
      if (g === 'homme') return '/produits/homme'
      if (g === 'femme') return '/produits/femme'
    } catch {}
    return '/produits/femme'
  }

  const getProductImage = (p) => {
    if (p.imageUrl) return p.imageUrl
    const parsed = parseColorImages(p.colorImages)
    for (const imgs of Object.values(parsed)) {
      if (Array.isArray(imgs)) {
        const first = imgs.find(img => img)
        if (first) return first
      }
    }
    return null
  }

  const slideNouv = (dir) => {
    const el = nouvScrollRef.current
    if (!el) return
    const card = el.querySelector('[data-nouv-card]')
    if (!card) return
    el.scrollBy({ left: dir * (card.offsetWidth + 16), behavior: 'smooth' })
  }

  const handleNouvScroll = () => {
    const el = nouvScrollRef.current
    if (!el) return
    setNouvAtStart(el.scrollLeft <= 2)
    setNouvAtEnd(el.scrollLeft >= el.scrollWidth - el.offsetWidth - 2)
  }

  const heroBanner = heroBanners[heroIdx] || null

  const goPrev = () => {
    setDirection('prev')
    setHeroIdx(i => (i - 1 + heroBanners.length) % heroBanners.length)
  }
  const goNext = () => {
    setDirection('next')
    setHeroIdx(i => (i + 1) % heroBanners.length)
  }

  // Charger toutes les données en parallèle — dataReady débloque la loading screen
  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

    let segment = ''
    let userGender = ''
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const u = JSON.parse(userStr)
        segment = u?.segmentName || ''
        userGender = u?.gender || ''
      }
    } catch {}

    const fetchBanners = fetch(`${baseURL}/public/banners?position=HOMEPAGE_HERO${segment ? `&segment=${segment}` : ''}`)
      .then(r => r.ok ? r.json() : { data: [] })
      .then(json => {
        const list = json?.data
        if (Array.isArray(list) && list.length > 0) {
          const sorted = [...list].sort((a, b) => (a.priorite ?? 99) - (b.priorite ?? 99))
          setHeroBanners(sorted)
          setHeroIdx(0)
        }
      })
      .catch(() => {})

    const fetchCols = fetch(`${baseURL}/public/collections/homepage`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        const list = Array.isArray(data) ? data : (data?.data || [])
        const map = {}
        list.forEach(c => { if (c.homepagePosition) map[c.homepagePosition] = c })
        if (Object.keys(map).length > 0) setHomepageCols(map)
      })
      .catch(() => {})

    const fetchNouveautes = fetch(`${baseURL}/public/products/nouveautes${userGender ? `?gender=${userGender}` : ''}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => { setNouveautes(Array.isArray(data) ? data : []) })
      .catch(() => {})

    Promise.all([fetchBanners, fetchCols, fetchNouveautes]).then(() => setDataReady(true))
  }, [])

  // Init scroll arrow state once nouveautes load
  useEffect(() => {
    const el = nouvScrollRef.current
    if (!el) return
    setNouvAtStart(true)
    setNouvAtEnd(el.scrollWidth <= el.offsetWidth + 2)
  }, [nouveautes])

  // Auto-advance slideshow
  useEffect(() => {
    if (heroBanners.length <= 1) return
    const delay = (heroBanners[heroIdx]?.dureeSecondes || 5) * 1000
    const timer = setTimeout(() => {
      setDirection('next')
      setHeroIdx((i) => (i + 1) % heroBanners.length)
    }, delay)
    return () => clearTimeout(timer)
  }, [heroIdx, heroBanners])

  return (
    <>
      {/* La LoadingScreen se ferme APRÈS son fade — le contenu rend en dessous pendant ce temps */}
      {!lsGone && <LoadingScreen onComplete={() => setLsGone(true)} dataReady={dataReady} />}
      {dataReady && (
      <>
      {/* ─── Hero Section ─── */}
      {heroBanners.length > 0 && (
      <section className="relative h-screen w-full overflow-hidden flex items-end justify-center pb-24 px-12">

        {/* Background — key forces remount on each slide to restart animation */}
        <div
          key={`bg-${heroIdx}`}
          className={`absolute inset-0 bg-neutral-900 ${
            heroBanner?.animation === 'slide'
              ? `hero-slide-${direction}`
              : `hero-${heroBanner?.animation || 'fade'}`
          }`}
        >
          {heroBanner?.videoUrl ? (
            <iframe
              src={heroBanner.videoUrl}
              className="w-full h-full object-cover pointer-events-none"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="Hero video"
              style={{ border: 'none', position: 'absolute', inset: 0, width: '100%', height: '100%' }}
            />
          ) : heroBanner?.imageUrl && (
            <img
              src={heroBanner.imageUrl}
              alt={heroBanner.titre || 'Hero banner'}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Dark gradient at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent z-[1]" />

        {/* Text content — key remounts so text also animates */}
        <div key={`content-${heroIdx}`} className="relative z-10 flex flex-col items-center gap-8 hero-content-reveal">
          <h1 className="text-white text-5xl md:text-8xl font-black tracking-[-0.04em] uppercase text-center leading-none drop-shadow-lg">
            {heroBanner?.titre}
          </h1>
          {heroBanner?.sousTitre && (
            <p className="text-white/80 text-lg md:text-xl font-medium text-center tracking-wide drop-shadow">
              {heroBanner.sousTitre}
            </p>
          )}
          <a
            href={heroBanner?.ctaLien || '#'}
            className="bg-white text-black px-10 py-4 font-bold tracking-[0.1em] text-[12px] uppercase hover:bg-black hover:text-white transition-colors"
          >
            {heroBanner?.ctaTexte}
          </a>
        </div>

        {/* Left arrow */}
        {heroBanners.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Précédent"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_left</span>
          </button>
        )}

        {/* Right arrow */}
        {heroBanners.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center border border-white/30 bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all duration-300"
            aria-label="Suivant"
          >
            <span className="material-symbols-outlined text-[22px]">chevron_right</span>
          </button>
        )}

        {/* Slide indicator dots */}
        {heroBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroBanners.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > heroIdx ? 'next' : 'prev'); setHeroIdx(i) }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === heroIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}
      </section>
      )}

      {/* ─── Visual Collection Grid (Bento/Editorial) ─── */}
      {Object.keys(homepageCols).length > 0 && (
      <section className="w-full bg-surface overflow-hidden" style={{ height: '100vh', boxSizing: 'border-box', padding: '72px 16px 16px 16px' }}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4" style={{ height: '100%' }}>
          {/* Large left panel — principale */}
          {(() => {
            const col = homepageCols['principale']
            if (!col) return null
            return (
              <div className="md:col-span-7 relative overflow-hidden bg-surface-container" style={{ minHeight: 0 }}>
                {(col?.bannerUrl || col?.imageUrl) && (
                  <img src={col.bannerUrl || col.imageUrl} alt={col.nom || 'Collection'} className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-10 left-10">
                  <h2 className="text-white text-4xl font-bold uppercase mb-4">{col?.nom}</h2>
                  <a className="text-white border-b border-white pb-1 text-[11px] font-bold uppercase tracking-widest" href={`/collection/${col.slug}`}>
                    Voir plus
                  </a>
                </div>
              </div>
            )
          })()}

          {/* Right two stacked panels */}
          <div className="md:col-span-5 grid grid-rows-2 gap-4" style={{ minHeight: 0 }}>
            {/* Right top — secondaire-haut */}
            {(() => {
              const col = homepageCols['secondaire-haut']
              if (!col) return null
              return (
                <div className="relative overflow-hidden bg-surface-container" style={{ minHeight: 0 }}>
                  {(col?.bannerUrl || col?.imageUrl) && (
                    <img src={col.bannerUrl || col.imageUrl} alt={col.nom || 'Collection'} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <h2 className="text-white text-3xl font-bold uppercase mb-4">{col?.nom}</h2>
                    <a className="text-white border-b border-white pb-1 text-[11px] font-bold uppercase tracking-widest" href={`/collection/${col.slug}`}>
                      Voir plus
                    </a>
                  </div>
                </div>
              )
            })()}
            {/* Right bottom — secondaire-bas */}
            {(() => {
              const col = homepageCols['secondaire-bas']
              if (!col) return null
              return (
                <div className="relative overflow-hidden bg-surface-container" style={{ minHeight: 0 }}>
                  {(col?.bannerUrl || col?.imageUrl) && (
                    <img src={col.bannerUrl || col.imageUrl} alt={col.nom || 'Collection'} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-10 left-10">
                    <h2 className="text-white text-3xl font-bold uppercase mb-4">{col?.nom}</h2>
                    <a className="text-white border-b border-white pb-1 text-[11px] font-bold uppercase tracking-widest" href={`/collection/${col.slug}`}>
                      Voir plus
                    </a>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      </section>
      )}

      {/* ─── Nouveautés Carousel ─── */}
      {nouveautes.length > 0 && (
        <section className="w-full bg-surface px-6 md:px-12 py-20">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-2">Saison 2026</h2>
              <p className="text-3xl font-black tracking-tight uppercase">LES NOUVEAUTÉS</p>
            </div>
            <button
              onClick={() => navigate(getNouveautesLink())}
              className="text-[11px] font-bold uppercase underline underline-offset-8"
            >
              Tout voir
            </button>
          </div>
          <div className="relative">
            {/* Left arrow */}
            <button
              onClick={() => slideNouv(-1)}
              aria-label="Précédent"
              disabled={nouvAtStart}
              className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-1/2 z-10 w-11 h-11 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white shadow-md transition-all duration-300 ${
                nouvAtStart ? 'opacity-25 cursor-not-allowed' : 'opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">chevron_left</span>
            </button>
            {/* Right arrow */}
            <button
              onClick={() => slideNouv(1)}
              aria-label="Suivant"
              disabled={nouvAtEnd}
              className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-1/2 z-10 w-11 h-11 bg-white border border-black flex items-center justify-center hover:bg-black hover:text-white shadow-md transition-all duration-300 ${
                nouvAtEnd ? 'opacity-25 cursor-not-allowed' : 'opacity-100'
              }`}
            >
              <span className="material-symbols-outlined text-[22px]">chevron_right</span>
            </button>
            {/* Scrollable track */}
            <div
              ref={nouvScrollRef}
              onScroll={handleNouvScroll}
              className="flex gap-4 overflow-x-scroll [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: 'none' }}
            >
              {nouveautes.map((p) => (
                <div
                  key={p.id}
                  data-nouv-card
                  className="flex-shrink-0 w-[calc(50%-8px)] md:w-[calc(25%-12px)] group cursor-pointer"
                  onClick={() => navigate(`/produit/${p.slug}`)}
                >
                  <div className="relative w-full aspect-[3/4] bg-neutral-100 overflow-hidden">
                    {getProductImage(p) ? (
                      <img
                        src={getProductImage(p)}
                        alt={p.nom}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-neutral-300 text-5xl">image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                    <span className="absolute top-3 left-3 bg-black text-white text-[9px] font-bold uppercase tracking-widest px-2 py-1">NEW</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-[13px] font-bold uppercase tracking-tight leading-tight">{p.nom}</p>
                    <p className="text-[12px] text-neutral-500 font-medium mt-1">
                      {p.promoActive && p.promoPrice
                        ? `${p.promoPrice.toLocaleString('fr-TN', { minimumFractionDigits: 2 })} DT`
                        : `${p.salePrice?.toLocaleString('fr-TN', { minimumFractionDigits: 2 })} DT`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Newsletter Section ─── */}
      <section className="py-32 px-6 md:px-12 bg-surface text-center flex flex-col items-center">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6 max-w-2xl leading-none">
          REJOIGNEZ LE MONOLITHE
        </h2>
        <p className="text-neutral-500 max-w-lg mb-12 text-[13px] leading-relaxed uppercase tracking-wider">
          Abonnez-vous à notre newsletter pour recevoir des mises à jour exclusives sur nos nouvelles collections et événements.
        </p>
        <div className="w-full max-w-md">
          <div className="flex border-b border-black pb-2 items-center">
            <input
              type="email"
              placeholder="VOTRE ADRESSE E-MAIL"
              className="flex-1 bg-transparent border-none outline-none text-[11px] font-bold uppercase tracking-widest placeholder:text-neutral-300 focus:ring-0"
            />
            <button className="text-[11px] font-black uppercase tracking-widest ml-4 hover:opacity-60">
              S'INSCRIRE
            </button>
          </div>
        </div>
      </section>
      </>
      )}
    </>
  )
}
