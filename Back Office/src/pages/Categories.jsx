import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import KpiCard from '../components/ui/KpiCard'
import PageHeader from '../components/ui/PageHeader'
import CustomSelect from '../components/ui/CustomSelect'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const kpiData = [
  { label: 'Total Catégories', value: '18', sub: '+3 ce mois', subColor: 'text-emerald-500', icon: 'folder', iconBg: 'bg-slate-50 text-slate-500' },
  { label: 'Catégories Actives', value: '14', sub: '78% total', subColor: 'text-slate-400', icon: 'check_circle', iconBg: 'bg-emerald-50 text-brand' },
  { label: 'Produits Catégorisés', value: '1 284', sub: '98% couvert', subColor: 'text-emerald-500', icon: 'inventory_2', iconBg: 'bg-blue-50 text-blue-500' },
  { label: 'Niveaux Max', value: '3', sub: '3 niveaux', subColor: 'text-slate-400', icon: 'account_tree', iconBg: 'bg-purple-50 text-purple-500' },
]

const initialCategories = [
  { id: 1, nom: 'Vêtements',           slug: '/vetements',                parent: null,        parentId: null, niveau: 0, type: 'Principale', produits: 342, sousCategories: 3, visibilite: ['menu', 'homepage', 'mobile'], statut: 'actif',     ordre: 1, vedette: true,  img: null },
  { id: 2, nom: 'Vestes & Parkas',     slug: '/vetements/vestes-parkas',  parent: 'Vêtements', parentId: 1,    niveau: 1, type: 'Secondaire', produits: 89,  sousCategories: 0, visibilite: ['menu', 'mobile'],              statut: 'actif',     ordre: 1, vedette: false, img: null },
  { id: 3, nom: 'Pantalons',           slug: '/vetements/pantalons',      parent: 'Vêtements', parentId: 1,    niveau: 1, type: 'Secondaire', produits: 124, sousCategories: 0, visibilite: ['menu'],                       statut: 'actif',     ordre: 2, vedette: false, img: null },
  { id: 4, nom: 'T-shirts & Polos',    slug: '/vetements/tshirts-polos',  parent: 'Vêtements', parentId: 1,    niveau: 1, type: 'Secondaire', produits: 129, sousCategories: 0, visibilite: ['menu', 'homepage'],            statut: 'actif',     ordre: 3, vedette: true,  img: null },
  { id: 5, nom: 'Chaussures',          slug: '/chaussures',               parent: null,        parentId: null, niveau: 0, type: 'Principale', produits: 156, sousCategories: 2, visibilite: ['menu', 'homepage', 'footer'], statut: 'actif',     ordre: 2, vedette: true,  img: null },
  { id: 6, nom: 'Sécurité S3',         slug: '/chaussures/securite-s3',   parent: 'Chaussures',parentId: 5,    niveau: 1, type: 'Secondaire', produits: 78,  sousCategories: 0, visibilite: ['menu'],                       statut: 'actif',     ordre: 1, vedette: false, img: null },
  { id: 7, nom: 'Bottes',              slug: '/chaussures/bottes',        parent: 'Chaussures',parentId: 5,    niveau: 1, type: 'Secondaire', produits: 45,  sousCategories: 0, visibilite: ['menu', 'mobile'],              statut: 'brouillon', ordre: 2, vedette: false, img: null },
  { id: 8, nom: 'EPI',                 slug: '/epi',                      parent: null,        parentId: null, niveau: 0, type: 'Principale', produits: 210, sousCategories: 2, visibilite: ['menu', 'homepage', 'mobile', 'footer'], statut: 'actif', ordre: 3, vedette: true, img: null },
  { id: 9, nom: 'Casques',             slug: '/epi/casques',              parent: 'EPI',       parentId: 8,    niveau: 1, type: 'Secondaire', produits: 34,  sousCategories: 0, visibilite: ['menu'],                       statut: 'actif',     ordre: 1, vedette: false, img: null },
  { id: 10, nom: 'Gants',              slug: '/epi/gants',                parent: 'EPI',       parentId: 8,    niveau: 1, type: 'Secondaire', produits: 56,  sousCategories: 0, visibilite: ['menu', 'mobile'],              statut: 'planifié',  ordre: 2, vedette: false, img: null },
  { id: 11, nom: 'Accessoires',        slug: '/accessoires',              parent: null,        parentId: null, niveau: 0, type: 'Principale', produits: 98,  sousCategories: 0, visibilite: ['menu', 'footer'],              statut: 'actif',     ordre: 4, vedette: false, img: null },
  { id: 12, nom: 'Promotions',         slug: '/promotions',               parent: null,        parentId: null, niveau: 0, type: 'Principale', produits: 45,  sousCategories: 0, visibilite: ['homepage', 'mobile'],           statut: 'désactivé', ordre: 5, vedette: false, img: null },
]

