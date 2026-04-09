import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, CreditCard } from 'lucide-react'
import api from '../api' // Noul curier catre Node.js

function ConfigurareContPacient() {
  const [cnp, setCnp] = useState('')
  const [eroare, setEroare] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleCautare = async () => {
    if (!cnp || cnp.length !== 13) {
      setEroare('CNP-ul trebuie să aibă 13 cifre.')
      return
    }

    setLoading(true)
    setEroare('')

    try {
      const uid = sessionStorage.getItem('uid')
      
      // Trimitem cererea catre serverul tau Node.js
      await api.post('/link-pacient', { cnp, uid })

      sessionStorage.setItem('fisaConfigurata', 'true')
      navigate('/pacient')

    } catch (err) {
      // Daca serverul Node.js ne da o eroare (ex: Nu am gasit CNP-ul)
      if (err.response && err.response.data) {
        setEroare(err.response.data.mesaj || 'Eroare la legarea fișei medicale.')
      } else {
        setEroare('Nu ne-am putut conecta la server. ' + err.message)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">

        <div className="flex flex-col items-center mb-8">
          <div className="bg-purple-600 rounded-full p-4 mb-4">
            <Heart className="text-white" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Configurare Cont</h1>
          <p className="text-gray-500 text-sm mt-1 text-center">
            Introdu CNP-ul tău pentru a-ți găsi fișa medicală
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">CNP</label>
          <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2 focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-blue-500">
            <CreditCard size={18} className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="ex: 1570312034521"
              value={cnp}
              maxLength={13}
              onChange={(e) => setCnp(e.target.value)}
              className="flex-1 outline-none text-sm text-gray-700"
            />
          </div>
        </div>

        {eroare && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{eroare}</p>
          </div>
        )}

        <button
          onClick={handleCautare}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-blue-300 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {loading ? 'Se caută...' : 'Găsește fișa mea'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          © 2026 Clinica Sănătatea Noastră
        </p>
      </div>
    </div>
  )
}

export default ConfigurareContPacient