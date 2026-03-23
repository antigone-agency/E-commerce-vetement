import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import KpiCard from '../components/ui/KpiCard'
import PageHeader from '../components/ui/PageHeader'
import CustomSelect from '../components/ui/CustomSelect'

// ── Mock Data ──────────────────────────────────────────────────────────────────
const mockClients = [
  {
    id: 1,
    initials: 'TC',
    name: 'Titan Construction Ltd',
    customerId: 'CUST-89021',
    email: 'mark.stone@titan.com',
    phone: '+1 (555) 123-4567',
    segment: 'vip',
    orders: 42,
    totalSpent: '12 450,00€',
    lastOrder: 'il y a 2 jours',
    status: 'actif',
  },
  {
    id: 2,
    initials: 'OS',
    name: 'Oceanic Shipyards',
    customerId: 'CUST-77412',
    email: 'procurement@oceanic.io',
    phone: '+1 (555) 987-6543',
    segment: 'fidele',
    orders: 18,
    totalSpent: '45 200,00€',
    lastOrder: 'il y a 1 semaine',
    status: 'actif',
  },
  {
    id: 3,
    initials: 'BR',
    name: 'Black Rock Energy',
    customerId: 'CUST-21055',
    email: 'd.miller@blackrock.com',
    phone: '+1 (555) 444-1122',
    segment: 'nouveau',
    orders: 2,
    totalSpent: '3 900,00€',
    lastOrder: 'il y a 3 jours',
    status: 'actif',
  },
  {
    id: 4,
    initials: 'LW',
    name: 'Loomis Warehousing',
    customerId: 'CUST-44109',
    email: 'sarah@loomis.com',
    phone: '+1 (555) 234-5678',
    segment: 'inactif',
    orders: 12,
    totalSpent: '8 120,00€',
    lastOrder: 'il y a 4 mois',
    status: 'inactif',
  },
  {
    id: 5,
    initials: 'RP',
    name: 'RailPower Industries',
    customerId: 'CUST-55238',
    email: 'ops@railpower.com',
    phone: '+1 (555) 321-0099',
    segment: 'vip',
    orders: 67,
    totalSpent: '98 350,00€',
    lastOrder: 'il y a 5 heures',
    status: 'actif',
  },
  {
    id: 6,
    initials: 'AW',
    name: 'Alpine Works GmbH',
    customerId: 'CUST-63741',
    email: 'contact@alpineworks.de',
    phone: '+49 89 1234567',
    segment: 'fidele',
    orders: 31,
    totalSpent: '22 100,00€',
    lastOrder: 'il y a 3 semaines',
    status: 'actif',
  },
]

// ── Mock orders per client ────────────────────────────────────────────────────
const mockOrdersByClient = {
  1: [
    { id: 'ORD-4521', date: '20/03/2026', items: 8, total: '1 240,00€', status: 'livré' },
    { id: 'ORD-4498', date: '15/03/2026', items: 3, total: '870,00€',   status: 'en cours' },
    { id: 'ORD-4367', date: '02/03/2026', items: 12, total: '3 100,00€', status: 'livré' },
    { id: 'ORD-4201', date: '18/02/2026', items: 5, total: '2 400,00€', status: 'livré' },
    { id: 'ORD-4100', date: '01/02/2026', items: 2, total: '640,00€',   status: 'annulé' },
  ],
  2: [
    { id: 'ORD-4510', date: '14/03/2026', items: 6, total: '5 800,00€', status: 'livré' },
    { id: 'ORD-4399', date: '05/03/2026', items: 9, total: '9 200,00€', status: 'livré' },
    { id: 'ORD-4280', date: '20/02/2026', items: 4, total: '3 100,00€', status: 'en attente' },
  ],
  3: [
    { id: 'ORD-4519', date: '19/03/2026', items: 2, total: '1 900,00€', status: 'en cours' },
    { id: 'ORD-4410', date: '08/03/2026', items: 1, total: '2 000,00€', status: 'livré' },
  ],
  4: [
    { id: 'ORD-4050', date: '10/11/2025', items: 3, total: '1 200,00€', status: 'livré' },
    { id: 'ORD-3980', date: '22/10/2025', items: 5, total: '3 300,00€', status: 'livré' },
    { id: 'ORD-3870', date: '05/09/2025', items: 2, total: '980,00€',   status: 'annulé' },
  ],
  5: [
    { id: 'ORD-4523', date: '22/03/2026', items: 14, total: '18 400,00€', status: 'en cours' },
    { id: 'ORD-4511', date: '17/03/2026', items: 7,  total: '9 750,00€',  status: 'livré' },
    { id: 'ORD-4490', date: '12/03/2026', items: 10, total: '12 000,00€', status: 'livré' },
    { id: 'ORD-4455', date: '04/03/2026', items: 3,  total: '4 200,00€',  status: 'livré' },
    { id: 'ORD-4400', date: '22/02/2026', items: 6,  total: '8 100,00€',  status: 'livré' },
  ],
  6: [
    { id: 'ORD-4350', date: '01/03/2026', items: 5, total: '3 200,00€', status: 'livré' },
    { id: 'ORD-4210', date: '10/02/2026', items: 8, total: '6 400,00€', status: 'livré' },
    { id: 'ORD-4100', date: '20/01/2026', items: 2, total: '1 500,00€', status: 'en attente' },
  ],
}

