import { useState } from 'react'
import { consultaRapida } from '../services/agendamientoService'

function ConsultaRapida({ token }) {
  const [patente, setPatente] = useState('')
  const [resultados, setResultados] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const buscar = async () => {
    if (!patente.trim()) return
    setCargando(true)
    setError('')
    setResultados(null)
    try {
      const data = await consultaRapida(patente, token)
      if (data.length === 0) {
        setError('No se encontraron agendamientos para esa patente')
      } else {
        setResultados(data)
      }
    } catch {
      setError('Error al consultar. Verifica el BFF.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Consulta Rápida por Patente</h2>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
        <input
          type="text"
          placeholder="Ej: ABCD-1212"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
          style={{ padding: '0.5rem', flex: 1 }}
        />
        <button onClick={buscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {resultados && (
        <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patente</th>
              <th>Estado</th>
              <th>Inicio</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.patenteCamion}</td>
                <td>{a.estadoAgendamiento}</td>
                <td>{a.bloqueInicio}</td>
                <td>{a.tipoOperacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default ConsultaRapida