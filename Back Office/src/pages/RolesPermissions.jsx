import { useState, useRef, useEffect } from 'react'
import { toast } from 'react-toastify'
import PageHeader from '../components/ui/PageHeader'
import KpiCard from '../components/ui/KpiCard'

// ── Static Data ────────────────────────────────────────────────────────────────
const roles = [
  {
    key: 'superadmin',
    label: 'Super Admin',
    icon: 'admin_panel_settings',
    iconBg: 'bg-brand/10 text-brand',
    border: 'border-2 border-brand/20 hover:border-brand',
    users: 2,
    description: 'Accès total et illimité à toutes les fonctionnalités et paramètres système.',
    perms: [
      { label: 'Gestion Utilisateurs & Rôles', granted: true },
      { label: 'Paramètres Financiers & TVA',  granted: true },
      { label: 'Exports de données complets',  granted: true },
    ],
  },
  {
    key: 'admin',
    label: 'Administrateur',
    icon: 'manage_accounts',
    iconBg: 'bg-slate-100 text-slate-500',
    border: 'border border-slate-200 hover:shadow-md',
    users: 14,
    description: 'Gestion opérationnelle complète de la boutique et du catalogue.',
    perms: [
      { label: 'Gestion des Commandes',   granted: true },
      { label: 'Catalogue & Produits',    granted: true },
      { label: "Pas d'accès aux Rôles",   granted: false },
    ],
  },
  {
    key: 'buyer',
    label: 'Acheteur Pro',
    icon: 'shopping_cart',
    iconBg: 'bg-slate-100 text-slate-500',
    border: 'border border-slate-200 hover:shadow-md',
    users: 85,
    description: 'Rôle client restreint pour la passation de commandes et retours.',
    perms: [
      { label: 'Passage de commande',          granted: true },
      { label: 'Historique & Factures',        granted: true },
      { label: 'Pas de gestion de catalogue',  granted: false },
    ],
  },
]

const permModules = [
  { label: 'Tableau de bord',           superadmin: true,  admin: true,  buyer: false },
  { label: 'Produits & Catégories',     superadmin: true,  admin: true,  buyer: false },
  { label: 'Commandes & Retours',       superadmin: true,  admin: true,  buyer: true  },
  { label: 'Clients & Utilisateurs',    superadmin: true,  admin: true,  buyer: false },
  { label: 'Paiements & TVA/Shipping',  superadmin: true,  admin: false, buyer: false },
  { label: "Logs d'activité & Export",  superadmin: true,  admin: false, buyer: false },
]

const mockUsers = [
  { id: 1, initials: 'JD', name: 'Jean Dupont',     email: 'jean.dupont@workwearpro.com',  role: 'superadmin', lastLogin: "Aujourd'hui, 14:32", status: 'actif'    },
  { id: 2, initials: 'ML', name: 'Marie Legrand',   email: 'm.legrand@workwearpro.com',    role: 'admin',       lastLogin: 'Hier, 09:15',         status: 'actif'    },
  { id: 3, initials: 'TB', name: 'Thomas Bernard',  email: 'tbernard@clientpro.fr',         role: 'buyer',       lastLogin: 'Il y a 3 jours',       status: 'offline'  },
  { id: 4, initials: 'SB', name: 'Sophie Benali',   email: 's.benali@workwearpro.com',     role: 'admin',       lastLogin: 'Il y a 2 heures',      status: 'actif'    },
  { id: 5, initials: 'AR', name: 'Antoine Roux',    email: 'a.roux@clientpro.fr',           role: 'buyer',       lastLogin: 'Il y a 1 semaine',     status: 'inactif'  },
]

const roleBadge = {
  superadmin: 'bg-brand/10 text-brand',
  admin:      'bg-slate-100 text-slate-600',
  buyer:      'bg-blue-50 text-blue-600',
}

const roleLabel = {
  superadmin: 'Super Admin',
  admin:      'Admin',
  buyer:      'Buyer',
}

