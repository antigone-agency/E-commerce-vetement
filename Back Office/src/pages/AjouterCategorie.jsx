import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import CustomSelect from '../components/ui/CustomSelect'

// ── Reusable helpers ──────────────────────────────────────────────────────────
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

function Label({ children, required }) {
  return (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  )
}

function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all placeholder:text-slate-400 outline-none ${className}`}
      {...props}
    />
  )
}

// ── Parent options ─────────────────────────────────────────────────────────────
const parentOptions = [
  { value: '', label: 'Aucun (catégorie racine)' },
  { value: 'vetements', label: 'Vêtements' },
  { value: 'chaussures', label: 'Chaussures' },
  { value: 'epi', label: 'EPI' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'promotions', label: 'Promotions' },
]

export default function AjouterCategorie() {
  const navigate = useNavigate()

  const [nom, setNom] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [parent, setParent] = useState('')
  const [type, setType] = useState('Principale')
  const [metaTitle, setMetaTitle] = useState('')
  const [metaDesc, setMetaDesc] = useState('')

  // Visibilité
  const [visMenu, setVisMenu] = useState(true)
  const [visHomepage, setVisHomepage] = useState(false)
  const [visMobile, setVisMobile] = useState(false)
  const [visFooter, setVisFooter] = useState(false)

  // Status
  const [statut, setStatut] = useState('actif')
  const [vedette, setVedette] = useState(false)

  // Image
  const [imageName, setImageName] = useState('')

  // Auto-generate slug from nom
  const handleNomChange = (val) => {
    setNom(val)
    const autoSlug = '/' + val.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setSlug(autoSlug)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!nom.trim()) {
      toast.error('Le nom est obligatoire.')
      return
    }
    toast.success(`Catégorie "${nom}" créée avec succès !`)
    navigate('/categories')
  }

  return (
    <div className="p-6 max-w-5xl mx-auto w-full space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/categories')}
            className="text-slate-400 hover:text-brand transition-colors p-1 rounded-lg hover:bg-brand/5">
            <span className="material-symbols-outlined text-xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">Ajouter une catégorie</h1>
            <p className="text-xs text-slate-400">Remplissez les informations pour créer une nouvelle catégorie.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/categories')}
            className="px-5 py-2.5 rounded-custom text-sm font-bold border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
            Annuler
          </button>
          <button onClick={handleSubmit}
            className="px-5 py-2.5 rounded-custom text-sm font-bold text-white bg-brand hover:bg-brand-dark transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">save</span>
            Enregistrer
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Column (2/3) ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Informations générales */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">info</span>
              <h2 className="text-sm font-bold text-slate-700">Informations générales</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label required>Nom de la catégorie</Label>
                <Input value={nom} onChange={(e) => handleNomChange(e.target.value)} placeholder="ex : Vêtements de travail" />
              </div>
              <div>
                <Label>Slug / URL</Label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono bg-slate-50 px-3 py-2.5 rounded-lg border border-slate-200">votresite.com</span>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="/slug-auto-genere" className="font-mono text-xs" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Généré automatiquement à partir du nom. Modifiable manuellement.</p>
              </div>
              <div>
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Description de la catégorie (visible sur le site)..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all placeholder:text-slate-400 outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Hiérarchie & Organisation */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">account_tree</span>
              <h2 className="text-sm font-bold text-slate-700">Hiérarchie & Organisation</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label>Catégorie parente</Label>
                  <CustomSelect value={parent} onChange={setParent} options={parentOptions} placeholder="Sélectionner une catégorie parente" />
                </div>
              </div>
              <div>
                <Label>Type</Label>
                <div className="flex gap-3">
                  {['Principale', 'Secondaire'].map((t) => (
                    <button key={t} type="button" onClick={() => setType(t)}
                      className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${type === t ? 'border-brand bg-brand/10 text-brand' : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">travel_explore</span>
              <h2 className="text-sm font-bold text-slate-700">SEO & Référencement</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label>Meta titre</Label>
                <Input value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} placeholder="Titre pour les moteurs de recherche" />
                <p className="text-[11px] text-slate-400 mt-1">{metaTitle.length}/60 caractères recommandés</p>
              </div>
              <div>
                <Label>Meta description</Label>
                <textarea
                  value={metaDesc}
                  onChange={(e) => setMetaDesc(e.target.value)}
                  rows={3}
                  placeholder="Description courte pour les moteurs de recherche..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all placeholder:text-slate-400 outline-none resize-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">{metaDesc.length}/160 caractères recommandés</p>
              </div>
              {/* Aperçu Google */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Aperçu Google</p>
                <p className="text-blue-700 text-sm font-medium truncate">{metaTitle || nom || 'Titre de la catégorie'}</p>
                <p className="text-green-700 text-xs font-mono truncate">votresite.com{slug || '/categorie'}</p>
                <p className="text-slate-500 text-xs mt-0.5 line-clamp-2">{metaDesc || 'Description de la catégorie...'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column (1/3) ────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Image */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">image</span>
              <h2 className="text-sm font-bold text-slate-700">Image</h2>
            </div>
            <div className="p-6">
              {imageName ? (
                <div className="relative bg-slate-50 rounded-lg border border-slate-200 p-4 flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand">image</span>
                  <span className="text-sm text-slate-700 truncate flex-1">{imageName}</span>
                  <button type="button" onClick={() => setImageName('')} className="text-red-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-slate-200 rounded-lg p-8 text-center cursor-pointer hover:border-brand/40 hover:bg-brand/5 transition-colors">
                  <span className="material-symbols-outlined text-3xl text-slate-300 mb-2 block">cloud_upload</span>
                  <p className="text-xs font-bold text-slate-500">Cliquer ou glisser une image</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP — max 2 Mo</p>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                    if (e.target.files?.[0]) setImageName(e.target.files[0].name)
                  }} />
                </label>
              )}
            </div>
          </div>

          {/* Statut */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">toggle_on</span>
              <h2 className="text-sm font-bold text-slate-700">Statut</h2>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <Label>Statut</Label>
                <CustomSelect value={statut} onChange={setStatut} options={[
                  { value: 'actif', label: 'Actif' },
                  { value: 'brouillon', label: 'Brouillon' },
                  { value: 'planifié', label: 'Planifié' },
                  { value: 'désactivé', label: 'Désactivé' },
                ]} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-700">En vedette</p>
                  <p className="text-[11px] text-slate-400">Afficher en priorité sur le site</p>
                </div>
                <Toggle checked={vedette} onChange={setVedette} />
              </div>
            </div>
          </div>

          {/* Visibilité */}
          <div className="bg-white rounded-custom border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <span className="material-symbols-outlined text-brand text-lg">visibility</span>
              <h2 className="text-sm font-bold text-slate-700">Visibilité</h2>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Menu principal', desc: 'Afficher dans la navigation', state: visMenu, set: setVisMenu, icon: 'menu' },
                { label: 'Page d\'accueil', desc: 'Afficher sur la homepage', state: visHomepage, set: setVisHomepage, icon: 'home' },
                { label: 'Application mobile', desc: 'Visible sur le mobile', state: visMobile, set: setVisMobile, icon: 'smartphone' },
                { label: 'Footer', desc: 'Afficher dans le pied de page', state: visFooter, set: setVisFooter, icon: 'call_to_action' },
              ].map((v) => (
                <div key={v.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400 text-lg">{v.icon}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-700">{v.label}</p>
                      <p className="text-[11px] text-slate-400">{v.desc}</p>
                    </div>
                  </div>
                  <Toggle checked={v.state} onChange={v.set} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
