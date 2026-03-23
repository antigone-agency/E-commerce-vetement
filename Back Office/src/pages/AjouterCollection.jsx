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
      className={`relative inline-flex w-10 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
        checked ? 'bg-brand' : 'bg-slate-200'
      }`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
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

function Section({ title, children, rightSlot }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1 h-5 bg-brand rounded-full" />
          <h3 className="font-bold text-slate-800">{title}</h3>
        </div>
        {rightSlot}
      </div>
      <div className="p-8">{children}</div>
    </div>
  )
}

function UploadZone({ icon, title, subtitle, aspect = 'aspect-square' }) {
  return (
    <div className={`border-2 border-dashed border-slate-200 rounded-xl ${aspect} flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-brand/40 transition-all cursor-pointer group`}>
      <span className="material-symbols-outlined text-4xl text-slate-300 group-hover:text-brand transition-colors mb-2">{icon}</span>
      <p className="text-xs text-slate-500 font-medium">{title}</p>
      {subtitle && <p className="text-[10px] text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

const performanceOptions = [
  { value: 'standard', label: 'Standard' },
  { value: 'best-sellers', label: 'Best Sellers' },
  { value: 'nouveautes', label: 'Nouveautés' },
]

const allCategories = [
  'Vêtements', 'Vestes & Parkas', 'Pantalons', 'T-shirts & Polos',
  'Chaussures', 'Sécurité S3', 'Bottes',
  'EPI', 'Casques', 'Gants',
  'Accessoires', 'Promotions',
]

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AjouterCollection() {
  const navigate = useNavigate()

  // Informations générales
  const [nom, setNom] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('manuel') // 'manuel' | 'auto'

  // Règles dynamiques
  const [tags, setTags] = useState('')
  const [prixMax, setPrixMax] = useState('')
  const [performance, setPerformance] = useState('standard')

  // Paramètres
  const [statut, setStatut] = useState('active') // 'active' | 'draft'
  const [featured, setFeatured] = useState(false)
  const [priorite, setPriorite] = useState('')

  // Visibilité
  const [visHomepage, setVisHomepage] = useState(true)
  const [visMenu, setVisMenu] = useState(true)
  const [visMobile, setVisMobile] = useState(true)

  // Période
  const [dateDebut, setDateDebut] = useState('')
  const [dateFin, setDateFin] = useState('')

  // Produits search
  const [searchProduits, setSearchProduits] = useState('')

  // Catégories liées
  const [linkedCategories, setLinkedCategories] = useState([])

  const toggleCategory = (cat) =>
    setLinkedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )

  const handleSave = () => {
    if (!nom.trim()) {
      toast.error('Le nom de la collection est requis.')
      return
    }
    toast.success('Collection enregistrée avec succès !')
    navigate('/collections')
  }

  return (
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">

      {/* ── Page Header ── */}
      <div className="flex items-center justify-between gap-4 mb-10">
        <h2 className="text-2xl font-bold text-slate-900">
          Ajouter une collection
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/collections')}
            className="px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl text-sm flex items-center gap-2 hover:bg-slate-200 transition-all border border-slate-200"
          >
            <span className="material-symbols-outlined text-lg">close</span>
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl text-sm flex items-center gap-2 shadow-lg shadow-brand/20 hover:bg-brand-dark transition-all"
          >
            <span className="material-symbols-outlined text-lg">save</span>
            Enregistrer la collection
          </button>
        </div>
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-8 items-start">

        {/* ══ Left column ══════════════════════════════════════════════════════ */}
        <div className="col-span-12 lg:col-span-8 space-y-8">

          {/* Informations générales */}
          <Section title="Informations générales">
            <div className="space-y-6">

              <div>
                <Label required>Nom de la collection</Label>
                <Input
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  placeholder="ex: Summer Series 2026"
                />
              </div>

              <div>
                <Label>Description</Label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="Décrivez l'esprit de cette collection..."
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all placeholder:text-slate-400 outline-none resize-none"
                />
              </div>

              {/* Type de collection */}
              <div className="pt-4 border-t border-slate-100">
                <Label>Type de collection</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  {[
                    { value: 'manuel', title: 'Manuel', desc: 'Choisissez les produits un par un' },
                    { value: 'auto', title: 'Automatique', desc: 'Basé sur des règles dynamiques' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      onClick={() => setType(opt.value)}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        type === opt.value
                          ? 'border-brand bg-brand/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        type === opt.value ? 'border-brand' : 'border-slate-300'
                      }`}>
                        {type === opt.value && (
                          <div className="w-2 h-2 rounded-full bg-brand" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{opt.title}</p>
                        <p className="text-[10px] text-slate-500">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Règles dynamiques */}
              <div className="pt-6 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Règles dynamiques</Label>
                  <button className="text-xs font-bold text-brand hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">add</span>
                    Ajouter une règle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Tags</label>
                    <Input
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="ex: Été, Promo"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Prix inférieur à</label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={prixMax}
                        onChange={(e) => setPrixMax(e.target.value)}
                        placeholder="0.00"
                        className="pr-8"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">€</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">Performance</label>
                    <CustomSelect
                      value={performance}
                      onChange={setPerformance}
                      options={performanceOptions}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

            </div>
          </Section>

          {/* Média */}
          <Section title="Média">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Image principale</Label>
                <UploadZone
                  icon="add_photo_alternate"
                  title="Glisser une image ici"
                  subtitle="Format carré recommandé"
                  aspect="aspect-square"
                />
              </div>
              <div className="space-y-3">
                <Label>Bannière de collection</Label>
                <UploadZone
                  icon="image"
                  title="Importer une bannière"
                  subtitle="1920 × 1080px"
                  aspect="aspect-video"
                />
                <Label>Image mobile (optionnel)</Label>
                <UploadZone
                  icon="smartphone"
                  title="Format Portrait"
                  aspect="h-32"
                />
              </div>
            </div>
          </Section>

          {/* Catégories liées */}
          <Section
            title="Catégories liées"
            rightSlot={
              <span className="text-xs font-medium text-brand bg-brand/5 px-3 py-1 rounded-full">
                {linkedCategories.length} catégorie{linkedCategories.length > 1 ? 's' : ''}
              </span>
            }
          >
            <p className="text-[10px] text-slate-400 mb-4">Sélectionnez les catégories associées à cette collection. Les produits de ces catégories pourront être inclus dans la collection.</p>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    linkedCategories.includes(cat)
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {linkedCategories.includes(cat) && (
                    <span className="material-symbols-outlined text-xs align-middle mr-1">check</span>
                  )}
                  {cat}
                </button>
              ))}
            </div>
          </Section>

          {/* Produits sélectionnés */}
          <Section
            title="Produits sélectionnés"
            rightSlot={
              <span className="text-xs font-medium text-brand bg-brand/5 px-3 py-1 rounded-full">
                0 produits sélectionnés
              </span>
            }
          >
            <div className="relative mb-6">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <span className="material-symbols-outlined">search</span>
              </span>
              <input
                type="text"
                value={searchProduits}
                onChange={(e) => setSearchProduits(e.target.value)}
                placeholder="Rechercher des produits par nom, SKU ou catégorie..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white transition-all outline-none placeholder:text-slate-400"
              />
            </div>
            {/* Empty state */}
            <div className="py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-slate-400">inventory</span>
              </div>
              <p className="text-sm font-medium text-slate-500">Aucun produit ajouté à la collection pour le moment</p>
              <button className="mt-4 text-xs font-bold text-brand uppercase tracking-widest hover:underline">
                Parcourir tout l'inventaire
              </button>
            </div>
          </Section>
        </div>

        {/* ══ Right column ═════════════════════════════════════════════════════ */}
        <div className="col-span-12 lg:col-span-4 space-y-8">

          {/* Paramètres */}
          <Section title="Paramètres">
            <div className="space-y-8">

              {/* Statut */}
              <div>
                <Label>Statut de publication</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[
                    { value: 'active', title: 'Actif', desc: 'Visible en ligne' },
                    { value: 'draft', title: 'Brouillon', desc: 'Interne uniquement' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatut(opt.value)}
                      className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                        statut === opt.value
                          ? 'border-brand bg-brand/5'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {statut === opt.value && (
                        <span className="material-symbols-outlined absolute top-2 right-2 text-brand text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      )}
                      <span className={`text-sm font-bold ${statut === opt.value ? 'text-brand' : 'text-slate-600'}`}>{opt.title}</span>
                      <span className={`text-[10px] text-center leading-tight mt-0.5 ${statut === opt.value ? 'text-brand/70' : 'text-slate-400'}`}>{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* En vedette */}
              <div className="pt-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">En vedette</p>
                    <p className="text-[11px] text-slate-500">Carrousel principal</p>
                  </div>
                  <Toggle checked={featured} onChange={setFeatured} />
                </div>

                {/* Priorité */}
                <div className="pt-4 border-t border-slate-100">
                  <Label>Priorité d'affichage</Label>
                  <Input
                    type="number"
                    value={priorite}
                    onChange={(e) => setPriorite(e.target.value)}
                    placeholder="0"
                  />
                  <p className="text-[10px] text-slate-400 mt-1 italic">
                    Plus le nombre est élevé, plus elle apparaît en premier.
                  </p>
                </div>
              </div>

            </div>
          </Section>

          {/* Visibilité Front */}
          <Section title="Visibilité Front">
            <div className="space-y-3">
              {[
                { key: 'homepage', icon: 'home', label: 'Visible Homepage', state: visHomepage, set: setVisHomepage },
                { key: 'menu', icon: 'menu', label: 'Visible Menu', state: visMenu, set: setVisMenu },
                { key: 'mobile', icon: 'smartphone', label: 'Visible Mobile', state: visMobile, set: setVisMobile },
              ].map(({ key, icon, label, state, set }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-400">{icon}</span>
                    <span className="text-sm font-medium text-slate-700">{label}</span>
                  </div>
                  <Toggle checked={state} onChange={set} />
                </div>
              ))}
            </div>
          </Section>

          {/* Période */}
          <Section title="Période">
            <div className="space-y-6">
              <div>
                <Label>Date début</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                  </span>
                  <input
                    type="date"
                    value={dateDebut}
                    onChange={(e) => setDateDebut(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  />
                </div>
              </div>
              <div>
                <Label>Date fin</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-lg">event_busy</span>
                  </span>
                  <input
                    type="date"
                    value={dateFin}
                    onChange={(e) => setDateFin(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-brand focus:border-brand transition-all outline-none"
                  />
                </div>
              </div>
              <div className="p-4 bg-brand/5 rounded-xl border border-brand/10 flex gap-3">
                <span className="material-symbols-outlined text-brand flex-shrink-0">info</span>
                <p className="text-[11px] leading-relaxed text-slate-600">
                  Laissez la date de fin vide pour une collection permanente. La collection s'activera automatiquement à la date de début.
                </p>
              </div>
            </div>
          </Section>

        </div>
      </div>
    </div>
  )
}
