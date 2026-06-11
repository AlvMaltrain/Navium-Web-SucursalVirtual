import { useState } from 'react'
import { Button } from 'navium-ui-lib'
import { buscarPorRutChofer } from '../services/agendamientoService'
import { estadoBadge, fmtFecha } from './helpers'

function TabBuscarRut() {
  const [rut, setRut]               = useState('')
  const [resultados, setResultados] = useState(null)
  const [error, setError]           = useState('')
  const [cargando, setCargando]     = useState(false)

  const buscar = async () => {
    if (!rut.trim()) return
    setCargando(true); setError(''); setResultados(null)
    try {
      const data = await buscarPorRutChofer(rut.trim())
      if (!data || data.length === 0) setError('No se encontraron agendamientos para ese RUT.')
      else setResultados(data)
    } catch {
      setError('Error al consultar. Verifica conexión con el BFF.')
    } finally {
      setCargando(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') buscar() }

  return (
    <div className="tab-content">
      <h2 className="section-title">Buscar por RUT de Chofer</h2>
      <p className="section-desc">Consulta todos los agendamientos asociados a un chofer.</p>

      <div className="search-row">
        <input
          className="field-input search-input"
          type="text"
          placeholder="Ej: 12345678-9"
          value={rut}
          onChange={(e) => setRut(e.target.value)}
          onKeyDown={handleKey}
        />
        <Button variant="primary" onClick={buscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {resultados && (
        <div className="results-block">
          <p className="results-count">{resultados.length} agendamiento(s) encontrado(s)</p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Patente</th><th>RUT Chofer</th><th>Tipo</th>
                  <th>Contenedor</th><th>Inicio</th><th>Fin</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((a) => (
                  <tr key={a.id}>
                    <td className="id-cell">#{a.id}</td>
                    <td className="mono">{a.patenteCamion}</td>
                    <td className="mono">{a.rutChofer}</td>
                    <td>{a.tipoOperacion}</td>
                    <td className="mono">{a.idContenedor ?? '—'}</td>
                    <td>{fmtFecha(a.horaInicio)}</td>
                    <td>{fmtFecha(a.bloqueFin)}</td>
                    <td>{estadoBadge(a.estadoAgendamiento)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TabBuscarRut
