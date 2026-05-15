const BFF_URL = '/api/bff';

const getHeaders = (token) => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
});
 
export const consultaRapida = async (patente, token) => {
    const res = await fetch(`${BFF_URL}/consulta-rapida/${patente}`, {
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};
 
export const listarPorEstado = async (estado, token) => {
    const res = await fetch(`${BFF_URL}/agendamiento/estado/${estado}`, {
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};
 
export const crearAgendamiento = async (datos, token) => {
    const res = await fetch(`${BFF_URL}/agendamiento`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(datos)
    });
    if (!res.ok){
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error ?? `HTTP ${res.status}`)
    }
    return res.json();
};
 
export const cancelarAgendamiento = async (id, token) => {
    const res = await fetch(`${BFF_URL}/agendamiento/${id}/cancelar`, {
        method: 'PUT',
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const consultaCompleta = async (patente, token) => {
    const res = await fetch(`${BFF_URL}/consulta-completa/${patente}`, {
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const buscarPorRutChofer = async (rut, token) => {
    const res = await fetch(`${BFF_URL}/agendamiento/rut/${rut}`, {
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

export const listarPorFechas = async (inicio, fin, token) => {
    const res = await fetch(`${BFF_URL}/agendamientos/fechas?inicio=${inicio}&fin=${fin}`, {
        headers: getHeaders(token)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
};

//LOGIN / REGISTRO

const AUTH_URL = ' ';

export const login = async (email, password) => {
    const res = await fetch(`${AUTH_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    return res.json(); // { token: "..." }
};

export const registrar = async (datos) => {
    const res = await fetch(`${AUTH_URL}/api/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text ?? `HTTP ${res.status}`);
    }
    return res.json();
};
