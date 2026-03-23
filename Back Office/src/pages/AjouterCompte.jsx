import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import PageHeader from '../components/ui/PageHeader'
import CustomSelect from '../components/ui/CustomSelect'

/* ── Rôles disponibles ─────────────────────────────────────────────────────── */
const roles = [
  {
    key: 'admin',
    label: 'Administrateur',
    icon: 'manage_accounts',
    desc: 'Gestion opérationnelle complète de la boutique et du catalogue.',
    iconBg: 'bg-slate-100 text-slate-600',
    border: 'border-slate-200',
    activeBorder: 'border-brand ring-2 ring-brand/20',
  },
  {
    key: 'buyer',
    label: 'Acheteur Pro',
    icon: 'shopping_cart',
    desc: 'Rôle client pour la passation de commandes, retours et factures.',
    iconBg: 'bg-blue-50 text-blue-600',
    border: 'border-slate-200',
    activeBorder: 'border-brand ring-2 ring-brand/20',
  },
  {
    key: 'gestionnaire',
    label: 'Gestionnaire',
    icon: 'inventory_2',
    desc: 'Accès limité à la gestion du stock, produits et catégories.',
    iconBg: 'bg-amber-50 text-amber-600',
    border: 'border-slate-200',
    activeBorder: 'border-brand ring-2 ring-brand/20',
  },
  {
    key: 'client',
    label: 'Client',
    icon: 'person',
    desc: 'Compte client standard avec accès portail commandes uniquement.',
    iconBg: 'bg-emerald-50 text-emerald-600',
    border: 'border-slate-200',
    activeBorder: 'border-brand ring-2 ring-brand/20',
  },
]

const segmentOptions = [
  { value: 'nouveau', label: 'Nouveau client' },
  { value: 'fidele', label: 'Client fidèle' },
  { value: 'vip', label: 'Client VIP' },
  { value: 'inactif', label: 'Inactif' },
]

const paysOptions = ['France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Tunisie', 'Algérie', 'Autre']

