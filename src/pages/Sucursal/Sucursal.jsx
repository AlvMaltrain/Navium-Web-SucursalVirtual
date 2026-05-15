import { useState, useEffect } from 'react'
import { Button } from 'navium-ui-lib'
import { consultaRapida, listarPorEstado, crearAgendamiento, cancelarAgendamiento, consultaCompleta, login, registrar, buscarPorRutChofer, listarPorFechas } from '../../services/agendamientoService'
import './Sucursal.css'
import 'navium-ui-lib/dist/navium-ui-lib.cjs.css'
import { CalendarCheck2, FastForward, ClipboardCheck, ChartColumn, Fingerprint, Plus, Ban } from 'lucide-react'

import logo from '/src/assets/navium-v1.png'

// ─── Helpers ────────────────────────────────────────────────────────────────

const ESTADOS = ['CREADO', 'EN_TRANSITO', 'EN_PUERTA', 'DENTRO_DEL_PUERTO', 'FINALIZADO', 'CANCELADO']
const TIPOS_OP = ['INGRESO_CARGA', 'RETIRO_CARGA', 'DEVOLUCION_VACIO']

const estadoBadge = (estado) => {
  const map = {
    CREADO:            { cls: 'badge--info',    label: 'Creado'            },
    EN_TRANSITO:       { cls: 'badge--warning', label: 'En Tránsito'       },
    EN_PUERTA:         { cls: 'badge--primary', label: 'En Puerta'         },
    DENTRO_DEL_PUERTO: { cls: 'badge--primary', label: 'Dentro del Puerto' },
    FINALIZADO:        { cls: 'badge--success', label: 'Finalizado'        },
    CANCELADO:         { cls: 'badge--error',   label: 'Cancelado'         },
  }
  const cfg = map[estado] ?? { cls: 'badge--ghost', label: estado }
  return <span className={`badge ${cfg.cls}`}>{cfg.label}</span>
}

const ESTADO_LABELS = {
  CREADO:            'Creado',
  EN_TRANSITO:       'En Tránsito',
  EN_PUERTA:         'En Puerta',
  DENTRO_DEL_PUERTO: 'Dentro del Puerto',
  FINALIZADO:        'Finalizado',
  CANCELADO:         'Cancelado',
}

