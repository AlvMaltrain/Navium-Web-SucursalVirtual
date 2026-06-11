import logo from '/src/assets/navium-v1.png'

function Footer({ moduleLinks }) {
  const links = moduleLinks?.length ? moduleLinks : [
    { label: 'Dashboard',     href: '/dashboard' },
    { label: 'Reportes',      href: '/reports'   },
    { label: 'Configuración', href: '/settings'  },
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

export default Footer
