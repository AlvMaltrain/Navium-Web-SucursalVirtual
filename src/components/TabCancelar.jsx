import { useState } from 'react'
import { Button } from 'navium-ui-lib'
import { cancelarAgendamiento } from '../services/agendamientoService'

function TabCancelar() {
  const [id, setId]               = useState('')
  const [ok, setOk]               = useState(false)
  const [error, setError]         = useState('')
  const [cargando, setCargando]   = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  const cancelar = async () => {
    if (!id.trim()) { setError('Ingresa el ID del agendamiento'); return }
    setCargando(true); setError(''); setOk(false)
    try {
      await cancelarAgendamiento(id.trim())
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

export default TabCancelar
