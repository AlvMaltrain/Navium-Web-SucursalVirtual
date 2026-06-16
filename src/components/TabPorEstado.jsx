import { useState } from 'react'
import { Button } from 'navium-ui-lib'
import { listarPorEstado } from '../services/agendamientoService'
import { ESTADOS, ESTADO_LABELS, estadoBadge, fmtFecha } from './helpers'

function TabPorEstado() {
  const [estadoSel, setEstadoSel] = useState('CREADO')
  const [resultados, setResultados] = useState(null)
  const [error, setError]           = useState('')
  const [cargando, setCargando]     = useState(false)

  const cargar = async () => {
    setCargando(true); setError(''); setResultados(null)
    try {
      const data = await listarPorEstado(estadoSel)
      setResultados(data ?? [])
    } catch {
      setError('Error al obtener agendamientos.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tab-content">
      <h2 className="section-title">Agendamientos por Estado</h2>
      <p className="section-desc">Filtra todos los agendamientos según su estado actual.</p>

      <div className="search-row">
        <select
          className="field-select"
          value={estadoSel}
          onChange={(e) => setEstadoSel(e.target.value)}
        >
          {ESTADOS.map((e) => <option key={e} value={e}>{ESTADO_LABELS[e]}</option>)}
        </select>
        <Button variant="secondary" size="sm" onClick={cargar} disabled={cargando}>
          {cargando ? 'Cargando...' : 'Consultar'}
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {resultados !== null && (
        resultados.length === 0
          ? <div className="alert alert--info">No hay agendamientos con estado <strong>{ESTADO_LABELS[estadoSel]}</strong>.</div>
          : (
            <div className="results-block">
              <p className="results-count">{resultados.length} agendamiento(s)</p>
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
                        <td className="mono">{a.contenedorId ?? '—'}</td>
                        <td>{fmtFecha(a.bloqueInicio)}</td>
                        <td>{fmtFecha(a.bloqueFin)}</td>
                        <td>{estadoBadge(a.estadoAgendamiento)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
      )}
    </div>
  )
}

export default TabPorEstado