const fmtFecha = (dt) => {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function Footer({ logo, moduleLinks }) {
  const links = moduleLinks?.length ? moduleLinks : [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Reportes', href: '/reports' },
    { label: 'Configuración', href: '/settings' },
  ]

  return (
    <footer className="app-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src={logo} alt="Navium logo" className="footer-logo" />
          <div className="footer-brand-text">
            <span className="footer-title">NAVIUM</span>
            <span className="footer-subtitle">Plataforma integral de gestión portuaria</span>
          </div>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <span className="footer-column-title">ENLACES DEL MÓDULO</span>
            <div className="footer-nav">
              {links.map((link) => (
                <a key={link.label} href={link.href}>{link.label}</a>
              ))}
            </div>
          </div>

          <div className="footer-column">
            <span className="footer-column-title">LEGAL</span>
            <div className="footer-nav">
              <a href="/terms">Términos y Condiciones</a>
              <a href="/privacy">Política de privacidad</a>
              <a href="/cookies">Política de Cookies</a>
            </div>
          </div>

          <div className="footer-column">
            <span className="footer-column-title">CONTACTO</span>
            <div className="footer-contact">
              <span>Email: <a href="mailto:soporte@navium.com">soporte@navium.com</a></span>
              <span>Teléfono: +56 1234 56789</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">2026 Navium. Todos los derechos reservados.</div>
    </footer>
  )
}

// ─── Pantalla de login ───────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [vista, setVista]         = useState('login') // 'login' | 'registro'
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)

  // ── Campos registro ──
  const [regForm, setRegForm] = useState({
    rut: '', nombre: '', email: '', password: '', rol: 'ROL_SUCURSAL'
  })
  const [regOk, setRegOk]   = useState(false)
  const [regErr, setRegErr] = useState('')

  const setReg = (k) => (e) => setRegForm(f => ({ ...f, [k]: e.target.value }))

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) { setError('Completa todos los campos'); return }
    setCargando(true); setError('')
    try {
      const data = await login(email.trim(), password.trim())
      onLogin(data.token)
    } catch (e) {
      setError(e.message ?? 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  const handleRegistro = async () => {
    const { rut, nombre, email, password } = regForm
    if (!rut || !nombre || !email || !password) { setRegErr('Completa todos los campos obligatorios'); return }
    setCargando(true); setRegErr(''); setRegOk(false)
    try {
      await registrar(regForm)
      setRegOk(true)
      setRegForm({ rut: '', nombre: '', email: '', password: '', rol: 'ROL_SUCURSAL' })
    } catch (e) {
      setRegErr(e.message ?? 'Error al registrar usuario')
    } finally {
      setCargando(false)
    }
  }

  const handleKey = (e) => { if (e.key === 'Enter') handleLogin() }

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src={logo} alt="Navium logo" className="login-logo" />
        <p className="login-sub">Sucursal Virtual · Acceso Operadores</p>

        {/* ── Tabs login / registro ── */}
        <div className="login-tabs">
          <button
            className={`login-tab ${vista === 'login' ? 'login-tab--active' : ''}`}
            onClick={() => { setVista('login'); setError(''); setRegErr(''); setRegOk(false) }}
          >
            Iniciar sesión
          </button>
          <button
            className={`login-tab ${vista === 'registro' ? 'login-tab--active' : ''}`}
            onClick={() => { setVista('registro'); setError(''); setRegErr(''); setRegOk(false) }}
          >
            Registrarse
          </button>
        </div>

        {vista === 'login' ? (
          <>
            {error && <div className="alert alert--error">{error}</div>}
            <div className="login-field">
              <label className="field-label">Correo electrónico</label>
              <input
                className="field-input"
                type="email"
                placeholder="usuario@puerto.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <div className="login-field">
              <label className="field-label">Contraseña</label>
              <input
                className="field-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKey}
              />
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleLogin}
              disabled={cargando}
            >
              {cargando ? 'Ingresando...' : 'Ingresar al sistema'}
            </Button>
          </>
        ) : (
          <>
            {regErr && <div className="alert alert--error">{regErr}</div>}
            {regOk  && <div className="alert alert--success"> Usuario registrado. Ya puedes iniciar sesión.</div>}
            <div className="login-field">
              <label className="field-label">RUT *</label>
              <input className="field-input" placeholder="12345678-9"
                value={regForm.rut} onChange={setReg('rut')} />
            </div>
            <div className="login-field">
              <label className="field-label">Nombre *</label>
              <input className="field-input" placeholder="Nombre completo"
                value={regForm.nombre} onChange={setReg('nombre')} />
            </div>
            <div className="login-field">
              <label className="field-label">Correo electrónico *</label>
              <input className="field-input" type="email" placeholder="usuario@puerto.cl"
                value={regForm.email} onChange={setReg('email')} />
            </div>
            <div className="login-field">
              <label className="field-label">Contraseña *</label>
              <input className="field-input" type="password" placeholder="••••••••"
                value={regForm.password} onChange={setReg('password')} />
            </div>
            <div className="login-field">
              <label className="field-label">Rol</label>
              <select className="field-select" value={regForm.rol} onChange={setReg('rol')}>
                <option value="ROL_SUCURSAL">Sucursal</option>
                <option value="ROL_OPERADOR">Operador</option>
                <option value="ROL_CENTRO_MANDO">Centro de Mando</option>
              </select>
            </div>
            <Button
              variant="primary"
              size="lg"
              onClick={handleRegistro}
              disabled={cargando}
            >
              {cargando ? 'Registrando...' : 'Crear cuenta'}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Tab: Consulta Rápida ────────────────────────────────────────────────────

function TabConsultaRapida({ token }) {
  const [patente, setPatente] = useState('')
  const [resultados, setResultados] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const buscar = async () => {
    if (!patente.trim()) return
    setCargando(true); setError(''); setResultados(null)
    try {
      const data = await consultaRapida(patente.trim(), token)
      if (!data || data.length === 0) setError('No se encontraron agendamientos para esa patente.')
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
      <h2 className="section-title">Consulta Rápida por Patente</h2>
      <p className="section-desc">Verifica si un camión tiene reservas activas en el puerto.</p>

      <div className="search-row">
        <input
          className="field-input search-input"
          type="text"
          placeholder="Ej: ABCD-1212"
          value={patente}
          onChange={(e) => setPatente(e.target.value.toUpperCase())}
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
                  <th>ID</th><th>Patente</th><th>Tipo</th><th>Contenedor</th>
                  <th>Inicio</th><th>Fin</th><th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {resultados.map((a) => (
                  <tr key={a.id}>
                    <td className="id-cell">#{a.id}</td>
                    <td className="mono">{a.patenteCamion}</td>
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

// ─── Tab: Consulta Completa ──────────────────────────────────────────────────

function TabConsultaCompleta({ token }) {
  const [patente, setPatente]     = useState('')
  const [resultado, setResultado] = useState(null)
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)

  const buscar = async () => {
    if (!patente.trim()) return
    setCargando(true); setError(''); setResultado(null)
    try {
      const data = await consultaCompleta(patente.trim(), token)
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
        <Button variant="primary" onClick={buscar} disabled={cargando}>
          {cargando ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {error && <div className="alert alert--error">{error}</div>}

      {resultado && (
        <div className="consulta-completa-grid">

          <div className="info-card">
            <h3 className="info-card__title">🚛Agendamiento</h3>
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
            <h3 className="info-card__title">📦Contenedor</h3>
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

// ─── Tab: Ver por Estado ─────────────────────────────────────────────────────

function TabPorEstado({ token }) {
  const [estadoSel, setEstadoSel] = useState('CREADO')
  const [resultados, setResultados] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cargar = async () => {
    setCargando(true); setError(''); setResultados(null)
    try {
      const data = await listarPorEstado(estadoSel, token)
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
        <Button variant="secondary" onClick={cargar} disabled={cargando}>
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
                        <td className="mono">{a.idContenedor ?? '—'}</td>
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

// ─── Tab: Crear Agendamiento ─────────────────────────────────────────────────

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

function TabCrear({ token }) {
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
      const data = await crearAgendamiento(payload, token)
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

// ─── Tab: Cancelar Agendamiento ──────────────────────────────────────────────

function TabCancelar({ token }) {
  const [id, setId]               = useState('')
  const [ok, setOk]               = useState(false)
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  const cancelar = async () => {
    if (!id.trim()) { setError('Ingresa el ID del agendamiento'); return }
    setCargando(true); setError(''); setOk(false)
    try {
      await cancelarAgendamiento(id.trim(), token)
      setOk(true); setId(''); setConfirmar(false)
    } catch {
      setError('Error al cancelar. Verifica que el ID sea válido y el estado lo permita.')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="tab-content">
      <h2 className="section-title">Cancelar Agendamiento</h2>
      <p className="section-desc">Cancela un agendamiento existente ingresando su ID.</p>

      {error && <div className="alert alert--error">{error}</div>}
      {ok    && <div className="alert alert--success">Agendamiento cancelado exitosamente.</div>}

      <div className="search-row">
        <input
          className="field-input"
          type="number"
          placeholder="ID del agendamiento (Ej: 42)"
          value={id}
          onChange={(e) => { setId(e.target.value); setConfirmar(false); setOk(false) }}
        />
        {!confirmar
          ? (
            <Button variant="error" onClick={() => { if (id.trim()) setConfirmar(true) }} disabled={!id.trim()}>
              Cancelar agendamiento
            </Button>
          ) : (
            <div className="confirm-row">
              <span className="confirm-label">¿Confirmas la cancelación del agendamiento <strong>#{id}</strong>?</span>
              <Button variant="error" onClick={cancelar} disabled={cargando}>
                {cargando ? 'Cancelando...' : 'Sí, cancelar'}
              </Button>
              <Button variant="ghost" onClick={() => setConfirmar(false)}>No</Button>
            </div>
          )
        }
      </div>
    </div>
  )
}

// ─── Tab: Buscar por RUT ─────────────────────────────────────────────────────

function TabBuscarRut({ token }) {
  const [rut, setRut]           = useState('')
  const [resultados, setResultados] = useState(null)
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const buscar = async () => {
    if (!rut.trim()) return
    setCargando(true); setError(''); setResultados(null)
    try {
      const data = await buscarPorRutChofer(rut.trim(), token)
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

// ─── Tab: Agendamientos de Hoy ───────────────────────────────────────────────

function TabHoy({ token }) {
  const [resultados, setResultados] = useState(null)
  const [error, setError]           = useState('')
  const [cargando, setCargando]     = useState(false)

  const ESTADOS_ACTIVOS = ['CREADO', 'EN_TRANSITO']

  const cargar = async () => {
    setCargando(true); setError(''); setResultados(null)
    try {
      const hoy   = new Date()
      const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0).toISOString().slice(0, 19)
      const fin    = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59).toISOString().slice(0, 19)

      const data = await listarPorFechas(inicio, fin, token)
      console.log('Primer registro raw:', data?.[0])  
      const activos = (data ?? [])
      .filter(a => ESTADOS_ACTIVOS.includes(a.estadoAgendamiento))
      
      if (activos.length === 0) setError('No hay camiones agendados activos para hoy.')
      else setResultados(activos)
    } catch {
      setError('Error al obtener agendamientos del día.')
    } finally {
      setCargando(false)
    }
  }

  // Carga automática al montar el componente
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

// ─── Shell principal ─────────────────────────────────────────────────────────

const TABS = [
  { id: 'hoy',      label: 'Hoy',              icon: CalendarCheck2  },
  { id: 'consulta', label: 'Consulta Rápida',  icon: FastForward     },
  { id: 'completa', label: 'Consulta Completa',icon: ClipboardCheck  },
  { id: 'estado',   label: 'Por Estado',       icon: ChartColumn     },
  { id: 'rut',      label: 'Por RUT Chofer',   icon: Fingerprint     },
  { id: 'crear',    label: 'Nuevo',            icon: Plus            },
  { id: 'cancelar', label: 'Cancelar',         icon: Ban             },
]

function Dashboard({ token, onLogout }) {
  const [tab, setTab] = useState('consulta')

  //Decodificar payload de JWT
  const payload = JSON.parse(atob(token.split('.')[1]))
  const email = payload.sub ?? ''
  const rol = payload.rol ?? ''
  const inicial = email.charAt(0).toUpperCase()

  return (
    <>
      <div className="dashboard">
      <header className="dash-header">
        <div className="dash-brand">
          <img src={logo} alt="Navium logo" className="dash-logo" />
          <span className="dash-sub">Sucursal Virtual</span>
        </div>
       <div className="dash-header-right">
          <div className="user-info">
            <div className="user-avatar">{inicial}</div>
            <div className="user-details">
              <span className="user-email">{email}</span>
              <span className="user-rol">{rol.replace('ROL_', '')}</span>
            </div>
          </div>
          <Button className="logout-btn" variant="ghost" size="sm" onClick={onLogout}>Cerrar sesión</Button>
        </div>
      </header>

      <div className="dash-body">
       <nav className="dash-sidebar">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab-btn ${tab === t.id ? 'tab-btn--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
          {t.icon && <t.icon size={15} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />}
          {t.label}
        </button>
        ))}
      </nav>

        <main className="dash-main">
          {tab === 'hoy'       && <TabHoy               token={token} />}
          {tab === 'consulta'  && <TabConsultaRapida    token={token} />}
          {tab === 'completa'  && <TabConsultaCompleta  token={token} />}
          {tab === 'estado'    && <TabPorEstado         token={token} />}
          {tab === 'crear'     && <TabCrear             token={token} />}
          {tab === 'rut'       && <TabBuscarRut         token={token} />}
          {tab === 'cancelar'  && <TabCancelar          token={token} />}
        </main>
      </div>
    </div>
    <Footer
      logo={logo}
      moduleLinks={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Reportes', href: '/reports' },
        { label: 'Configuración', href: '/settings' },
      ]}
    />
  </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Sucursal() {
  const [token, setToken] = useState(null)

  if (!token) return <LoginScreen onLogin={setToken} />
  return <Dashboard token={token} onLogout={() => setToken(null)} />
}
