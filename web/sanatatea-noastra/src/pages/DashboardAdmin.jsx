import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import {
  Shield,
  Users,
  UserCog,
  Activity,
  AlertTriangle,
  Heart,
  LogOut,
  FileText,
  Stethoscope,
  Eye,
} from 'lucide-react'

function StatCard({ icon, label, value, tone = 'slate' }) {
  const tones = {
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
    cyan: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  return (
    <div className={`rounded-2xl border p-5 ${tones[tone] || tones.slate}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium">{label}</p>
        <div className="rounded-full bg-white p-2 shadow-sm">{icon}</div>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}

function DashboardAdmin() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [savingUserId, setSavingUserId] = useState('')
  const [overview, setOverview] = useState(null)
  const [users, setUsers] = useState([])
  const [pacienti, setPacienti] = useState([])
  const [error, setError] = useState('')

  const incarcaDate = async () => {
    setLoading(true)
    setError('')

    try {
      const [ovRes, usersRes, pacientiRes] = await Promise.all([
        api.get('/admin/overview'),
        api.get('/admin/users'),
        api.get('/admin/pacienti'),
      ])

      setOverview(ovRes.data)
      setUsers(usersRes.data)
      setPacienti(pacientiRes.data)
    } catch (err) {
      setError('Nu am putut incarca datele administrative. Verifica serverul backend.')
      console.error(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    incarcaDate()
  }, [])

  const handleRoleChange = async (userId, role) => {
    setSavingUserId(userId)
    try {
      await api.put(`/admin/users/${userId}/role`, { rol: role })
      setUsers((curent) => curent.map((u) => (u._id === userId ? { ...u, rol: role } : u)))
    } catch (err) {
      alert('Rolul nu a putut fi actualizat. Incearca din nou.')
      console.error(err)
    }
    setSavingUserId('')
  }

  const roleClass = (role) => {
    if (role === 'admin') return 'bg-slate-100 text-slate-700'
    if (role === 'medic') return 'bg-cyan-100 text-cyan-700'
    return 'bg-emerald-100 text-emerald-700'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-cyan-50 to-emerald-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="rounded-2xl bg-slate-900 p-3 text-white">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Portal Administrator</h1>
                <p className="text-sm text-slate-600">Control acces, monitorizare pacienti si evidenta medicala.</p>
              </div>
            </div>
            <button
              onClick={() => {
                sessionStorage.clear()
                navigate('/')
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100"
            >
              <LogOut size={16} /> Deconectare
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Users size={16} />} label="Utilizatori" value={overview?.totalUtilizatori ?? '-'} tone="slate" />
          <StatCard icon={<Stethoscope size={16} />} label="Medici" value={overview?.totalMedici ?? '-'} tone="cyan" />
          <StatCard icon={<FileText size={16} />} label="Fise pacient" value={overview?.totalPacientiCuFisa ?? '-'} tone="emerald" />
          <StatCard icon={<Activity size={16} />} label="Masuratori IoT" value={overview?.totalMasuratori ?? '-'} tone="slate" />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-lg xl:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Gestionare utilizatori si roluri</h2>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                <UserCog size={14} /> Permission ranking activ
              </div>
            </div>

            {loading ? (
              <p className="text-sm text-slate-500">Se incarca utilizatorii...</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Nume</th>
                      <th className="py-2 pr-3">Email</th>
                      <th className="py-2 pr-3">Rol curent</th>
                      <th className="py-2 pr-3">Schimba rol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u._id} className="border-b border-slate-100 text-sm text-slate-700">
                        <td className="py-3 pr-3 font-medium">{u.nume}</td>
                        <td className="py-3 pr-3">{u.email}</td>
                        <td className="py-3 pr-3">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleClass(u.rol)}`}>
                            {u.rol}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <select
                            value={u.rol}
                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                            disabled={savingUserId === u._id}
                            className="rounded-lg border border-slate-200 px-2 py-1 text-sm outline-none focus:border-cyan-500"
                          >
                            <option value="admin">admin</option>
                            <option value="medic">medic</option>
                            <option value="pacient">pacient</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Status clinic</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-xl bg-red-50 px-3 py-2 text-red-700">
                <span className="inline-flex items-center gap-2"><AlertTriangle size={15} /> Alarme</span>
                <strong>{overview?.statusPacienti?.alarme ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2 text-amber-700">
                <span className="inline-flex items-center gap-2"><Activity size={15} /> Avertizari</span>
                <strong>{overview?.statusPacienti?.avertizari ?? 0}</strong>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-emerald-50 px-3 py-2 text-emerald-700">
                <span className="inline-flex items-center gap-2"><Heart size={15} /> Normale</span>
                <strong>{overview?.statusPacienti?.normale ?? 0}</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Fise medicale din baza de date</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Se incarca fisele...</p>
          ) : pacienti.length === 0 ? (
            <p className="text-sm text-slate-500">Nu exista fise medicale inregistrate.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[740px]">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Pacient</th>
                    <th className="py-2 pr-3">Medic responsabil</th>
                    <th className="py-2 pr-3">Puls</th>
                    <th className="py-2 pr-3">Temperatura</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Actiuni</th>
                  </tr>
                </thead>
                <tbody>
                  {pacienti.map((p) => (
                    <tr key={p._id} className="border-b border-slate-100 text-sm text-slate-700">
                      <td className="py-3 pr-3 font-medium">{p.prenume} {p.nume}</td>
                      <td className="py-3 pr-3">{p.medicNume}</td>
                      <td className="py-3 pr-3">{p.puls} bpm</td>
                      <td className="py-3 pr-3">{p.temperatura} C</td>
                      <td className="py-3 pr-3">{p.status}</td>
                      <td className="py-3 pr-3">
                        <button
                          onClick={() => navigate(`/fisa/${p._id}`)}
                          className="inline-flex items-center gap-1 rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-medium text-cyan-700 hover:bg-cyan-100"
                        >
                          <Eye size={14} /> Vezi fisa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardAdmin
