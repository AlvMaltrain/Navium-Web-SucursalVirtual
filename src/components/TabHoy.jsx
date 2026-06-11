import { useState, useEffect } from 'react'
import { Button } from 'navium-ui-lib'
import { listarPorFechas } from '../services/agendamientoService'
import { estadoBadge, fmtFecha } from './helpers'

const ESTADOS_ACTIVOS = ['CREADO', 'EN_TRANSITO']

function TabHoy() {
  const [resultados, setResultados] = useState(null)
  const [error, setError]           = useState('')
  const [cargando, setCargando]     = useState(false)

  const cargar = async () => {
    setCargando(true); setError(''); setResultados(null)
    try {
      const hoy    = new Date()
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(),  0,  0,  0).toISOString().slice(0, 19)
      const fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59).toISOString().slice(0, 19)

      const data    = await listarPorFechas(inicio, fin)
      const activos = (data ?? []).filter(a => ESTADOS_ACTIVOS.includes(a.estadoAgendamiento))

      if (activos.length === 0) setError('No hay camiones agendados activos para hoy.')
      else setResultados(activos)
    } catch {
      setError('Error al obtener agendamientos del día.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  return (
    <div className="tab-content">
      <h2 className="section-title">Agendamientos de Hoy</h2>
      <p className="section-desc">Camiones activos agendados para el día de hoy.</p>

      <div className="search-row">
        <Button variant="secondary" onClick={cargar} disabled={cargando}>
          {cargando ? 'Actualizando...' : '↻ Actualizar'}
        </Button>
      </div>

      {error && <div className="alert alert--info">{error}</div>}

      {resultados && (
        <div className="results-block">
          <p className="results-count">{resultados.length} camión(es) activo(s) hoy</p>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Patente</th><th>RUT Chofer</th><th>Tipo</th>
                  <th>Contenedor</th><th>Bloque Fin</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultados
                  .sort((a, b) => new Date(a.bloqueFin) - new Date(b.bloqueFin))
                  .map((a) => (
                    <tr key={a.id}>
                      <td className="id-cell">#{a.id}</td>
                      <td className="mono">{a.patenteCamion}</td>
                      <td className="mono">{a.rutChofer}</td>
                      <td>{a.tipoOperacion}</td>
                      <td className="mono">{a.idContenedor ?? '—'}</td>
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

export default TabHoy
