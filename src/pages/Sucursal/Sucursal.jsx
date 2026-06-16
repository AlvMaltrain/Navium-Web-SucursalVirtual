import { useState, useEffect } from 'react'
import { Button } from 'navium-ui-lib'
import { getUsuarioActual, logout } from '../../services/agendamientoService'
import { CalendarCheck2, FastForward, ClipboardCheck, ChartColumn, Fingerprint, Plus, Ban } from 'lucide-react'
import './Sucursal.css'
import 'navium-ui-lib/dist/navium-ui-lib.cjs.css'
import logo from '/src/assets/navium-v1.png'

import Footer              from '../../components/Footer'
import TabHoy              from '../../components/TabHoy'
import TabConsultaRapida   from '../../components/TabConsultaRapida'
import TabConsultaCompleta from '../../components/TabConsultaCompleta'
import TabPorEstado        from '../../components/TabPorEstado'
import TabCrear            from '../../components/TabCrear'
import TabBuscarRut        from '../../components/TabBuscarRut'
import TabCancelar         from '../../components/TabCancelar'

// ─── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 'hoy',      label: 'Hoy',               icon: CalendarCheck2  },
  { id: 'consulta', label: 'Consulta Rápida',   icon: FastForward     },
  { id: 'completa', label: 'Consulta Completa', icon: ClipboardCheck  },
  { id: 'estado',   label: 'Por Estado',        icon: ChartColumn     },
  { id: 'rut',      label: 'Por RUT Chofer',    icon: Fingerprint     },
  { id: 'crear',    label: 'Nuevo',             icon: Plus            },
  { id: 'cancelar', label: 'Cancelar',          icon: Ban             },
]

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ onLogout }) {
  const [tab, setTab]         = useState('hoy')
  const [usuario, setUsuario] = useState({ email: '', rol: '' })

  useEffect(() => {
    getUsuarioActual()
      .then(data => setUsuario({ email: data.email ?? data.sub ?? '', rol: data.rol ?? '' }))
      .catch(() => {})
  }, [])

  const inicial = usuario.email.charAt(0).toUpperCase() || '?'

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
                <span className="user-email">{usuario.email}</span>
                <span className="user-rol">{usuario.rol.replace('ROL_', '')}</span>
              </div>
            </div>
            <Button className="logout-btn" variant="ghost" size="sm" onClick={onLogout}>
              Cerrar sesión
            </Button>
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
            {tab === 'hoy'       && <TabHoy />}
            {tab === 'consulta'  && <TabConsultaRapida />}
            {tab === 'completa'  && <TabConsultaCompleta />}
            {tab === 'estado'    && <TabPorEstado />}
            {tab === 'crear'     && <TabCrear />}
            {tab === 'rut'       && <TabBuscarRut />}
            {tab === 'cancelar'  && <TabCancelar />}
          </main>
        </div>
      </div>

      <Footer
        moduleLinks={[
          { label: 'Dashboard',     href: '/dashboard' },
          { label: 'Reportes',      href: '/reports'   },
          { label: 'Configuración', href: '/settings'  },
        ]}
      />
    </>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────

export default function Sucursal() {
  const handleLogout = async () => { //Definimos una funcion para el cierre de sesion, async porque hace una llamada de red(espera respuesta)
    await logout() //Llama al backend para borrar la cookie de sesión, si no se borra el backend seguiría reconociendo al usuario como autenticado.
    window.location.href = 'http://localhost:5170'//Redirige al login central una vez cerrada la sesion
  }
  return <Dashboard onLogout={handleLogout} />
}
