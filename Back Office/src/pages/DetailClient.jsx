import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import KpiCard from '../components/ui/KpiCard'
import PageHeader from '../components/ui/PageHeader'
import CustomSelect from '../components/ui/CustomSelect'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const mockClients = {
  1: {
    id: 1,
    initials: 'TC',
    name: 'Titan Construction Ltd',
    customerId: 'CUST-89021',
    email: 'mark.stone@titan.com',
    phone: '+1 (555) 123-4567',
    segment: 'vip',
    orders: 42,
    totalSpent: '12 450,00€',
    avgOrder: '296,43€',
    lastOrder: 'il y a 2 jours',
    memberSince: '14/03/2022',
    address: '248 Industrial Blvd, Detroit, MI 48201',
    country: 'États-Unis',
    status: 'actif',
    note: 'Client prioritaire. Négociation contrat annuel en cours. Préfère les livraisons express.',
    recentOrders: [
      { id: 'ORD-22841', date: '19/03/2026', items: 8,  total: '1 240,00€', status: 'livré'      },
      { id: 'ORD-22610', date: '05/03/2026', items: 3,  total: '480,00€',   status: 'livré'      },
      { id: 'ORD-22199', date: '18/02/2026', items: 12, total: '2 100,00€', status: 'livré'      },
      { id: 'ORD-21845', date: '02/02/2026', items: 5,  total: '890,00€',   status: 'annulé'     },
      { id: 'ORD-21502', date: '14/01/2026', items: 7,  total: '1 050,00€', status: 'livré'      },
      { id: 'ORD-21100', date: '03/01/2026', items: 2,  total: '320,00€',   status: 'livré'      },
      { id: 'ORD-20744', date: '22/12/2025', items: 9,  total: '1 780,00€', status: 'livré'      },
      { id: 'ORD-20400', date: '08/11/2025', items: 4,  total: '640,00€',   status: 'en attente' },
      { id: 'ORD-20100', date: '15/10/2025', items: 6,  total: '970,00€',   status: 'livré'      },
      { id: 'ORD-19800', date: '02/09/2025', items: 11, total: '2 300,00€', status: 'annulé'     },
    ],
  },
  2: {
    id: 2,
    initials: 'OS',
    name: 'Oceanic Shipyards',
    customerId: 'CUST-77412',
    email: 'procurement@oceanic.io',
    phone: '+1 (555) 987-6543',
    segment: 'fidele',
    orders: 18,
    totalSpent: '45 200,00€',
    avgOrder: '2 511,11€',
    lastOrder: 'il y a 1 semaine',
    memberSince: '07/09/2021',
    address: '1 Harbor Dr, Baltimore, MD 21201',
    country: 'États-Unis',
    status: 'actif',
    note: '',
    recentOrders: [
      { id: 'ORD-22780', date: '14/03/2026', items: 20, total: '4 800,00€', status: 'en cours' },
      { id: 'ORD-22301', date: '22/02/2026', items: 15, total: '3 500,00€', status: 'livré'     },
      { id: 'ORD-21990', date: '10/01/2026', items: 8,  total: '2 100,00€', status: 'livré'     },
      { id: 'ORD-21500', date: '05/12/2025', items: 12, total: '3 200,00€', status: 'livré'     },
      { id: 'ORD-21100', date: '18/11/2025', items: 6,  total: '1 600,00€', status: 'annulé'    },
    ],
  },
  3: {
    id: 3,
    initials: 'BR',
    name: 'Black Rock Energy',
    customerId: 'CUST-21055',
    email: 'd.miller@blackrock.com',
    phone: '+1 (555) 444-1122',
    segment: 'nouveau',
    orders: 2,
    totalSpent: '3 900,00€',
    avgOrder: '1 950,00€',
    lastOrder: 'il y a 3 jours',
    memberSince: '15/03/2026',
    address: '900 Energy Pkwy, Houston, TX 77001',
    country: 'États-Unis',
    status: 'actif',
    note: 'Premier contact via campagne email Mars 2026.',
    recentOrders: [
      { id: 'ORD-22835', date: '18/03/2026', items: 4, total: '2 100,00€', status: 'en cours' },
      { id: 'ORD-22812', date: '15/03/2026', items: 3, total: '1 800,00€', status: 'livré' },
    ],
  },
  4: {
    id: 4,
    initials: 'LW',
    name: 'Loomis Warehousing',
    customerId: 'CUST-44109',
    email: 'sarah@loomis.com',
    phone: '+1 (555) 234-5678',
    segment: 'inactif',
    orders: 12,
    totalSpent: '8 120,00€',
    avgOrder: '676,67€',
    lastOrder: 'il y a 4 mois',
    memberSince: '22/04/2023',
    address: '500 Warehouse Ave, Chicago, IL 60601',
    country: 'États-Unis',
    status: 'inactif',
    note: 'Relance email envoyée le 10/03/2026. Aucune réponse.',
    recentOrders: [
      { id: 'ORD-20912', date: '18/11/2025', items: 6, total: '980,00€', status: 'livré' },
    ],
  },
  5: {
    id: 5,
    initials: 'RP',
    name: 'RailPower Industries',
    customerId: 'CUST-55238',
    email: 'ops@railpower.com',
    phone: '+1 (555) 321-0099',
    segment: 'vip',
    orders: 67,
    totalSpent: '98 350,00€',
    avgOrder: '1 468,66€',
    lastOrder: 'il y a 5 heures',
    memberSince: '03/01/2020',
    address: '10 Rail Depot Rd, Pittsburgh, PA 15201',
    country: 'États-Unis',
    status: 'actif',
    note: 'Compte stratégique. Gestionnaire dédié: Sophie Benali.',
    recentOrders: [
      { id: 'ORD-22848', date: '21/03/2026', items: 14, total: '3 200,00€', status: 'en cours'   },
      { id: 'ORD-22820', date: '19/03/2026', items: 9,  total: '1 800,00€', status: 'livré'      },
      { id: 'ORD-22790', date: '15/03/2026', items: 22, total: '5 100,00€', status: 'livré'      },
      { id: 'ORD-22500', date: '04/02/2026', items: 7,  total: '1 400,00€', status: 'livré'      },
      { id: 'ORD-22200', date: '12/01/2026', items: 18, total: '4 800,00€', status: 'livré'      },
      { id: 'ORD-21900', date: '20/12/2025', items: 11, total: '3 100,00€', status: 'livré'      },
      { id: 'ORD-21600', date: '05/11/2025', items: 5,  total: '900,00€',   status: 'annulé'     },
    ],
  },
  6: {
    id: 6,
    initials: 'AW',
    name: 'Alpine Works GmbH',
    customerId: 'CUST-63741',
    email: 'contact@alpineworks.de',
    phone: '+49 89 1234567',
    segment: 'fidele',
    orders: 31,
    totalSpent: '22 100,00€',
    avgOrder: '712,90€',
    lastOrder: 'il y a 3 semaines',
    memberSince: '11/06/2022',
    address: 'Industriestraße 42, 80331 Munich',
    country: 'Allemagne',
    status: 'actif',
    note: '',
    recentOrders: [
      { id: 'ORD-22541', date: '01/03/2026', items: 7, total: '1 100,00€', status: 'livré' },
      { id: 'ORD-22210', date: '08/02/2026', items: 5, total: '820,00€',   status: 'livré' },
    ],
  },
}