const statutMap = {
  'actif':     { bg: 'bg-emerald-100 text-emerald-700', label: 'ACTIF' },
  'brouillon': { bg: 'bg-slate-100 text-slate-600',     label: 'BROUILLON' },
  'planifié':  { bg: 'bg-blue-100 text-blue-700',       label: 'PLANIFIÉ' },
  'désactivé': { bg: 'bg-red-100 text-red-600',         label: 'DÉSACTIVÉ' },
}

const visBadge = {
  menu:     { bg: 'bg-brand/10 text-brand',      label: 'Menu' },
  homepage: { bg: 'bg-amber-100 text-amber-700',  label: 'Homepage' },
  mobile:   { bg: 'bg-purple-100 text-purple-700', label: 'Mobile' },
  footer:   { bg: 'bg-slate-100 text-slate-600',   label: 'Footer' },
}

const allStatuts = ['Tous', 'actif', 'brouillon', 'planifié', 'désactivé']
const allStatutsOpts = allStatuts.map((s) => ({ value: s, label: s === 'Tous' ? 'Statut: Tous' : s.charAt(0).toUpperCase() + s.slice(1) }))
const allTypes = ['Tous', 'Principale', 'Secondaire']
const allTypesOpts = allTypes.map((t) => ({ value: t, label: t === 'Tous' ? 'Type: Tous' : t }))
const allVisibilites = ['Tous', 'menu', 'homepage', 'mobile', 'footer']
const allVisibilitesOpts = allVisibilites.map((v) => ({ value: v, label: v === 'Tous' ? 'Visibilité: Tous' : v.charAt(0).toUpperCase() + v.slice(1) }))
const allNiveaux = ['Tous', '0', '1']
const allNiveauxOpts = allNiveaux.map((n) => ({ value: n, label: n === 'Tous' ? 'Niveau: Tous' : `Niveau ${n}` }))