export default function AjouterCompte() {
  const navigate = useNavigate()

  /* ── Form state ── */
  const [selectedRole, setSelectedRole] = useState('client')
  const [form, setForm] = useState({
    prenom: '', nom: '', email: '', telephone: '',
    societe: '', siret: '', adresse: '', ville: '', codePostal: '', pays: 'France',
    segment: 'nouveau',
    motDePasse: '', confirmerMotDePasse: '',
    notes: '',
    sendInvite: true,
  })
  const [showPass, setShowPass] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (field) => (val) => setForm(prev => ({ ...prev, [field]: val }))
  const setE = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  /* ── Validation ── */
  const validate = () => {
    const e = {}
    if (!form.prenom.trim()) e.prenom = 'Obligatoire'
    if (!form.nom.trim()) e.nom = 'Obligatoire'
    if (!form.email.trim()) e.email = 'Obligatoire'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
    if (!form.sendInvite) {
      if (!form.motDePasse) e.motDePasse = 'Obligatoire'
      else if (form.motDePasse.length < 8) e.motDePasse = 'Minimum 8 caractères'
      if (form.motDePasse !== form.confirmerMotDePasse) e.confirmerMotDePasse = 'Les mots de passe ne correspondent pas'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return toast.error('Veuillez corriger les erreurs.')
    toast.success(`Compte "${form.prenom} ${form.nom}" créé avec succès !`)
    navigate('/clients')
  }

  /* ── Field component ── */
  const Field = ({ label, error, children, required }) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
    </div>
  )

  const Input = ({ field, placeholder, type = 'text', ...rest }) => (
    <input
      type={type}
      value={form[field]}
      onChange={setE(field)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all ${errors[field] ? 'border-red-400' : 'border-slate-200'}`}
      {...rest}
    />
  )

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">

      {/* ── Header ── */}
      <PageHeader title="Ajouter un compte">
        <PageHeader.SecondaryBtn icon="arrow_back" onClick={() => navigate('/clients')}>
          Retour
        </PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="person_add" onClick={handleSubmit}>
          Créer le compte
        </PageHeader.PrimaryBtn>
      </PageHeader>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6" noValidate>

        {/* ══ LEFT COLUMN ══ */}
        <div className="lg:col-span-2 space-y-6">

          {/* Informations personnelles */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">person</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Informations personnelles</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Prénom" required error={errors.prenom}>
                <Input field="prenom" placeholder="Jean" />
              </Field>
              <Field label="Nom" required error={errors.nom}>
                <Input field="nom" placeholder="Dupont" />
              </Field>
              <Field label="Email" required error={errors.email}>
                <Input field="email" placeholder="jean.dupont@email.com" type="email" />
              </Field>
              <Field label="Téléphone">
                <Input field="telephone" placeholder="+33 6 12 34 56 78" type="tel" />
              </Field>
            </div>
          </div>

          {/* Informations entreprise */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">business</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Entreprise <span className="text-slate-400 font-normal">(optionnel)</span></h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Société">
                <Input field="societe" placeholder="WorkwearPro SAS" />
              </Field>
              <Field label="SIRET">
                <Input field="siret" placeholder="123 456 789 01234" />
              </Field>
              <Field label="Adresse" error={errors.adresse}>
                <Input field="adresse" placeholder="12 rue de la Paix" />
              </Field>
              <Field label="Ville">
                <Input field="ville" placeholder="Paris" />
              </Field>
              <Field label="Code postal">
                <Input field="codePostal" placeholder="75001" />
              </Field>
              <Field label="Pays">
                <CustomSelect value={form.pays} onChange={set('pays')} options={paysOptions} />
              </Field>
            </div>
          </div>

          {/* Accès & mot de passe */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">lock</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Accès au compte</h3>
            </div>
            <div className="p-6 space-y-5">
              {/* Toggle invite par email */}
              <label className="flex items-center justify-between cursor-pointer bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Envoyer une invitation par email</p>
                  <p className="text-xs text-slate-500 mt-0.5">Le client reçoit un lien pour définir son mot de passe</p>
                </div>
                <button type="button" onClick={() => setForm(p => ({ ...p, sendInvite: !p.sendInvite }))}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${form.sendInvite ? 'bg-brand' : 'bg-slate-300'}`}>
                  <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${form.sendInvite ? 'translate-x-5' : ''}`} />
                </button>
              </label>

              {/* Password fields — shown only when invite is off */}
              {!form.sendInvite && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Mot de passe" required error={errors.motDePasse}>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={form.motDePasse} onChange={setE('motDePasse')} placeholder="Minimum 8 caractères"
                        className={`w-full px-3.5 py-2.5 pr-10 rounded-lg border text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all ${errors.motDePasse ? 'border-red-400' : 'border-slate-200'}`} />
                      <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        <span className="material-symbols-outlined text-[18px]">{showPass ? 'visibility_off' : 'visibility'}</span>
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirmer le mot de passe" required error={errors.confirmerMotDePasse}>
                    <input type={showPass ? 'text' : 'password'} value={form.confirmerMotDePasse} onChange={setE('confirmerMotDePasse')} placeholder="Répéter le mot de passe"
                      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all ${errors.confirmerMotDePasse ? 'border-red-400' : 'border-slate-200'}`} />
                  </Field>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ══ RIGHT COLUMN ══ */}
        <div className="space-y-6">

          {/* Sélection du rôle */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">shield_person</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Rôle du compte</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Définit les droits d'accès</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {roles.map(r => (
                <button key={r.key} type="button" onClick={() => setSelectedRole(r.key)}
                  className={`w-full text-left flex items-start gap-3 p-3.5 rounded-xl border-2 transition-all ${selectedRole === r.key ? r.activeBorder + ' bg-brand/3' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${r.iconBg}`}>
                    <span className="material-symbols-outlined text-[18px]">{r.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">{r.label}</p>
                      {selectedRole === r.key && (
                        <span className="w-4 h-4 rounded-full bg-brand flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white text-[11px]">check</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Segmentation & statut */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">tune</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Segmentation</h3>
            </div>
            <div className="p-5">
              <Field label="Segment client">
                <CustomSelect value={form.segment} onChange={set('segment')} options={segmentOptions} />
              </Field>
            </div>
          </div>

          {/* Notes internes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">sticky_note_2</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Notes internes</h3>
            </div>
            <div className="p-5">
              <textarea value={form.notes} onChange={setE('notes')} rows={4} placeholder="Remarques visibles uniquement par les admins..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm resize-none focus:ring-2 focus:ring-brand focus:border-brand focus:bg-white outline-none transition-all" />
            </div>
          </div>

          {/* Résumé */}
          <div className="bg-brand/5 border border-brand/10 rounded-xl p-5 space-y-3">
            <p className="text-xs font-bold text-brand uppercase tracking-wider">Récapitulatif</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Nom complet</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">{form.prenom || '—'} {form.nom}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">{form.email || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Rôle</span>
                <span className="font-semibold text-slate-800">{roles.find(r => r.key === selectedRole)?.label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Segment</span>
                <span className="font-semibold text-slate-800">{segmentOptions.find(s => s.value === form.segment)?.label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Invitation email</span>
                <span className={`font-semibold ${form.sendInvite ? 'text-emerald-600' : 'text-slate-600'}`}>{form.sendInvite ? 'Oui' : 'Non'}</span>
              </div>
            </div>
          </div>

          {/* Boutons bas */}
          <div className="flex flex-col gap-3">
            <button type="submit" className="w-full py-3 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition-all shadow-lg shadow-brand/20 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">person_add</span>
              Créer le compte
            </button>
            <button type="button" onClick={() => navigate('/clients')} className="w-full py-2.5 bg-slate-100 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-200 transition-all">
              Annuler
            </button>
          </div>

        </div>
      </form>
    </div>
  )
}
