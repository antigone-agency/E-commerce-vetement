import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CustomSelect, KpiCard, PageHeader } from '../components/ui'

const initialCollections = [
  {
    id: 1,
    name: 'Summer 2026',
    period: 'Juin - Août 2026',
    status: 'active',
    featured: true,
    type: 'Manuel',
    products: 124,
    categories: ['T-shirts & Polos', 'Pantalons', 'Accessoires'],
    createdAt: '12/05/2025',
    updatedAt: 'Hier, 14:30',
    visibility: { homepage: true, menu: true, mobile: false },
    perf: { ventes: '12.5k€', conv: '3.2%', top: 'Veste S1' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCufEpXhPgJAUz1-voW0sXr3eMSNLHj5AT-xGwfwUGRAVBQhKYTZW0JKbm05nNvS9z7TzN9kGzV77NSM-1riT9HzbHJiplJ2G0auBx63vAVYfcDUpEhAGEV8pVBPVQ_N_NvNrTTCa0hlFZzYLQIEVYGkKXiE_Kl-W-5IfjBa-usajAglKPQ27f-9cu98-GAsUW6NX7PfIn_gi-HZR_lEvJPkXonHpRQAvlqIKpb2ZKDOQmXM7Q3nJ2uBkxcNEtPJtY-Xw1J8QJW9Qeu',
  },
  {
    id: 2,
    name: 'Heavy Duty 2025',
    period: 'Lancement Automne 2025',
    status: 'draft',
    featured: false,
    type: 'Automatique',
    products: 0,
    categories: ['Vestes & Parkas', 'Chaussures'],
    createdAt: '02/06/2025',
    updatedAt: 'Il y a 2h',
    visibility: { homepage: false, menu: false, mobile: false },
    perf: null,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjICHsBgeRQx2E_0RVN3bGQZCvYUMVqmq3dFxsitbv8h1POJnL1ihnIVvo5KENqMO1gqYyqJvgoz3fIwuR4dOXRdFzFKIyB_QHhxGPn9TpuOcV62vjrLIJ3qtKyvi0ZnFCunWteUzVrxWwD_avuYbPOIUAwLcHMGQth1TwzL0thphv2qxUFQ6njNG08K49lIn5I6GM_0HpNey8pMughpfJAPKBSrRYd51KyDARBmo3oZFtlucA3JMIcjcoWuQ3vr60AiLaU8FKeMEc',
  },
  {
    id: 3,
    name: 'Winter Essentials',
    period: 'Fermé : Mars 2025',
    status: 'expired',
    featured: false,
    type: 'Manuel',
    products: 86,
    categories: ['Vestes & Parkas', 'Bottes', 'EPI'],
    createdAt: '15/11/2024',
    updatedAt: '10/03/2025',
    visibility: { homepage: false, menu: false, mobile: false },
    perf: { total: '45.8k€', vs: '+18% vs N-1' },
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEj2rOtUr4FyZsWeSKGKz-kvLXd1H_K0O1-OG6VNWPony0oSosGbyeXVYNUlDC-ow-Jh0VuG9xN6v3g4e0vRGeWBM7LgzbsbVewAMnRwrFSa92XemDBoAEfxEbzS374E3MMqr0GBX__-dfJsBcVb739dY1y3E1zc0yHGpflYVE2AzQ5bICqQRXzLtsQyZXwhAhYiPhIS_pCG1IROKqDLqQn2WfdsNDTNtSwKbAfWHTJWmQBbWTLum32fRrwECheUmLZmuTscQ9FSKK',
  },
]

const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'active', label: '🟢 Actif' },
  { value: 'scheduled', label: '🟡 Programmée' },
  { value: 'draft', label: '⚫ Brouillon' },
  { value: 'expired', label: '🔴 Expirée' },
]

const typeOptions = [
  { value: 'all', label: 'Type: Tous' },
  { value: 'Manuel', label: 'Manuel' },
  { value: 'Automatique', label: 'Automatique' },
]

const visibilityOptions = [
  { value: 'all', label: 'Visibilité: Toutes' },
  { value: 'homepage', label: 'Homepage' },
  { value: 'menu', label: 'Menu' },
  { value: 'mobile', label: 'Mobile' },
]