export default function Categories() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState('Tous')
  const [filterType, setFilterType] = useState('Tous')
  const [filterVis, setFilterVis] = useState('Tous')
  const [filterNiveau, setFilterNiveau] = useState('Tous')
  const [expanded, setExpanded] = useState({})
  const dragItem = useRef(null)
  const dragOver = useRef(null)

  // ── Helpers ────────────────────────────────────────────────────────
  const toggleExpand = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }))

  const toggleActive = (id) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, statut: c.statut === 'actif' ? 'désactivé' : 'actif' } : c
      )
    )
  }

  const toggleVedette = (id) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, vedette: !c.vedette } : c))
    )
  }

  const handleDuplicate = (cat) => {
    const newCat = {
      ...cat,
      id: Math.max(...categories.map((c) => c.id)) + 1,
      nom: cat.nom + ' (copie)',
      slug: cat.slug + '-copie',
      statut: 'brouillon',
    }
    setCategories((prev) => [...prev, newCat])
    toast.success(`"${cat.nom}" dupliquée.`)
  }

  const handleDelete = (id) => {
    setCategories((prev) => prev.filter((c) => c.id !== id && c.parentId !== id))
    toast.success('Catégorie supprimée.')
  }

  // ── Drag & Drop ───────────────────────────────────────────────────
  const handleDragStart = (idx) => { dragItem.current = idx }
  const handleDragEnter = (idx) => { dragOver.current = idx }
  const handleDragEnd = () => {
    if (dragItem.current === null || dragOver.current === null) return
    const copy = [...categories]
    const item = copy.splice(dragItem.current, 1)[0]
    copy.splice(dragOver.current, 0, item)
    const reordered = copy.map((c, i) => ({ ...c, ordre: i + 1 }))
    setCategories(reordered)
    dragItem.current = null
    dragOver.current = null
  }

  // ── Filter ────────────────────────────────────────────────────────
  const filtered = categories.filter((c) => {
    if (search && !c.nom.toLowerCase().includes(search.toLowerCase()) && !c.slug.toLowerCase().includes(search.toLowerCase())) return false
    if (filterStatut !== 'Tous' && c.statut !== filterStatut) return false
    if (filterType !== 'Tous' && c.type !== filterType) return false
    if (filterVis !== 'Tous' && !c.visibilite.includes(filterVis)) return false
    if (filterNiveau !== 'Tous' && c.niveau !== Number(filterNiveau)) return false
    return true
  })

  // Build tree view
  const parents = filtered.filter((c) => c.niveau === 0)
  const getChildren = (parentId) => filtered.filter((c) => c.parentId === parentId)

  const renderRow = (cat, idx, isChild = false) => (
    <tr
      key={cat.id}
      draggable
      onDragStart={() => handleDragStart(idx)}
      onDragEnter={() => handleDragEnter(idx)}
      onDragEnd={handleDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="hover:bg-slate-50/80 transition-colors group"
    >
      {/* Drag Handle + Ordre */}
      <td className="px-3 py-3 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-300 cursor-grab active:cursor-grabbing text-lg group-hover:text-slate-500 transition-colors">drag_indicator</span>
          <span className="text-xs font-bold text-slate-400 w-5 text-center">{cat.ordre}</span>
        </div>
      </td>
      {/* Image */}
      <td className="px-3 py-3">
        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
          <span className="material-symbols-outlined text-slate-300 text-lg">
            {cat.niveau === 0 ? 'folder' : 'subdirectory_arrow_right'}
          </span>
        </div>
      </td>
      {/* Nom (hiérarchique) */}
      <td className="px-3 py-3">
        <div className={`flex items-center gap-2 ${isChild ? 'pl-6' : ''}`}>
          {cat.sousCategories > 0 && (
            <button onClick={() => toggleExpand(cat.id)} className="text-slate-400 hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-lg">
                {expanded[cat.id] ? 'expand_more' : 'chevron_right'}
              </span>
            </button>
          )}
          {isChild && (
            <span className="text-slate-300 text-sm select-none">└</span>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-800">{cat.nom}</span>
              {cat.vedette && (
                <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
              )}
              {cat.sousCategories > 0 && (
                <span className="text-[10px] text-slate-400 font-medium">({cat.sousCategories})</span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 font-mono">{cat.slug}</p>
          </div>
        </div>
      </td>
      {/* Type */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.type === 'Principale' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-500'}`}>
          {cat.type.toUpperCase()}
        </span>
      </td>
      {/* Produits */}
      <td className="px-3 py-3 whitespace-nowrap text-sm font-bold text-slate-800">{cat.produits}</td>
      {/* Visibilité */}
      <td className="px-3 py-3">
        <div className="flex flex-wrap gap-1">
          {cat.visibilite.map((v) => (
            <span key={v} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${visBadge[v]?.bg}`}>
              {visBadge[v]?.label}
            </span>
          ))}
        </div>
      </td>
      {/* Statut */}
      <td className="px-3 py-3 whitespace-nowrap">
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${statutMap[cat.statut]?.bg}`}>
          {statutMap[cat.statut]?.label}
        </span>
      </td>
      {/* Actions */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
          {/* Toggle actif */}
          <button
            onClick={() => toggleActive(cat.id)}
            title={cat.statut === 'actif' ? 'Désactiver' : 'Activer'}
            className={`p-1 rounded transition-colors ${cat.statut === 'actif' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-lg">
              {cat.statut === 'actif' ? 'toggle_on' : 'toggle_off'}
            </span>
          </button>
          {/* Vedette */}
          <button
            onClick={() => toggleVedette(cat.id)}
            title="En vedette"
            className={`p-1 rounded transition-colors ${cat.vedette ? 'text-amber-400 hover:bg-amber-50' : 'text-slate-300 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined text-lg">{cat.vedette ? 'star' : 'star_border'}</span>
          </button>
          {/* Preview */}
          <button title="Voir sur le site" className="p-1 rounded text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors">
            <span className="material-symbols-outlined text-lg">language</span>
          </button>
          {/* Dupliquer */}
          <button onClick={() => handleDuplicate(cat)} title="Dupliquer" className="p-1 rounded text-slate-400 hover:text-purple-500 hover:bg-purple-50 transition-colors">
            <span className="material-symbols-outlined text-lg">content_copy</span>
          </button>
          {/* Modifier */}
          <button title="Modifier" className="p-1 rounded text-slate-400 hover:text-brand hover:bg-brand/10 transition-colors">
            <span className="material-symbols-outlined text-lg">edit</span>
          </button>
          {/* Supprimer */}
          <button onClick={() => handleDelete(cat.id)} title="Supprimer" className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>
      </td>
    </tr>
  )

  // Flatten rows for drag indexing
  let flatIdx = 0
  const tableRows = []
  parents.forEach((p) => {
    tableRows.push(renderRow(p, flatIdx++))
    if (expanded[p.id]) {
      getChildren(p.id).forEach((child) => {
        tableRows.push(renderRow(child, flatIdx++, true))
      })
    }
  })
  // Also show orphan children (when filtering shows children without parents)
  const orphanChildren = filtered.filter((c) => c.niveau === 1 && !parents.find((p) => p.id === c.parentId))
  orphanChildren.forEach((c) => {
    tableRows.push(renderRow(c, flatIdx++, true))
  })

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">

      {/* Page Header */}
      <PageHeader title="Catégories">
        <PageHeader.SecondaryBtn icon="download">Exporter</PageHeader.SecondaryBtn>
        <PageHeader.SecondaryBtn icon="upload">Importer</PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="add" onClick={() => navigate('/categories/nouveau')}>
          Ajouter Catégorie
        </PageHeader.PrimaryBtn>
      </PageHeader>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((k) => <KpiCard key={k.label} {...k} />)}
      </div>

      {/* Filters */}
      <div className="bg-white p-5 rounded-custom border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom ou slug..."
              className="block w-full pl-11 pr-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-custom text-sm focus:ring-brand focus:border-brand transition-all placeholder:text-slate-400 outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <CustomSelect value={filterStatut} onChange={setFilterStatut} options={allStatutsOpts} size="sm" />
            <CustomSelect value={filterType} onChange={setFilterType} options={allTypesOpts} size="sm" />
            <CustomSelect value={filterVis} onChange={setFilterVis} options={allVisibilitesOpts} size="sm" />
            <CustomSelect value={filterNiveau} onChange={setFilterNiveau} options={allNiveauxOpts} size="sm" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-custom border border-slate-200 shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider font-bold">
            <tr>
              <th className="px-3 py-3 w-20">Ordre</th>
              <th className="px-3 py-3 w-16">Image</th>
              <th className="px-3 py-3">Nom / Slug</th>
              <th className="px-3 py-3">Type</th>
              <th className="px-3 py-3">Produits</th>
              <th className="px-3 py-3">Visibilité</th>
              <th className="px-3 py-3">Statut</th>
              <th className="px-3 py-3 w-52">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tableRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-slate-400">
                  <span className="material-symbols-outlined text-3xl text-slate-300 block mb-2">search_off</span>
                  Aucune catégorie trouvée
                </td>
              </tr>
            ) : (
              tableRows
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
          <span>{filtered.length} catégorie{filtered.length > 1 ? 's' : ''}</span>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="bg-brand text-white w-5 h-5 flex items-center justify-center rounded text-[10px]">1</span>
            <button className="p-1 hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
