// ─── Constantes y utilidades compartidas ────────────────────────────────────

export const ESTADOS = ['CREADO', 'EN_TRANSITO', 'EN_PUERTA', 'DENTRO_DEL_PUERTO', 'FINALIZADO', 'CANCELADO']
export const TIPOS_OP = ['INGRESO_CARGA', 'RETIRO_CARGA', 'DEVOLUCION_VACIO']

export const ESTADO_LABELS = {
  CREADO:            'Creado',
  EN_TRANSITO:       'En Tránsito',
  EN_PUERTA:         'En Puerta',
  DENTRO_DEL_PUERTO: 'Dentro del Puerto',
  FINALIZADO:        'Finalizado',
  CANCELADO:         'Cancelado',
}

export const estadoBadge = (estado) => {
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

export const fmtFecha = (dt) => {
  if (!dt) return '—'
  return new Date(dt).toLocaleString('es-CL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