/* ── Rôles disponibles ─────────────────────────────────────────────────────── */
const rolesConfig = [
  {
    key: 'admin',
    label: 'Administrateur',
    icon: 'manage_accounts',
    desc: 'Gestion opérationnelle complète de la boutique et du catalogue.',
    iconBg: 'bg-slate-100 text-slate-600',
  },
  {
    key: 'buyer',
    label: 'Acheteur Pro',
    icon: 'shopping_cart',
    desc: 'Rôle client pour la passation de commandes, retours et factures.',
    iconBg: 'bg-blue-50 text-blue-600',
  },
  {
    key: 'gestionnaire',
    label: 'Gestionnaire',
    icon: 'inventory_2',
    desc: 'Accès limité à la gestion du stock, produits et catégories.',
    iconBg: 'bg-amber-50 text-amber-600',
  },
  {
    key: 'client',
    label: 'Client',
    icon: 'person',
    desc: 'Compte client standard avec accès portail commandes uniquement.',
    iconBg: 'bg-emerald-50 text-emerald-600',
  },
]

/* ── Promotions disponibles ────────────────────────────────────────────────── */
const availablePromos = [
  { code: 'SUMMER24',  type: 'pourcentage', valeur: '20%',   desc: 'Soldes été 2024',           statut: 'actif'    },
  { code: 'WELCOME10', type: 'pourcentage', valeur: '10%',   desc: 'Bienvenue nouveaux clients', statut: 'actif'    },
  { code: 'FREESHIP',  type: 'livraison',   valeur: 'Gratuite', desc: 'Livraison offerte dès 75€', statut: 'actif' },
  { code: 'BIRTHDAY',  type: 'fixe',        valeur: '15€',   desc: 'Remise anniversaire',        statut: 'actif'    },
  { code: 'VIP-BOGO',  type: 'bogo',        valeur: '1+1',   desc: 'Un acheté = un offert VIP',  statut: 'planifie' },
  { code: 'GIFT-20',   type: 'cadeau',      valeur: '20€',   desc: 'Cadeau offert dès 150€',     statut: 'brouillon'},
]

