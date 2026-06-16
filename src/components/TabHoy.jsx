import { useState, useEffect } from 'react'
import { Button } from 'navium-ui-lib'
import { CalendarCheck2, Truck, CheckCircle2, Ban, ArrowDownToLine, ArrowUpFromLine, PackageOpen } from 'lucide-react'
import { listarPorFechas } from '../services/agendamientoService'
import { estadoBadge, fmtFecha } from './helpers'

const ESTADOS_ACTIVOS = ['CREADO', 'EN_TRANSITO']

function TabHoy() {
  const [todos, setTodos]       = useState([])
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const cargar = async () => {
    setCargando(true); setError('')
    try {
      const hoy    = new Date()
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(),  0,  0,  0).toISOString().slice(0, 19)
      const fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59).toISOString().slice(0, 19)

      const data = await listarPorFechas(inicio, fin)
      setTodos(Array.isArray(data) ? data : [])
    } catch {
      setError('Error al obtener agendamientos del día.')
      setTodos([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => { cargar() }, [])

  // ── Métricas ──
  const activos      = todos.filter(a => ESTADOS_ACTIVOS.includes(a.estadoAgendamiento))
  const finalizados  = todos.filter(a => a.estadoAgendamiento === 'FINALIZADO').length
  const cancelados   = todos.filter(a => a.estadoAgendamiento === 'CANCELADO').length

  const ingresos     = todos.filter(a => a.tipoOperacion === 'INGRESO_CARGA').length
  const retiros      = todos.filter(a => a.tipoOperacion === 'RETIRO_CARGA').length
  const devoluciones = todos.filter(a => a.tipoOperacion === 'DEVOLUCION_VACIO').length

  const stats = [
    { label: 'Total del día', value: todos.length,    icon: CalendarCheck2, cls: 'stat--primary' },
    { label: 'Activos',       value: activos.length,  icon: Truck,          cls: 'stat--info'    },
    { label: 'Finalizados',   value: finalizados,     icon: CheckCircle2,   cls: 'stat--success' },
    { label: 'Cancelados',    value: cancelados,      icon: Ban,            cls: 'stat--error'   },
  ]

  const tipos = [
    { label: 'Ingreso de carga',   value: ingresos,     icon: ArrowDownToLine },
    { label: 'Retiro de carga',    value: retiros,      icon: ArrowUpFromLine },
    { label: 'Devolución vacío',   value: devoluciones, icon: PackageOpen     },
  ]

  const fechaHoy = new Date().toLocaleDateString('es-CL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  })

  return (
    <div className="tab-content">
      <div className="hoy-header">
        <div>
          <h2 className="section-title">Resumen de Hoy</h2>
          <p className="section-desc hoy-fecha">{fechaHoy}</p>
        </div>
        <Button variant="secondary" onClick={cargar} disabled={cargando}>
          {cargando ? 'Actualizando...' : '↻ Actualizar'}
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {/* ── Tarjetas de métricas ── */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-icon"><s.icon size={22} /></div>
            <div className="stat-body">
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desglose por tipo de operación ── */}
      <div className="tipo-grid">
        {tipos.map((t) => (
          <div key={t.label} className="tipo-card">
            <t.icon size={18} className="tipo-icon" />
            <span className="tipo-value">{t.value}</span>
            <span className="tipo-label">{t.label}</span>
          </div>
        ))}
      </div>

      {/* ── Tabla de camiones activos ── */}
      <div className="results-block">
        <p className="results-count">Camiones activos ({activos.length})</p>

        {activos.length === 0 ? (
          <div className="hoy-empty">
            <Truck size={40} className="hoy-empty-icon" />
            <p>No hay camiones activos en este momento.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th><th>Patente</th><th>RUT Chofer</th><th>Tipo</th>
                  <th>Contenedor</th><th>Bloque Fin</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {activos
                  .sort((a, b) => new Date(a.bloqueFin) - new Date(b.bloqueFin))
                  .map((a) => (
                    <tr key={a.id}>
                      <td className="id-cell">#{a.id}</td>
                      <td className="mono">{a.patenteCamion}</td>
                      <td className="mono">{a.rutChofer}</td>
                      <td>{a.tipoOperacion}</td>
                      <td className="mono">{a.contenedorId ?? '—'}</td>
                      <td>{fmtFecha(a.bloqueFin)}</td>
                      <td>{estadoBadge(a.estadoAgendamiento)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TabHoy
