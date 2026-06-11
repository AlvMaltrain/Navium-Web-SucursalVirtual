import { useState } from 'react'
import { Button } from 'navium-ui-lib'
import { crearAgendamiento } from '../services/agendamientoService'
import { TIPOS_OP } from './helpers'

// ─── Helpers internos ────────────────────────────────────────────────────────

const formInicial = () => ({
  idUsuario:     '',
  correoUsuario: '',
  patenteCamion: '',
  rutChofer:     '',
  tipoOperacion: 'INGRESO_CARGA',
  idContenedor:  '',
  horaInicio:    '',
})

const validar = (form) => {
  const errores = {}

  if (!String(form.idUsuario).trim())
    errores.idUsuario = 'El ID de usuario es obligatorio'
  else if (isNaN(Number(form.idUsuario)) || Number(form.idUsuario) <= 0)
    errores.idUsuario = 'Debe ser un número válido mayor a 0'

  if (!form.correoUsuario.trim())
    errores.correoUsuario = 'El correo es obligatorio'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correoUsuario.trim()))
    errores.correoUsuario = 'Formato inválido. Ejemplo: usuario@correo.com'

  if (!form.patenteCamion.trim())
    errores.patenteCamion = 'La patente es obligatoria'
  else if (!/^[A-Z]{4}-\d{4}$/.test(form.patenteCamion.trim()))
    errores.patenteCamion = 'Formato inválido. Ejemplo: ABCD-1212'

  if (!form.rutChofer.trim())
    errores.rutChofer = 'El RUT es obligatorio'
  else if (!/^\d{7,8}-[\dkK]$/.test(form.rutChofer.trim()))
    errores.rutChofer = 'Formato inválido. Ejemplo: 12345678-9'

  if (!form.tipoOperacion)
    errores.tipoOperacion = 'Selecciona un tipo de operación'

  if (!form.horaInicio)
    errores.horaInicio = 'La hora de inicio es obligatoria'

  return errores
}

// ─── Componente ──────────────────────────────────────────────────────────────

function TabCrear() {
  const [form, setForm]               = useState(formInicial)
  const [errores, setErrores]         = useState({})
  const [ok, setOk]                   = useState(null)
  const [serverError, setServerError] = useState('')
  const [cargando, setCargando]       = useState(false)

  const set = (k) => (e) => {
    const val = e.target.value
    setForm((f) => ({ ...f, [k]: val }))
    if (errores[k]) setErrores((prev) => ({ ...prev, [k]: undefined }))
  }

  const enviar = async () => {
    const erroresNuevos = validar(form)
    if (Object.keys(erroresNuevos).length > 0) {
      setErrores(erroresNuevos)
      return
    }

    setCargando(true); setServerError(''); setOk(null)
    try {
      const payload = {
        idUsuario:     Number(form.idUsuario),
        correoUsuario: form.correoUsuario.trim(),
        patenteCamion: form.patenteCamion.trim().toUpperCase(),
        rutChofer:     form.rutChofer.trim(),
        tipoOperacion: form.tipoOperacion,
        horaInicio:    form.horaInicio,
        ...(form.idContenedor.trim() && { idContenedor: form.idContenedor.trim() }),
      }
      const data = await crearAgendamiento(payload)
      setOk(data)
      setForm(formInicial)
      setErrores({})
    } catch (e) {
      setServerError(e.message ?? 'Error al crear el agendamiento')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tab-content">
      <h2 className="section-title">Nuevo Agendamiento</h2>
      <p className="section-desc">Registra una nueva entrada de camión al puerto.</p>

      {serverError && <div className="alert alert--error">{serverError}</div>}
      {ok && (
        <div className="alert alert--success">
          Agendamiento <strong>#{ok.id}</strong> creado exitosamente.
        </div>
      )}

      <div className="form-grid">
        <div className="field-group">
          <label className="field-label">ID Usuario *</label>
          <input
            className={`field-input ${errores.idUsuario ? 'field-input--error' : ''}`}
            type="number"
            placeholder="Ej: 1"
            value={form.idUsuario}
            onChange={set('idUsuario')}
          />
          {errores.idUsuario && <span className="field-error">{errores.idUsuario}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Correo Electrónico *</label>
          <input
            className={`field-input ${errores.correoUsuario ? 'field-input--error' : ''}`}
            type="email"
            placeholder="usuario@correo.com"
            value={form.correoUsuario}
            onChange={set('correoUsuario')}
          />
          {errores.correoUsuario && <span className="field-error">{errores.correoUsuario}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Patente Camión *</label>
          <input
            className={`field-input ${errores.patenteCamion ? 'field-input--error' : ''}`}
            placeholder="ABCD-1212"
            value={form.patenteCamion}
            onChange={set('patenteCamion')}
            onBlur={(e) => setForm(f => ({ ...f, patenteCamion: e.target.value.toUpperCase() }))}
          />
          {errores.patenteCamion && <span className="field-error">{errores.patenteCamion}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">RUT Chofer *</label>
          <input
            className={`field-input ${errores.rutChofer ? 'field-input--error' : ''}`}
            placeholder="12345678-9"
            value={form.rutChofer}
            onChange={set('rutChofer')}
          />
          {errores.rutChofer && <span className="field-error">{errores.rutChofer}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">Tipo Operación *</label>
          <select
            className={`field-select ${errores.tipoOperacion ? 'field-input--error' : ''}`}
            value={form.tipoOperacion}
            onChange={set('tipoOperacion')}
          >
            {TIPOS_OP.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          {errores.tipoOperacion && <span className="field-error">{errores.tipoOperacion}</span>}
        </div>

        <div className="field-group">
          <label className="field-label">ID Contenedor</label>
          <input
            className="field-input"
            placeholder="CONT-000001"
            value={form.idContenedor}
            onChange={set('idContenedor')}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Hora de Inicio *</label>
          <input
            className={`field-input ${errores.horaInicio ? 'field-input--error' : ''}`}
            type="datetime-local"
            value={form.horaInicio}
            onChange={set('horaInicio')}
          />
          {errores.horaInicio && <span className="field-error">{errores.horaInicio}</span>}
        </div>
      </div>

      <div className="form-actions">
        <Button variant="primary" size="lg" onClick={enviar} disabled={cargando}>
          {cargando ? 'Creando...' : 'Crear Agendamiento'}
        </Button>
        <Button variant="ghost" onClick={() => { setForm(formInicial); setErrores({}); setOk(null); setServerError('') }}>
          Limpiar
        </Button>
      </div>
    </div>
  )
}

export default TabCrear