const promoTypeBadge = {
  pourcentage: 'bg-blue-50 text-blue-700',
  fixe:        'bg-emerald-50 text-emerald-700',
  livraison:   'bg-purple-50 text-purple-700',
  cadeau:      'bg-pink-50 text-pink-700',
  bogo:        'bg-amber-50 text-amber-700',
}

const statutBadge = {
  actif:     'bg-emerald-100 text-emerald-700',
  planifie:  'bg-blue-100 text-blue-700',
  brouillon: 'bg-amber-100 text-amber-700',
}

const segmentOptions = [
  { value: 'vip',     label: 'Client VIP' },
  { value: 'fidele',  label: 'Client fidèle' },
  { value: 'nouveau', label: 'Nouveau client' },
  { value: 'inactif', label: 'Inactif' },
]

const paysOptions = ['France', 'Belgique', 'Suisse', 'Canada', 'Maroc', 'Tunisie', 'Algérie', 'États-Unis', 'Allemagne', 'Autre']


const orderStatusConfig = {
  'livré':     { cls: 'bg-emerald-100 text-emerald-700', label: 'Livré' },
  'en cours':  { cls: 'bg-blue-100 text-blue-700',      label: 'En cours' },
  'annulé':    { cls: 'bg-red-100 text-red-600',        label: 'Annulé' },
  'en attente':{ cls: 'bg-amber-100 text-amber-700',    label: 'En attente' },
}

/* ── Toggle ─────────────────────────────────────────────────────────────────── */
function Toggle({ value, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!value)}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-brand' : 'bg-slate-300'}`}>
      <span className={`absolute top-[2px] left-[2px] w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : ''}`} />
    </button>
  )
}