const statusCfg = {
  actif:   { cls: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500', label: 'Actif'     },
  offline: { cls: 'bg-slate-100 text-slate-500',    dot: 'bg-slate-400',   label: 'Hors ligne'},
  inactif: { cls: 'bg-amber-50 text-amber-600',     dot: 'bg-amber-500',   label: 'Inactif'   },
}

// ── Permissions matrix state ───────────────────────────────────────────────────
const initMatrix = () => {
  const m = {}
  permModules.forEach((mod, i) => {
    m[i] = { superadmin: mod.superadmin, admin: mod.admin, buyer: mod.buyer }
  })
  return m
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function RolesPermissions() {
  const [matrix, setMatrix] = useState(initMatrix)
  const [search, setSearch] = useState('')

  const togglePerm = (rowIdx, role) => {
    if (role === 'superadmin') return // Super Admin always locked
    setMatrix((prev) => ({
      ...prev,
      [rowIdx]: { ...prev[rowIdx], [role]: !prev[rowIdx][role] },
    }))
  }

  const handleSave = () => toast.success('Permissions sauvegardées !')

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto w-full">

      {/* ── Page Header ── */}
      <PageHeader title="Rôles & Permissions">
        <PageHeader.SecondaryBtn icon="person_add">Ajouter Utilisateur</PageHeader.SecondaryBtn>
        <PageHeader.PrimaryBtn icon="add_moderator">Créer un Rôle</PageHeader.PrimaryBtn>
      </PageHeader>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard label="Utilisateurs Actifs" value="1 284" sub="+12%" subColor="text-emerald-500" icon="group" iconBg="bg-slate-50 text-slate-400" />
        <KpiCard label="Rôles Configurés" value="5" sub="Stable" subColor="text-slate-400" icon="shield_person" iconBg="bg-slate-50 text-slate-400" />
        <KpiCard label="Invitations en Attente" value="12" sub="-5%" subColor="text-red-500" icon="mail" iconBg="bg-slate-50 text-slate-400" />
      </div>

      {/* ── Roles Section ── */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h3 className="text-base font-bold text-slate-800">Rôles de base</h3>
          <div className="h-px flex-1 bg-slate-200" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div
              key={role.key}
              className={`bg-white rounded-xl ${role.border} p-6 shadow-sm flex flex-col transition-all`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 ${role.iconBg} rounded-xl flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-2xl">{role.icon}</span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {role.users} Utilisateurs
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-800">{role.label}</h4>
              <p className="text-slate-500 text-xs mt-2 mb-4 leading-relaxed flex-1">{role.description}</p>
              <div className="space-y-2 mb-5">
                {role.perms.map((p) => (
                  <div key={p.label} className="flex items-center gap-2 text-[11px] font-medium">
                    <span className={`material-symbols-outlined text-[16px] ${p.granted ? 'text-emerald-600' : 'text-slate-300'}`}>
                      {p.granted ? 'check_circle' : 'cancel'}
                    </span>
                    <span className={p.granted ? 'text-slate-600' : 'text-slate-400'}>{p.label}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => toast.info(`Modification du rôle "${role.label}" bientôt disponible.`)}
                className="w-full py-2 rounded-lg border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Modifier le rôle
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── Permissions Matrix ── */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-800 text-base">Matrice des Permissions</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Module</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Super Admin</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Admin</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Buyer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permModules.map((mod, i) => (
                <tr key={mod.label} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-8 py-4 text-sm font-semibold text-slate-800">{mod.label}</td>
                  {['superadmin', 'admin', 'buyer'].map((role) => (
                    <td key={role} className="px-8 py-4 text-center">
                      <input
                        type="checkbox"
                        checked={matrix[i][role]}
                        disabled={role === 'superadmin'}
                        onChange={() => togglePerm(i, role)}
                        className="rounded border-slate-300 text-brand focus:ring-brand/30 size-4 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={handleSave}
            className="bg-brand text-white px-5 py-2 rounded-xl font-bold text-xs hover:bg-brand-dark transition-all shadow-sm"
          >
            Sauvegarder les modifications
          </button>
        </div>
      </section>

      {/* ── Users Table ── */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h4 className="font-bold text-slate-800 text-base">Liste des Utilisateurs</h4>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <span className="material-symbols-outlined absolute left-3 top-2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50 focus:ring-1 focus:ring-brand focus:border-brand outline-none"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dernière connexion</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Statut</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">Aucun utilisateur trouvé.</td>
                </tr>
              )}
              {filteredUsers.map((user) => {
                const sta = statusCfg[user.status] || statusCfg.offline
                return (
                  <tr key={user.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                          user.role === 'superadmin' ? 'bg-brand/10 text-brand' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${roleBadge[user.role]}`}>
                        {roleLabel[user.role]}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-xs text-slate-500 font-medium">{user.lastLogin}</td>
                    <td className="px-8 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${sta.cls}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sta.dot}`} />
                        {sta.label}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => toast.info(`Modifier ${user.name}`)}
                          className="p-1.5 text-slate-400 hover:text-brand hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button
                          onClick={() => toast.info(`Supprimer ${user.name}`)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>Affichage de {filteredUsers.length} sur {mockUsers.length} utilisateurs</span>
          <div className="flex items-center gap-1">
            <button className="p-1 hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <span className="bg-brand text-white w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold">1</span>
            <button className="p-1 hover:text-brand transition-colors">
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