const orderStatusCfg = {
  'livré':      { cls: 'bg-emerald-100 text-emerald-700', label: 'Livré' },
  'en cours':   { cls: 'bg-blue-100 text-blue-700',      label: 'En cours' },
  'annulé':     { cls: 'bg-red-100 text-red-600',        label: 'Annulé' },
  'en attente': { cls: 'bg-amber-100 text-amber-700',    label: 'En attente' },
}

const segmentConfig = {
  vip:     { label: 'VIP',     cls: 'bg-amber-100 text-amber-700 border border-amber-200',   icon: 'star' },
  fidele:  { label: 'Fidèle',  cls: 'bg-emerald-50 text-emerald-600 border border-emerald-100', icon: null },
  nouveau: { label: 'Nouveau', cls: 'bg-blue-50 text-blue-600 border border-blue-100',       icon: null },
  inactif: { label: 'Inactif', cls: 'bg-slate-100 text-slate-500 border border-slate-200',   icon: null },
}

const statusConfig = {
  actif:   { label: 'Actif',   cls: 'bg-emerald-500 text-white' },
  inactif: { label: 'Inactif', cls: 'bg-amber-500 text-white' },
  bloque:  { label: 'Bloqué',  cls: 'bg-red-500 text-white' },
}

// ── Commandes Modal ───────────────────────────────────────────────────────────
function CommandesModal({ client, onClose }) {
  const navigate = useNavigate()
  const orders = mockOrdersByClient[client.id] || []

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  const total = orders.reduce((sum, o) => {
    const num = parseFloat(o.total.replace(/[^\d,]/g, '').replace(',', '.'))
    return sum + (isNaN(num) ? 0 : num)
  }, 0)

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      {/* Panel */}
      <div className="relative ml-auto h-full w-full max-w-xl bg-white shadow-2xl flex flex-col animate-[slideInRight_0.25s_ease-out]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand/10 text-brand rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-lg">receipt_long</span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800">Commandes de {client.name}</h2>
              <p className="text-[11px] text-slate-400">{client.customerId} &bull; {orders.length} commande{orders.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Summary bar */}
        <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center gap-6 text-xs shrink-0">
          <div>
            <span className="text-slate-400 font-medium">Total commandes&nbsp;</span>
            <span className="font-bold text-slate-800">{orders.length}</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div>
            <span className="text-slate-400 font-medium">Total dépensé&nbsp;</span>
            <span className="font-bold text-brand">{client.totalSpent}</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div>
            <span className="text-slate-400 font-medium">Dernière commande&nbsp;</span>
            <span className="font-bold text-slate-700">{client.lastOrder}</span>
          </div>
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
              <span className="material-symbols-outlined text-5xl text-slate-200">shopping_bag</span>
              <p className="text-sm">Aucune commande pour ce client.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 sticky top-0">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">N° Commande</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Articles</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => {
                  const st = orderStatusCfg[order.status] || orderStatusCfg['en attente']
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800 text-sm">{order.id}</td>
                      <td className="px-5 py-4 text-sm text-slate-500">{order.date}</td>
                      <td className="px-5 py-4 text-center text-sm font-semibold text-slate-700">{order.items}</td>
                      <td className="px-5 py-4 font-bold text-slate-800 text-sm">{order.total}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${st.cls}`}>{st.label}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => navigate(`/commandes/${order.id.replace('ORD-', '')}`)}
                          className="text-xs font-semibold text-brand hover:underline"
                        >
                          Voir
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
            Fermer
          </button>
          <button
            onClick={() => { onClose(); navigate(`/clients/${client.id}`) }}
            className="px-4 py-2 text-sm font-bold text-white bg-brand rounded-xl hover:bg-brand-dark transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">person</span>
            Voir le profil
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Action Menu ────────────────────────────────────────────────────────────────
function ActionMenu({ clientId, onView, onCommandes, onContact, onDisable }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function handle(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const action = (fn) => () => { setOpen(false); fn() }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
      >
        <span className="material-symbols-outlined">more_horiz</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 min-w-[190px]">
          <button
            onClick={action(onView)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-brand">visibility</span>
            Détails
          </button>
          <button
            onClick={action(onCommandes)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-500">receipt_long</span>
            Voir commandes
          </button>
          <button
            onClick={action(onContact)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-slate-400">mail</span>
            Contacter
          </button>
          <div className="border-t border-slate-100 my-1" />
          <button
            onClick={action(onDisable)}
            className="flex items-center gap-2.5 w-full px-4 py-2.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">block</span>
            Désactiver
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Clients() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterSegment, setFilterSegment] = useState('Tous les segments')
  const [filterStatut, setFilterStatut] = useState('Tous les statuts')
  const [perPage, setPerPage] = useState('10')
  const [commandesClient, setCommandesClient] = useState(null)

  const filtered = mockClients.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.customerId.toLowerCase().includes(search.toLowerCase())
    const matchSegment =
      filterSegment === 'Tous les segments' ||
      segmentConfig[c.segment]?.label === filterSegment
    const matchStatut =
      filterStatut === 'Tous les statuts' ||
      statusConfig[c.status]?.label === filterStatut
    return matchSearch && matchSegment && matchStatut
  })

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">

      {/* ── Commandes Modal ── */}
      {commandesClient && (
        <CommandesModal client={commandesClient} onClose={() => setCommandesClient(null)} />
      )}

      {/* ── Page Header ── */}
      <PageHeader title="Clients">
        <PageHeader.SecondaryBtn icon="admin_panel_settings" onClick={() => navigate('/roles')}>
          Rôles &amp; Permissions
        </PageHeader.SecondaryBtn>
        <PageHeader.SecondaryBtn icon="download">Exporter</PageHeader.SecondaryBtn>
        <PageHeader.SecondaryBtn icon="upload">Importer</PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="person_add" onClick={() => navigate('/clients/nouveau')}>
          Ajouter un compte
        </PageHeader.PrimaryBtn>
      </PageHeader>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          label="Total clients"
          value="1 284"
          sub="+12%"
          subColor="text-emerald-500"
          icon="group"
          iconBg="bg-slate-50 text-slate-400"
        />
        <KpiCard
          label="Nouveaux clients (30j)"
          value="156"
          sub="Croissance stable"
          subColor="text-slate-400"
          icon="person_add"
          iconBg="bg-blue-50 text-blue-500"
        />
        <KpiCard
          label="Clients fidèles"
          value="842"
          sub="65% base"
          subColor="text-brand"
          icon="star"
          iconBg="bg-amber-50 text-amber-500"
        />
        <KpiCard
          label="Chiffre généré (Total)"
          value="428 500€"
          sub="+8.2%"
          subColor="text-emerald-500"
          icon="payments"
          iconBg="bg-emerald-50 text-brand"
        />
      </div>

      {/* ── Filters ── */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un client ou une entreprise..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>
          {/* Dropdowns */}
          <div className="flex flex-wrap gap-3 items-center">
            <CustomSelect
              value={filterSegment}
              onChange={setFilterSegment}
              options={['Tous les segments', 'VIP', 'Fidèle', 'Nouveau', 'Inactif']}
            />
            <CustomSelect
              value={filterStatut}
              onChange={setFilterStatut}
              options={['Tous les statuts', 'Actif', 'Inactif', 'Bloqué']}
            />
            <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">
              <span className="material-symbols-outlined text-lg">tune</span>
              Filtres avancés
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Segmentation</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Fréquence</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Total Dépensé
                  <span className="material-symbols-outlined text-[13px] align-middle ml-1">swap_vert</span>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400 text-sm">
                    Aucun client trouvé.
                  </td>
                </tr>
              )}
              {filtered.map((client) => {
                const seg = segmentConfig[client.segment]
                const sta = statusConfig[client.status]
                return (
                  <tr
                    key={client.id}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    {/* Client */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {client.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{client.name}</p>
                          <p className="text-slate-400 text-[11px]">ID: {client.customerId}</p>
                        </div>
                      </div>
                    </td>
                    {/* Contact */}
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700">{client.email}</p>
                      <p className="text-xs text-slate-400">{client.phone}</p>
                    </td>
                    {/* Segment */}
                    <td className="px-6 py-5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${seg.cls}`}>
                        {seg.icon && (
                          <span className="material-symbols-outlined text-[11px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                            {seg.icon}
                          </span>
                        )}
                        {seg.label}
                      </span>
                    </td>
                    {/* Fréquence */}
                    <td className="px-6 py-5 text-center">
                      <span className="font-semibold text-slate-700 text-sm">{client.orders} commandes</span>
                    </td>
                    {/* Total dépensé */}
                    <td className="px-6 py-5">
                      <p className="font-bold text-slate-800 text-sm">{client.totalSpent}</p>
                      <p className="text-slate-400 text-[11px]">Dernière: {client.lastOrder}</p>
                    </td>
                    {/* Statut */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${sta.cls}`}>
                        {sta.label}
                      </span>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        clientId={client.id}
                        onView={() => navigate(`/clients/${client.id}`)}
                        onCommandes={() => setCommandesClient(client)}
                        onContact={() => toast.info(`Email envoyé à ${client.email}`)}
                        onDisable={() => toast.warning(`Compte "${client.name}" désactivé.`)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Affichage de <span className="font-semibold text-slate-700">{filtered.length}</span> sur{' '}
            <span className="font-semibold text-slate-700">{mockClients.length}</span> clients
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Lignes par page</span>
              <CustomSelect value={perPage} onChange={setPerPage} options={['10', '25', '50']} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-slate-800">Page 1 de 129</span>
              <div className="flex gap-1">
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">keyboard_arrow_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
                  <span className="material-symbols-outlined text-lg">keyboard_arrow_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
