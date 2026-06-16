import { useState } from 'react'
import { Button } from 'navium-ui-lib'
import { consultaCompleta } from '../services/agendamientoService'
import { estadoBadge, fmtFecha } from './helpers'

function TabConsultaCompleta() {
  const [patente, setPatente]     = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)

  const buscar = async () => {
    if (!patente.trim()) return
    setCargando(true); setError(''); setResultado(null)
    try {
      const data = await consultaCompleta(patente.trim())
      if (!data || !data.agendamiento) setError('No se encontró agendamiento para esa patente.')
      else setResultado(data)
    } catch {
      setError('Error al consultar. Verifica conexión con el BFF.')
    } finally {
      setCargando(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') buscar() }

  const a = resultado?.agendamiento
  const c = resultado?.contenedor

  return (
    <div className="tab-content">
      <h2 className="section-title">Consulta Completa por Patente</h2>
      <p className="section-desc">Obtén el agendamiento y el contenedor asociado de un camión.</p>

      <div className="search-row">
        <input
          className="field-input search-input"
          type="text"
          placeholder="Ej: ABCD-1212"
          value={patente}
          onChange={(e) => setPatente(e.target.value.toUpperCase())}
          onKeyDown={handleKey}
        />
        <Button variant="primary" size="sm" onClick={buscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {resultado && (
        <div className="consulta-completa-grid">

          <div className="info-card">
            <h3 className="info-card__title">🚛 Agendamiento</h3>
            <div className="info-rows">
              <div className="info-row"><span className="info-label">ID</span><span className="info-value mono">#{a.id}</span></div>
              <div className="info-row"><span className="info-label">Patente</span><span className="info-value mono">{a.patenteCamion}</span></div>
              <div className="info-row"><span className="info-label">RUT Chofer</span><span className="info-value mono">{a.rutChofer}</span></div>
              <div className="info-row"><span className="info-label">Correo</span><span className="info-value">{a.correoUsuario}</span></div>
              <div className="info-row"><span className="info-label">Tipo Operación</span><span className="info-value">{a.tipoOperacion}</span></div>
              <div className="info-row"><span className="info-label">Hora Inicio</span><span className="info-value">{fmtFecha(a.horaInicio)}</span></div>
              <div className="info-row"><span className="info-label">Estado</span><span className="info-value">{estadoBadge(a.estadoAgendamiento)}</span></div>
            </div>
          </div>

          <div className="info-card">
            <h3 className="info-card__title">📦 Contenedor</h3>
            {c ? (
              <div className="info-rows">
                <div className="info-row"><span className="info-label">Código</span><span className="info-value mono">{c.codigoSigla}</span></div>
                <div className="info-row"><span className="info-label">Tipo Carga</span><span className="info-value">{c.tipoCarga}</span></div>
                <div className="info-row"><span className="info-label">RUT Empresa</span><span className="info-value mono">{c.rutEmpresaTransporte}</span></div>
                <div className="info-row"><span className="info-label">Estado BL</span><span className="info-value">{c.estadoBL}</span></div>
                <div className="info-row"><span className="info-label">Estado TATC</span><span className="info-value">{c.estadoTATC}</span></div>
                <div className="info-row"><span className="info-label">Estado General</span><span className="info-value">{c.estadoGeneral}</span></div>
              </div>
            ) : (
              <div className="alert alert--info" style={{ marginTop: '1rem' }}>
                Este agendamiento no tiene contenedor asociado.
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  )
}

export default TabConsultaCompleta