/* ── Main Component ──────────────────────────────────────────────────────────── */
export default function DetailClient() {
  const { id } = useParams()
  const navigate = useNavigate()
  const raw = mockClients[Number(id)] || mockClients[1]

  /* ── Form state ── */
  const [name,     setName]     = useState(raw.name)
  const [email,    setEmail]    = useState(raw.email)
  const [phone,    setPhone]    = useState(raw.phone)
  const [address,  setAddress]  = useState(raw.address)
  const [country,  setCountry]  = useState(raw.country)
  const [segment,  setSegment]  = useState(raw.segment)
  const [note,     setNote]     = useState(raw.note)
  const [role,     setRole]     = useState('buyer')

  /* ── Orders filter state ── */
  const [showAllOrders, setShowAllOrders] = useState(false)
  const [filterMois,    setFilterMois]    = useState('Tous les mois')
  const [filterAnnee,   setFilterAnnee]   = useState('Toutes les années')

  const [notifEmail,  setNotifEmail]  = useState(true)
  const [notifSMS,    setNotifSMS]    = useState(false)
  const [newsletter,  setNewsletter]  = useState(true)

  /* ── Promotions state ── */
  const [assignedPromos, setAssignedPromos] = useState([])
  const [showPromoPanel, setShowPromoPanel] = useState(false)

  const togglePromo = (code) => {
    setAssignedPromos(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  const sendPromo = (code) => {
    toast.success(`Coupon "${code}" envoyé par email à ${email} !`)
  }

  const removePromo = (code) => {
    setAssignedPromos(prev => prev.filter(c => c !== code))
    toast.info(`Promotion "${code}" retirée.`)
  }

  const handleSave = () => toast.success(`Profil "${name}" mis à jour !`)
  const handleDelete = () => { toast.info('Client supprimé.'); navigate('/clients') }

  /* ── Field helper ── */
  const FieldLabel = ({ children, required }) => (
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
      {children}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
  )
  const inputCls = 'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all'

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">

      {/* ── Header ── */}
      <PageHeader title={name || raw.name}>
        <PageHeader.DangerBtn icon="delete" onClick={handleDelete}>Supprimer</PageHeader.DangerBtn>
        <PageHeader.SecondaryBtn icon="mail" onClick={() => toast.info('Email envoyé !')}>Contacter</PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="save" onClick={handleSave}>Sauvegarder</PageHeader.PrimaryBtn>
      </PageHeader>

      {/* ── KPIs ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard label="Total dépensé"   value={raw.totalSpent} sub="Depuis le début"  subColor="text-brand"       icon="payments"      iconBg="bg-emerald-50 text-brand" />
        <KpiCard label="Commandes"        value={raw.orders}     sub="Historique complet" subColor="text-slate-400" icon="shopping_bag"   iconBg="bg-slate-50 text-slate-400" />
        <KpiCard label="Panier moyen"     value={raw.avgOrder}   sub="Par commande"     subColor="text-slate-400"  icon="shopping_cart"  iconBg="bg-blue-50 text-blue-500" />
        <KpiCard label="Client depuis"    value={raw.memberSince} sub={raw.lastOrder}   subColor="text-brand"      icon="calendar_today" iconBg="bg-slate-50 text-slate-400" />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        {/* ══ LEFT 2/3 ══════════════════════════════════════════════════════ */}
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
              <div>
                <FieldLabel required>Nom / Entreprise</FieldLabel>
                <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel>ID Client</FieldLabel>
                <input defaultValue={raw.customerId} readOnly className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm bg-slate-100 text-slate-400 cursor-not-allowed" />
              </div>
              <div>
                <FieldLabel required>Email</FieldLabel>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel>Téléphone</FieldLabel>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel>Adresse</FieldLabel>
                <input value={address} onChange={e => setAddress(e.target.value)} className={inputCls} />
              </div>
              <div>
                <FieldLabel>Pays</FieldLabel>
                <CustomSelect value={country} onChange={setCountry} options={paysOptions} />
              </div>
            </div>
          </div>

          {/* Promotions assignées */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-lg">local_offer</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Promotions assignées</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{assignedPromos.length} coupon{assignedPromos.length !== 1 ? 's' : ''} actif{assignedPromos.length !== 1 ? 's' : ''} sur ce compte</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPromoPanel(p => !p)}
                className="px-3 py-1.5 bg-brand/10 text-brand text-xs font-bold rounded-lg hover:bg-brand/20 transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">{showPromoPanel ? 'remove' : 'add'}</span>
                {showPromoPanel ? 'Fermer' : 'Ajouter une promo'}
              </button>
            </div>

            {/* Panel sélection des promos */}
            {showPromoPanel && (
              <div className="border-b border-slate-100 bg-slate-50/60 p-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Sélectionner les promotions à attribuer</p>
                <div className="space-y-2">
                  {availablePromos.map(p => {
                    const assigned = assignedPromos.includes(p.code)
                    return (
                      <label key={p.code} className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${assigned ? 'border-brand bg-brand/3' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                        <input type="checkbox" className="hidden" checked={assigned} onChange={() => togglePromo(p.code)} />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${assigned ? 'bg-brand border-brand' : 'border-slate-300'}`}>
                          {assigned && <span className="material-symbols-outlined text-white text-[13px]">check</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm text-slate-800">{p.code}</span>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${promoTypeBadge[p.type]}`}>{p.type}</span>
                            <span className="text-sm font-bold text-brand">{p.valeur}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${statutBadge[p.statut]}`}>{p.statut}</span>
                          </div>
                          <p className="text-[11px] text-slate-400 mt-0.5">{p.desc}</p>
                        </div>
                      </label>
                    )
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => { setShowPromoPanel(false); toast.success('Promotions enregistrées !') }}
                  className="mt-4 w-full py-2.5 bg-brand text-white font-bold text-sm rounded-xl hover:bg-brand-dark transition-all"
                >
                  Confirmer la sélection
                </button>
              </div>
            )}

            {/* Liste des promos assignées */}
            {assignedPromos.length === 0 ? (
              <div className="py-10 text-center text-slate-400 text-sm">
                <span className="material-symbols-outlined text-3xl text-slate-200 block mb-2">sell</span>
                Aucune promotion assignée. Cliquez « Ajouter une promo ».
              </div>
            ) : (
              <div className="p-5 space-y-3">
                {assignedPromos.map(code => {
                  const p = availablePromos.find(x => x.code === code)
                  if (!p) return null
                  return (
                    <div key={code} className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="px-3 py-1 bg-brand/5 text-brand font-bold text-sm rounded-lg border border-brand/10">{p.code}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${promoTypeBadge[p.type]}`}>{p.type}</span>
                        <span className="text-sm font-bold text-slate-700">{p.valeur}</span>
                        <span className="text-xs text-slate-400">{p.desc}</span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button type="button" onClick={() => sendPromo(p.code)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Envoyer par email">
                          <span className="material-symbols-outlined text-[16px]">mail</span>
                        </button>
                        <button type="button" onClick={() => { navigator.clipboard?.writeText(p.code); toast.success(`Code "${p.code}" copié !`) }} className="p-1.5 text-slate-400 hover:text-brand hover:bg-brand/5 rounded-lg transition-all" title="Copier le code">
                          <span className="material-symbols-outlined text-[16px]">content_copy</span>
                        </button>
                        <button type="button" onClick={() => removePromo(p.code)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Retirer">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Historique des commandes */}
          {(() => {
            const MOIS_LABELS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre']
            const parseDate = (d) => { const [,mm,yyyy] = d.split('/'); return { m: parseInt(mm,10), y: parseInt(yyyy,10) } }
            const allOrders = raw.recentOrders
            const years  = ['Toutes les années', ...[...new Set(allOrders.map(o => parseDate(o.date).y))].sort((a,b)=>b-a).map(String)]
            const months = ['Tous les mois',    ...[...new Set(allOrders.map(o => parseDate(o.date).m))].sort((a,b)=>a-b).map(m => MOIS_LABELS[m-1])]
            const filteredOrders = allOrders.filter(o => {
              const { m, y } = parseDate(o.date)
              const okY = filterAnnee === 'Toutes les années' || y === parseInt(filterAnnee,10)
              const okM = filterMois  === 'Tous les mois'    || MOIS_LABELS[m-1] === filterMois
              return okY && okM
            })
            const displayed = showAllOrders ? filteredOrders : filteredOrders.slice(0, 4)
            return (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">receipt_long</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Historique des commandes</h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {filteredOrders.length} commande{filteredOrders.length !== 1 ? 's' : ''}{' '}
                        {filterAnnee !== 'Toutes les années' || filterMois !== 'Tous les mois' ? 'filtrée' + (filteredOrders.length !== 1 ? 's' : '') : 'au total'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAllOrders(v => !v)}
                    className="text-xs font-bold text-brand hover:underline flex items-center gap-1"
                  >
                    {showAllOrders ? 'Réduire' : 'Voir tout'}
                    <span className="material-symbols-outlined text-[14px]">{showAllOrders ? 'expand_less' : 'expand_more'}</span>
                  </button>
                </div>

                {/* Filters — visible when expanded */}
                {showAllOrders && (
                  <div className="px-6 py-3 bg-slate-50/70 border-b border-slate-100 flex flex-wrap gap-3 items-center">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Filtrer par :</span>
                    <CustomSelect value={filterAnnee} onChange={setFilterAnnee} options={years} />
                    <CustomSelect value={filterMois}  onChange={setFilterMois}  options={months} />
                    {(filterAnnee !== 'Toutes les années' || filterMois !== 'Tous les mois') && (
                      <button
                        onClick={() => { setFilterAnnee('Toutes les années'); setFilterMois('Tous les mois') }}
                        className="px-2.5 py-1.5 text-[11px] font-bold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-all flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[12px]">close</span>Réinitialiser
                      </button>
                    )}
                  </div>
                )}

                {/* Table */}
                {displayed.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-sm">
                    <span className="material-symbols-outlined text-3xl text-slate-200 block mb-2">search_off</span>
                    Aucune commande pour cette période.
                  </div>
                ) : (
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-100">
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Commande</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Articles</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {displayed.map((order) => {
                        const oSta = orderStatusConfig[order.status] || orderStatusConfig['en attente']
                        return (
                          <tr key={order.id} className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                            onClick={() => navigate(`/commandes/${order.id.replace('ORD-', '')}`)}>
                            <td className="px-6 py-3.5 font-bold text-slate-800 text-sm">{order.id}</td>
                            <td className="px-6 py-3.5 text-sm text-slate-500">{order.date}</td>
                            <td className="px-6 py-3.5 text-center text-sm font-semibold text-slate-700">{order.items}</td>
                            <td className="px-6 py-3.5 font-bold text-slate-800 text-sm">{order.total}</td>
                            <td className="px-6 py-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${oSta.cls}`}>{oSta.label}</span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}

                {/* "Show more" footer when collapsed */}
                {!showAllOrders && filteredOrders.length > 4 && (
                  <div className="px-6 py-3 border-t border-slate-100 text-center">
                    <button onClick={() => setShowAllOrders(true)} className="text-xs font-bold text-brand hover:underline">
                      + {filteredOrders.length - 4} commande{filteredOrders.length - 4 > 1 ? 's' : ''} supplémentaire{filteredOrders.length - 4 > 1 ? 's' : ''} — Voir tout
                    </button>
                  </div>
                )}
              </div>
            )
          })()}

          {/* Notes internes */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">sticky_note_2</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Notes internes</h3>
            </div>
            <div className="p-5">
              <textarea value={note} onChange={e => setNote(e.target.value)} rows={4}
                placeholder="Remarques visibles uniquement par l'équipe Back Office..."
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm resize-none bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand transition-all" />
            </div>
          </div>

        </div>

        {/* ══ RIGHT 1/3 ═════════════════════════════════════════════════════ */}
        <div className="space-y-6">

          {/* Rôle du compte */}
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
            <div className="p-4 space-y-2">
              {rolesConfig.map(r => (
                <button key={r.key} type="button" onClick={() => setRole(r.key)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${role === r.key ? 'border-brand ring-2 ring-brand/20 bg-brand/3' : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${r.iconBg}`}>
                    <span className="material-symbols-outlined text-[16px]">{r.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">{r.label}</p>
                      {role === r.key && (
                        <span className="w-4 h-4 rounded-full bg-brand flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-white text-[11px]">check</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Segmentation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">tune</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Segmentation</h3>
            </div>
            <div className="p-5">
              <CustomSelect value={segment} onChange={setSegment} options={segmentOptions} />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">notifications</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Notifications email', value: notifEmail, onChange: setNotifEmail },
                { label: 'Notifications SMS',   value: notifSMS,   onChange: setNotifSMS },
                { label: 'Newsletter',           value: newsletter, onChange: setNewsletter },
              ].map(({ label, value, onChange }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">{label}</span>
                  <Toggle value={value} onChange={onChange} />
                </div>
              ))}
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="bg-brand/5 border border-brand/10 rounded-xl p-5 space-y-3">
            <p className="text-xs font-bold text-brand uppercase tracking-wider">Récapitulatif</p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Nom</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">{name || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-800 text-right max-w-[60%] truncate">{email || '—'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Rôle</span>
                <span className="font-semibold text-slate-800">{rolesConfig.find(r => r.key === role)?.label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Segment</span>
                <span className="font-semibold text-slate-800">{segmentOptions.find(s => s.value === segment)?.label}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Promotions</span>
                <span className="font-semibold text-brand">{assignedPromos.length} assignée{assignedPromos.length !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">bolt</span>
              </div>
              <h3 className="text-sm font-bold text-slate-800">Actions rapides</h3>
            </div>
            <div className="p-4 space-y-2">
              <button type="button" onClick={() => toast.info('Email envoyé !')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-slate-100 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
                <span className="material-symbols-outlined text-lg text-blue-500">mail</span>Envoyer un email
              </button>
              <button type="button" onClick={handleDelete} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-red-100 text-sm font-semibold text-red-600 hover:bg-red-50 transition-all">
                <span className="material-symbols-outlined text-lg">block</span>Désactiver le compte
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}