const productsOptions = [
  { value: 'all', label: 'Produits: Tous' },
  { value: 'empty', label: 'Vide' },
  { value: '1-20', label: '1-20 produits' },
  { value: '20-100', label: '20-100 produits' },
  { value: '100+', label: '100+ produits' },
]

const statusConfig = {
  active: {
    badge: 'bg-emerald-500 text-white',
    dot: 'bg-white animate-pulse',
    label: 'Active',
    pulse: true,
  },
  draft: {
    badge: 'bg-slate-700 text-white',
    dot: 'bg-slate-400',
    label: 'Brouillon',
    pulse: false,
  },
  expired: {
    badge: 'bg-red-600 text-white',
    dot: null,
    label: 'Expirée',
    icon: 'history',
  },
  scheduled: {
    badge: 'bg-amber-400 text-black',
    dot: 'bg-black animate-pulse',
    label: 'Programmée',
    pulse: true,
  },
}

function StatusBadge({ status }) {
  const cfg = statusConfig[status] || statusConfig.draft
  return (
    <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1 ${cfg.badge}`}>
      {cfg.icon
        ? <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
        : <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}></span>
      }
      {cfg.label}
    </span>
  )
}

function CollectionCard({ col, onToggleFeatured, onDelete }) {
  const navigate = useNavigate()
  const isExpired = col.status === 'expired'

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-200 hover:shadow-xl transition-all duration-300 ${isExpired ? 'opacity-90 grayscale-[0.3]' : ''}`}>
      {/* Image header */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={col.image}
          alt={col.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

        {/* Status + type badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <StatusBadge status={col.status} />
          {col.featured && (
            <span className="px-2 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-wider rounded flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>grade</span>
              Vedette
            </span>
          )}
          {col.type === 'Automatique' && (
            <span className="px-2 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider rounded">Automatique</span>
          )}
        </div>

        {/* Floating quick actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onToggleFeatured(col.id)}
            className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-amber-500 hover:bg-white transition-colors shadow-sm"
            title={col.featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: col.featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
          </button>
          <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-slate-700 hover:bg-white transition-colors shadow-sm" title="Dupliquer">
            <span className="material-symbols-outlined text-lg">content_copy</span>
          </button>
          <button className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-emerald-600 hover:bg-white transition-colors shadow-sm" title="Basculer statut">
            <span className="material-symbols-outlined text-lg">{col.status === 'active' ? 'toggle_on' : 'toggle_off'}</span>
          </button>
        </div>

        {/* Bottom overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div>
            <h4 className="text-lg font-black text-white leading-tight">{col.name}</h4>
            <p className="text-[10px] text-white/80 font-bold uppercase tracking-widest mt-1">
              {col.status === 'expired'
                ? <><span className="material-symbols-outlined text-xs mr-1 text-red-400">event_busy</span>{col.period}</>
                : <><span className="material-symbols-outlined text-xs mr-1">event</span>{col.period}</>
              }
            </p>
          </div>
          <span className="px-2 py-1 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-bold rounded">
            {col.products} produits
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 flex flex-col">        {/* Catégories liées */}
        {col.categories && col.categories.length > 0 && (
          <div className="mb-4">
            <p className="text-[9px] font-black uppercase text-slate-500 mb-2 tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">folder</span>
              Catégories liées
            </p>
            <div className="flex flex-wrap gap-1.5">
              {col.categories.map((cat) => (
                <span key={cat} className="px-2 py-0.5 bg-brand/10 text-brand text-[10px] font-bold rounded">{cat}</span>
              ))}
            </div>
          </div>
        )}
        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <div className="flex flex-col gap-1">
            <span className="opacity-60">Création</span>
            <span className="text-slate-800">{col.createdAt}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="opacity-60">Mise à jour</span>
            <span className="text-slate-800">{col.updatedAt}</span>
          </div>
        </div>

        {/* Visibility / draft notice */}
        {col.status === 'draft' ? (
          <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl mb-4 text-red-600 font-bold text-[10px] uppercase tracking-wider">
            <span className="material-symbols-outlined text-lg">visibility_off</span>
            Non visible sur la boutique
          </div>
        ) : col.status !== 'expired' ? (
          <div className="bg-slate-50 p-3 rounded-xl mb-4">
            <p className="text-[9px] font-black uppercase text-slate-500 mb-2 tracking-widest">Visibilité</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'homepage', icon: 'home', label: 'Homepage' },
                { key: 'menu', icon: 'menu', label: 'Menu' },
                { key: 'mobile', icon: 'smartphone', label: 'Mobile' },
              ].map(({ key, icon, label }) => (
                <div
                  key={key}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border ${col.visibility[key] ? 'bg-white border-brand/10 text-brand' : 'bg-slate-100 border-transparent opacity-40'}`}
                >
                  <span className="material-symbols-outlined text-lg">{icon}</span>
                  <span className="text-[9px] font-bold">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Performance */}
        {col.status === 'active' && col.perf && (
          <div className="border-t border-b border-slate-100 py-4 mb-5">
            <p className="text-[9px] font-black uppercase text-slate-500 mb-3 tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span>
              Performance (30j)
            </p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-sm font-black text-slate-800">{col.perf.ventes}</p>
                <p className="text-[9px] text-slate-500 font-medium">Ventes</p>
              </div>
              <div>
                <p className="text-sm font-black text-emerald-600">{col.perf.conv}</p>
                <p className="text-[9px] text-slate-500 font-medium">Conv.</p>
              </div>
              <div className="truncate">
                <p className="text-sm font-black text-slate-800 truncate">{col.perf.top}</p>
                <p className="text-[9px] text-slate-500 font-medium">Top</p>
              </div>
            </div>
          </div>
        )}

        {col.status === 'draft' && (
          <div className="border-t border-b border-slate-100 py-4 mb-5 flex flex-col items-center justify-center">
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Aucune donnée de performance</p>
          </div>
        )}

        {col.status === 'expired' && col.perf && (
          <div className="bg-slate-50 p-3 rounded-xl mb-5">
            <p className="text-[9px] font-black uppercase text-slate-500 mb-2 tracking-widest">Bilan Final</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-black text-slate-800">{col.perf.total}</p>
                <p className="text-[9px] text-slate-500 font-medium uppercase tracking-tighter">Total généré</p>
              </div>
              <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black">{col.perf.vs}</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto space-y-2">
          {col.status === 'expired' ? (
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-300 transition-colors flex items-center justify-center gap-1.5">
                <span className="material-symbols-outlined text-sm">analytics</span> Rapport complet
              </button>
              <button className="px-3 py-2 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">content_copy</span> Réactiver
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/collections/${col.id}`)}
                  className="flex-1 px-3 py-2 bg-brand text-white text-[11px] font-bold rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">{col.status === 'draft' ? 'bolt' : 'settings'}</span>
                  {col.status === 'draft' ? 'Configurer' : 'Gérer'}
                </button>
                <button className="px-3 py-2 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">visibility</span> Aperçu
                </button>
                {col.status === 'active' && (
                  <button className="px-3 py-2 border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">open_in_new</span> Site
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/collections/${col.id}`)}
                  className="p-2 flex-1 bg-slate-100 text-slate-500 rounded-lg hover:bg-slate-200 transition-colors flex justify-center">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button
                  onClick={() => onDelete(col.id)}
                  className="p-2 bg-slate-100 text-red-400 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Collections() {
  const navigate = useNavigate()
  const [collections, setCollections] = useState(initialCollections)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [filterVisibility, setFilterVisibility] = useState('all')
  const [filterProducts, setFilterProducts] = useState('all')

  const filtered = collections.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatus !== 'all' && c.status !== filterStatus) return false
    if (filterType !== 'all' && c.type !== filterType) return false
    if (filterVisibility !== 'all') {
      const key = filterVisibility
      if (!c.visibility[key]) return false
    }
    if (filterProducts !== 'all') {
      if (filterProducts === 'empty' && c.products !== 0) return false
      if (filterProducts === '1-20' && (c.products < 1 || c.products > 20)) return false
      if (filterProducts === '20-100' && (c.products < 20 || c.products > 100)) return false
      if (filterProducts === '100+' && c.products <= 100) return false
    }
    return true
  })

  const total = collections.length
  const active = collections.filter((c) => c.status === 'active').length
  const featured = collections.filter((c) => c.featured).length
  const drafts = collections.filter((c) => c.status === 'draft').length

  const handleToggleFeatured = (id) => {
    setCollections((prev) =>
      prev.map((c) => (c.id === id ? { ...c, featured: !c.featured } : c))
    )
  }

  const handleDelete = (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id))
  }

  const handleReset = () => {
    setSearch('')
    setFilterStatus('all')
    setFilterType('all')
    setFilterVisibility('all')
    setFilterProducts('all')
  }

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">
      {/* Page header */}
      <PageHeader title="Collections">
        <PageHeader.SecondaryBtn icon="upload">Importer</PageHeader.SecondaryBtn>
        <PageHeader.SecondaryBtn icon="download">Exporter</PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="add" onClick={() => navigate('/collections/nouveau')}>Nouvelle collection</PageHeader.PrimaryBtn>
      </PageHeader>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total collections"    value={total}    sub={`${total} au total`}  subColor="text-slate-400"    icon="category"     iconBg="bg-slate-50 text-slate-400" />
        <KpiCard label="Collections actives"  value={active}   sub={`${Math.round(active/total*100)||0}% total`} subColor="text-slate-400" icon="check_circle"  iconBg="bg-emerald-50 text-brand" />
        <KpiCard label="En vedette"           value={featured} sub={featured > 0 ? 'Mise en avant' : '—'} subColor="text-amber-500"  icon="grade"        iconBg="bg-amber-50 text-amber-500" />
        <KpiCard label="Brouillons"           value={drafts}   sub={drafts > 0 ? 'À publier' : '—'}    subColor="text-slate-400"    icon="edit_note"    iconBg="bg-slate-50 text-slate-400" />
      </div>

      {/* Filters */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[240px] relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="Rechercher une collection..."
              type="text"
            />
          </div>

          <CustomSelect value={filterStatus} onChange={setFilterStatus} options={statusOptions} size="sm" />
          <CustomSelect value={filterType} onChange={setFilterType} options={typeOptions} size="sm" />
          <CustomSelect value={filterVisibility} onChange={setFilterVisibility} options={visibilityOptions} size="sm" />
          <CustomSelect value={filterProducts} onChange={setFilterProducts} options={productsOptions} size="sm" />

          {/* Période button */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined text-lg">calendar_month</span>
            Période: Toutes
          </button>

          {/* Reset */}
          <button
            onClick={handleReset}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-brand transition-all"
            title="Réinitialiser les filtres"
          >
            <span className="material-symbols-outlined">restart_alt</span>
          </button>
        </div>
      </div>

      {/* Collections grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-8">
          {filtered.map((col) => (
            <CollectionCard
              key={col.id}
              col={col}
              onToggleFeatured={handleToggleFeatured}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <span className="material-symbols-outlined text-4xl text-slate-300 block mb-4">inventory</span>
          <p className="text-sm font-medium text-slate-500">
            Aucune collection trouvée.{' '}
            <button onClick={handleReset} className="text-brand hover:underline font-bold">
              Réinitialiser les filtres
            </button>
          </p>
        </div>
      )}

      {/* Empty state hint */}
      <div className="mt-10 text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
        <span className="material-symbols-outlined text-4xl text-slate-300 block mb-4">inventory</span>
        <p className="text-sm font-medium text-slate-500">
          Besoin d'organiser davantage ?{' '}
          <button onClick={() => navigate('/collections/nouveau')} className="text-brand hover:underline font-bold">
            Créez une collection intelligente
          </button>{' '}
          basée sur des règles automatiques.
        </p>
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate('/collections/nouveau')}
        className="fixed bottom-8 right-8 w-14 h-14 bg-brand text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group"
        title="Nouvelle collection"
      >
        <span className="material-symbols-outlined text-2xl">add</span>
        <span className="absolute right-full mr-4 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap uppercase tracking-widest">
          Nouvelle collection
        </span>
      </button>
    </div>
  )
}
