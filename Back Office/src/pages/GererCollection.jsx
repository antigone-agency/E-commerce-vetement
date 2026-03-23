import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import KpiCard from '../components/ui/KpiCard'

// ── Mock data (same shape as Collections.jsx) ─────────────────────────────────
const mockCollections = {
  1: {
    id: 1,
    name: 'Summer 2026',
    description: 'Nouvelle collection estivale axée sur la respirabilité et la durabilité extrême pour les environnements à haute chaleur.',
    status: 'active',
    featured: true,
    type: 'Automatique',
    products: 124,
    revenue: '12.5k€',
    createdAt: '12/05/2025',
    period: 'Juin - Août 2026',
    conv: '3.2%',
    growth: '+0.4%',
    topPerformer: 'Veste Orange Pro',
    visibility: { homepage: true, menu: true, mobile: true },
    categories: ['T-shirts & Polos', 'Pantalons', 'Accessoires'],
    rules: [
      { key: 'Catégorie', value: 'T-shirts & Polos, Pantalons, Accessoires' },
      { key: 'Prix', value: '< 100€' },
      { key: 'Tag', value: 'summer' },
    ],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCufEpXhPgJAUz1-voW0sXr3eMSNLHj5AT-xGwfwUGRAVBQhKYTZW0JKbm05nNvS9z7TzN9kGzV77NSM-1riT9HzbHJiplJ2G0auBx63vAVYfcDUpEhAGEV8pVBPVQ_N_NvNrTTCa0hlFZzYLQIEVYGkKXiE_Kl-W-5IfjBa-usajAglKPQ27f-9cu98-GAsUW6NX7PfIn_gi-HZR_lEvJPkXonHpRQAvlqIKpb2ZKDOQmXM7Q3nJ2uBkxcNEtPJtY-Xw1J8QJW9Qeu',
    associatedProducts: [
      { id: 1, name: 'Veste Orange Pro', sku: 'WP-2026-VOP', price: '89.00€', stock: 45, stockStatus: 'ok', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASR17itPbPtHgXqAFzuvp50hRQ1zu6E6y4OJ4TrlCiz9gD8uEQTA5qCBEz5Wr9-RaXvWikgS84Y_GpcbojYKt86TVT0EuGVgGqG8dR8uaUuL8WRMLran_6PYTeTeiO20qovSmddqkG0Yrh_Wr-Nr1aEkfacCWVnG6z6krBTkyFgLaHwh7hfVdA2x3cXWeYqL8cXRq7Zt7qS7vIRKwHQD1KYzvvKYAQd63IMMuCLwHpWzakP2z8H0v6q7zbrP9KMzN6cWZmc9_WRrua' },
      { id: 2, name: 'Sneaker Ventila S3', sku: 'WP-2026-VS3', price: '112.50€', stock: 12, stockStatus: 'low', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUGo4qPxYIhuPmMJ7UjFLi0mMrHTXFwsUmj3HyNmQoUoDRRwNx0mz6lDJN_vaO1shw30t4buZBL1UVdckpbe68GYnOxSo4t9Q3j62IzZXLqYWjeDqhQjTbRcyebVOR039fJTX7lLgTKcjjhtH-LNLWZ4v_b_H7azW1mnmXZm30uutQoSWOJmPgA96qVeZEKigJ5tDv3OyXUC4QDdLKoHgQLTF51QlabZwrlMHJNpElN4ASTBiRLxwb4I4G-IJ3yxdKnNZmPnTTsqCs' },
    ],
  },
  2: {
    id: 2,
    name: 'Heavy Duty 2025',
    description: '',
    status: 'draft',
    featured: false,
    type: 'Manuel',
    products: 0,
    revenue: '—',
    createdAt: '02/06/2025',
    period: 'Lancement Automne 2025',
    conv: '—',
    growth: '—',
    topPerformer: '—',
    visibility: { homepage: false, menu: false, mobile: false },
    categories: ['Vestes & Parkas', 'Chaussures'],
    rules: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjICHsBgeRQx2E_0RVN3bGQZCvYUMVqmq3dFxsitbv8h1POJnL1ihnIVvo5KENqMO1gqYyqJvgoz3fIwuR4dOXRdFzFKIyB_QHhxGPn9TpuOcV62vjrLIJ3qtKyvi0ZnFCunWteUzVrxWwD_avuYbPOIUAwLcHMGQth1TwzL0thphv2qxUFQ6njNG08K49lIn5I6GM_0HpNey8pMughpfJAPKBSrRYd51KyDARBmo3oZFtlucA3JMIcjcoWuQ3vr60AiLaU8FKeMEc',
    associatedProducts: [],
  },
  3: {
    id: 3,
    name: 'Winter Essentials',
    description: 'Collection hivernale essentielle.',
    status: 'expired',
    featured: false,
    type: 'Manuel',
    products: 86,
    revenue: '45.8k€',
    createdAt: '15/11/2024',
    period: 'Fermé : Mars 2025',
    conv: '2.8%',
    growth: '+18%',
    topPerformer: 'Parka Pro X',
    visibility: { homepage: false, menu: false, mobile: false },
    categories: ['Vestes & Parkas', 'Bottes', 'EPI'],
    rules: [],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEj2rOtUr4FyZsWeSKGKz-kvLXd1H_K0O1-OG6VNWPony0oSosGbyeXVYNUlDC-ow-Jh0VuG9xN6v3g4e0vRGeWBM7LgzbsbVewAMnRwrFSa92XemDBoAEfxEbzS374E3MMqr0GBX__-dfJsBcVb739dY1y3E1zc0yHGpflYVE2AzQ5bICqQRXzLtsQyZXwhAhYiPhIS_pCG1IROKqDLqQn2WfdsNDTNtSwKbAfWHTJWmQBbWTLum32fRrwECheUmLZmuTscQ9FSKK',
    associatedProducts: [],
  },
}

const allCategories = [
  'Vêtements', 'Vestes & Parkas', 'Pantalons', 'T-shirts & Polos',
  'Chaussures', 'Sécurité S3', 'Bottes',
  'EPI', 'Casques', 'Gants',
  'Accessoires', 'Promotions',
]

const statusConfig = {
  active:   { label: 'Actif',     bg: 'bg-emerald-100 text-emerald-800' },
  draft:    { label: 'Brouillon', bg: 'bg-slate-100 text-slate-600' },
  expired:  { label: 'Expirée',   bg: 'bg-red-100 text-red-700' },
  scheduled:{ label: 'Programmée',bg: 'bg-amber-100 text-amber-800' },
}

// ── Toggle ────────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex w-10 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${checked ? 'bg-brand' : 'bg-slate-200'}`}
    >
      <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────────


// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GererCollection() {
  const { id } = useParams()
  const navigate = useNavigate()

  const raw = mockCollections[Number(id)] || mockCollections[1]

  // Editable state
  const [nom, setNom] = useState(raw.name)
  const [description, setDescription] = useState(raw.description)
  const [visHomepage, setVisHomepage] = useState(raw.visibility.homepage)
  const [visMenu, setVisMenu] = useState(raw.visibility.menu)
  const [visMobile, setVisMobile] = useState(raw.visibility.mobile)
  const [featured, setFeatured] = useState(raw.featured)
  const [produits, setProduits] = useState(raw.associatedProducts)
  const [linkedCategories, setLinkedCategories] = useState(raw.categories || [])

  const toggleCategory = (cat) =>
    setLinkedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )

  const statusCfg = statusConfig[raw.status] || statusConfig.draft

  const handleSave = () => {
    if (!nom.trim()) { toast.error('Le nom est requis.'); return }
    toast.success('Collection mise à jour !')
    navigate('/collections')
  }

  const handleDelete = () => {
    toast.info('Collection supprimée.')
    navigate('/collections')
  }

  const removeProduct = (pid) => setProduits((prev) => prev.filter((p) => p.id !== pid))

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full space-y-8">

      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900">{nom}</h1>
            <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${statusCfg.bg}`}>
              {statusCfg.label}
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {featured && (
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                Vedette
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
              Visible
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 transition-colors rounded-xl flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">delete</span>
            Supprimer
          </button>
          <button className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 transition-colors rounded-xl border border-slate-200 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">open_in_new</span>
            Voir sur le site
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-brand text-white font-bold text-sm hover:bg-brand-dark transition-all rounded-xl shadow-lg shadow-brand/20 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Sauvegarder
          </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Produits"
          value={raw.products}
          sub="Inventaire géré"
          subColor="text-brand"
          icon="inventory_2"
          iconBg="bg-slate-50 text-slate-500"
        />
        <KpiCard
          label="Revenus"
          value={raw.revenue}
          sub="Objectif atteint"
          subColor="text-brand"
          icon="trending_up"
          iconBg="bg-emerald-50 text-brand"
        />
        <KpiCard
          label="Statut"
          value={
            <span className="flex items-center gap-2">
              {raw.status === 'active' && <span className="w-2.5 h-2.5 bg-brand rounded-full inline-block" />}
              {statusCfg.label}
            </span>
          }
          sub="Surveillance active"
          subColor="text-slate-500"
          icon="info"
          iconBg={statusCfg.bg}
        />
        <KpiCard
          label="Créé le"
          value={raw.createdAt}
          sub={raw.period}
          subColor="text-brand"
          icon="calendar_today"
          iconBg="bg-slate-50 text-slate-500"
        />
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

        {/* ══ Left column 2/3 ══════════════════════════════════════════════════ */}
        <div className="lg:col-span-2 space-y-8">

          {/* Informations générales */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-brand">edit_note</span>
              <h3 className="font-bold text-slate-800">Informations générales</h3>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nom de la collection</label>
                <input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white transition-all outline-none resize-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Catégories liées */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
              <span className="material-symbols-outlined text-brand">category</span>
              <h3 className="font-bold text-slate-800">Catégories liées</h3>
              <span className="ml-auto px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-black">
                {linkedCategories.length}
              </span>
            </div>
            <div className="p-8">
              <p className="text-xs text-slate-500 mb-4">Sélectionnez les catégories associées à cette collection.</p>
              <div className="flex flex-wrap gap-2">
                {allCategories.map((cat) => {
                  const active = linkedCategories.includes(cat)
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        active
                          ? 'bg-brand text-white border-brand shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-brand/40 hover:text-brand'
                      }`}
                    >
                      {active && (
                        <span className="material-symbols-outlined text-[14px] mr-1 align-middle">check</span>
                      )}
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Produits associés */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
              <h3 className="font-bold text-slate-800">Produits associés</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-brand/10 text-brand rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-brand/20 transition-colors">
                <span className="material-symbols-outlined text-sm">add</span>
                Ajouter un produit
              </button>
            </div>
            <div className="overflow-x-auto">
              {produits.length === 0 ? (
                <div className="py-12 flex flex-col items-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl mb-3">inventory</span>
                  <p className="text-sm font-medium">Aucun produit associé</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Image</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500">Produit</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Prix</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Stock</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {produits.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">SKU: {p.sku}</p>
                        </td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-700 text-sm">{p.price}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                            p.stockStatus === 'low'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {p.stock} unités
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => removeProduct(p.id)}
                            className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Logique de collection */}
          {raw.type === 'Automatique' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center gap-3">
                <span className="material-symbols-outlined text-brand">settings_suggest</span>
                <h3 className="font-bold text-slate-800">Logique de collection</h3>
              </div>
              <div className="p-8">
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <p className="font-bold text-slate-800">Sélection automatique</p>
                      <p className="text-xs text-slate-500 mt-1">Les produits sont ajoutés dynamiquement selon les règles suivantes.</p>
                    </div>
                    <span className="material-symbols-outlined text-brand">auto_awesome</span>
                  </div>
                  <div className="space-y-3">
                    {raw.rules.map((rule) => (
                      <div key={rule.key} className="flex items-center gap-4 bg-white p-3 rounded-lg border border-slate-200">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 w-24">{rule.key}</span>
                        <span className="text-xs font-bold text-brand px-2.5 py-1 bg-brand/5 rounded-lg">{rule.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ══ Right column 1/3 ═════════════════════════════════════════════════ */}
        <div className="space-y-8">

          {/* Visibilité & Disponibilité */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 border-b border-slate-100 pb-4">
              Visibilité & Disponibilité
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Visible Homepage', state: visHomepage, set: setVisHomepage, icon: 'home' },
                { label: 'Navigation Menu', state: visMenu, set: setVisMenu, icon: 'menu' },
                { label: 'Application Mobile', state: visMobile, set: setVisMobile, icon: 'smartphone' },
              ].map(({ label, state, set, icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-slate-400 text-lg">{icon}</span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                  <Toggle checked={state} onChange={set} />
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Période de publication</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-xs font-bold text-slate-800">{raw.period}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[10px] text-slate-500">Planifiée</span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-tighter ${statusCfg.bg}`}>
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Performances</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Conv. Rate</p>
                <p className="text-xl font-black text-brand">{raw.conv}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Croissance</p>
                <p className="text-xl font-black text-brand">{raw.growth}</p>
              </div>
            </div>
            <div className="p-3 bg-brand/5 border border-brand/10 rounded-xl">
              <p className="text-[9px] font-black uppercase text-slate-500 mb-1">Top Performer</p>
              <p className="text-sm font-bold text-brand">{raw.topPerformer}</p>
            </div>
            {/* Live preview */}
            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Aperçu miniature</p>
              <div className="relative h-32 rounded-xl overflow-hidden group cursor-zoom-in">
                <img
                  src={raw.image}
                  alt={raw.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/80 to-transparent flex flex-col justify-end p-4">
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">{raw.name}</p>
                  <p className="text-white/80 text-[8px] leading-tight mt-0.5">{raw.description?.slice(0, 60) || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Actions rapides</p>
            <button
              onClick={() => setFeatured((f) => !f)}
              className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: featured ? "'FILL' 1" : "'FILL' 0" }}>star</span>
              {featured ? 'Retirer de la vedette' : 'Mettre en vedette'}
            </button>
            <button className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">content_copy</span>
              Dupliquer
            </button>
            <button
              onClick={handleDelete}
              className="w-full py-3 bg-white hover:bg-red-50 text-red-500 font-bold text-xs rounded-xl border border-red-100 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">block</span>
              Désactiver
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
