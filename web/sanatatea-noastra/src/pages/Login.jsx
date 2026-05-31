import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

const BG_IMAGE = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80'

function Login() {
  const [email, setEmail] = useState('')
  const [parola, setParola] = useState('')
  const [nume, setNume] = useState('')
  const [rol, setRol] = useState('medic')
  const [showParola, setShowParola] = useState(false)
  const [eroare, setEroare] = useState('')
  const [loading, setLoading] = useState(false)
  const [modRegistrare, setModRegistrare] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !parola) { setEroare('Completează email-ul și parola.'); return }
    if (!email.includes('@')) { setEroare('Email-ul nu este valid.'); return }
    setLoading(true); setEroare('')
    try {
      const response = await api.post('/login', { email, parola, rol_cerut: rol })
      const date = response.data.utilizator
      if (date.rol !== rol) { setEroare(`Acest cont este de tip "${date.rol}", nu "${rol}".`); setLoading(false); return }
      sessionStorage.setItem('autentificat', 'true')
      sessionStorage.setItem('rol', date.rol)
      sessionStorage.setItem('uid', date._id)
      sessionStorage.setItem('nume', date.nume)
      if (date.rol === 'medic') navigate('/medic')
      else if (date.rol === 'admin') navigate('/admin')
      else {
        try { await api.get(`/pacient-fisa/${date._id}`); sessionStorage.setItem('fisaConfigurata', 'true'); navigate('/pacient') }
        catch { navigate('/configurare') }
      }
    } catch (err) {
      setEroare(err.response?.data?.mesaj || 'Nu ne-am putut conecta la server.')
    }
    setLoading(false)
  }

  const handleRegistrare = async () => {
    if (!nume) { setEroare('Completează numele.'); return }
    if (!email || !parola) { setEroare('Completează email-ul și parola.'); return }
    if (!email.includes('@')) { setEroare('Email-ul nu este valid.'); return }
    if (parola.length < 6) { setEroare('Parola trebuie să aibă minim 6 caractere.'); return }
    setLoading(true); setEroare('')
    try {
      const response = await api.post('/register', { nume, email, parola, rol })
      const userCreat = response.data.utilizator
      sessionStorage.setItem('autentificat', 'true')
      sessionStorage.setItem('rol', rol)
      sessionStorage.setItem('uid', userCreat._id)
      sessionStorage.setItem('nume', nume)
      if (rol === 'medic') navigate('/medic')
      else if (rol === 'admin') navigate('/admin')
      else navigate('/configurare')
    } catch (err) {
      setEroare(err.response?.data?.mesaj || 'Acest email este deja înregistrat.')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: '14px 16px',
    fontSize: 15,
    color: '#fff',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box',
  }

  const labelStyle = {
    display: 'block',
    fontSize: 12,
    fontWeight: 600,
    color: 'rgba(196,181,253,0.8)',
    marginBottom: 7,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  return (
    <div style={{ height: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>

      {/* Fundal */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: `url(${BG_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.25) saturate(0.8)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(76,29,149,0.88) 0%, rgba(15,10,30,0.95) 60%, rgba(15,10,30,0.98) 100%)' }} />
      <div style={{ position: 'fixed', top: -100, right: -100, width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.28) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: -150, left: -150, width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Wrapper centrat pe tot ecranul */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        width: '100%', height: '100%',
      }}>
        {/* Container interior — lățime fixă, cele două coloane lipite */}
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: 60,
          width: '85%', maxWidth: 1100,
          animation: 'fadeInUp 0.6s ease both',
        }}>

          {/* Stânga — tagline */}
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: 20, padding: '8px 18px', marginBottom: 32 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa', display: 'inline-block', animation: 'pulse-ring 2s ease infinite' }} />
              <span style={{ fontSize: 14, color: '#c4b5fd', fontWeight: 500 }}>Monitorizare în timp real</span>
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 64, color: '#fff', lineHeight: 1.08, letterSpacing: '-2px', margin: '0 0 24px' }}>
              Îngrijire modernă,<br />
              <em style={{ color: '#c4b5fd', fontStyle: 'italic' }}>conectată inteligent.</em>
            </h1>

            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 40px' }}>
              Monitorizare ECG, temperatură și puls în timp real pentru pacienți și medici — oriunde, oricând.
            </p>

            <div style={{ opacity: 0.3 }}>
              <svg viewBox="0 0 500 50" width="380" height="50">
                <polyline points="0,25 60,25 80,25 90,5 100,45 110,8 120,25 180,25 240,25 260,25 270,5 280,45 290,8 300,25 360,25 420,25 440,25 450,5 460,45 470,8 480,25 500,25"
                  fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
          </div>

          {/* Dreapta — formular */}
          <div style={{ width: 440, flexShrink: 0 }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '40px 36px' }}>

              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#fff', marginBottom: 6 }}>
                {modRegistrare ? 'Cont nou' : 'Bun venit înapoi'}
              </div>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 26 }}>
                Portal Clinica "Sănătatea Noastră"
              </p>

              {/* Selector rol */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.25)', borderRadius: 13, padding: 4, marginBottom: 24, gap: 3 }}>
                {['medic', 'pacient', 'admin'].map(r => (
                  <button key={r} onClick={() => setRol(r)} style={{
                    flex: 1, padding: '11px 0', fontSize: 14, fontWeight: 500, border: 'none',
                    borderRadius: 10, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                    background: rol === r ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 'transparent',
                    color: rol === r ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s',
                    boxShadow: rol === r ? '0 2px 10px rgba(139,92,246,0.4)' : 'none',
                  }}>
                    {r === 'admin' ? 'Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              {modRegistrare && (
                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Nume complet</label>
                  <input type="text" placeholder="ex: Dr. Ionescu" value={nume} onChange={e => setNume(e.target.value)} style={inputStyle} />
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Email</label>
                <input type="email" placeholder="exemplu@email.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
              </div>

              <div style={{ marginBottom: 22 }}>
                <label style={labelStyle}>Parolă</label>
                <div style={{ position: 'relative' }}>
                  <input type={showParola ? 'text' : 'password'} placeholder="••••••••" value={parola}
                    onChange={e => setParola(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (modRegistrare ? handleRegistrare() : handleLogin())}
                    style={{ ...inputStyle, paddingRight: 48 }}
                  />
                  <button onClick={() => setShowParola(!showParola)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                    {showParola
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {eroare && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: 11 }}>
                  <p style={{ fontSize: 14, color: '#fca5a5', margin: 0 }}>{eroare}</p>
                </div>
              )}

              <button onClick={modRegistrare ? handleRegistrare : handleLogin} disabled={loading}
                style={{ width: '100%', padding: '15px', fontSize: 16, background: loading ? 'rgba(139,92,246,0.4)' : 'linear-gradient(135deg, #8b5cf6, #7c3aed)', color: '#fff', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, boxShadow: '0 4px 20px rgba(139,92,246,0.4)', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!loading) { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 28px rgba(139,92,246,0.55)' }}}
                onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(139,92,246,0.4)' }}
              >
                {loading ? 'Se procesează...' : modRegistrare ? 'Creează cont' : 'Intră în cont'}
              </button>

              <button onClick={() => { setModRegistrare(!modRegistrare); setEroare('') }}
                style={{ width: '100%', marginTop: 12, padding: '10px', background: 'none', border: 'none', fontSize: 14, color: 'rgba(196,181,253,0.6)', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                {modRegistrare ? 'Ai deja cont? Intră în cont' : 'Nu ai cont? Creează unul acum'}
              </button>

              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.2)', marginTop: 20, borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 16 }}>
                © 2026 Clinica Sănătatea Noastră · Timișoara
              </p>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse-ring { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.35; transform:scale(0.65); } }
        input::placeholder { color: rgba(255,255,255,0.25) !important; }
      `}</style>
    </div>
  )
}

export default Login