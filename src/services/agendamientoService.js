const BFF_URL = '/api/bff';

const verificarRespuesta = (res) => { //Funcion que recibe respuesta (res) de un fetch y la revisa
    if (res.status === 401) {
        window.location.href = 'http://localhost:5170'; //Redirige al login central
        throw new Error('Sesión expirada'); //Corta la ejecución para que el código que llamó no siga procesando una respuesta vacía
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`); //Cualquier otro error se maneja como antes
    return res; //Si todo está bien, devuelve la respuesta para seguir usandola
}

export const consultaRapida = async (patente) => {
    const res = await fetch(`${BFF_URL}/consulta-rapida/${patente}`, {
        credentials: 'include'
    });
    verificarRespuesta(res); //Usamos la nueva función para revisar la respuesta
    return res.json();
};

export const listarPorEstado = async (estado) => {
    const res = await fetch(`${BFF_URL}/agendamiento/estado/${estado}`, {
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const crearAgendamiento = async (datos) => {
    const res = await fetch(`${BFF_URL}/agendamiento`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(datos)
    });
    verificarRespuesta(res);
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? `HTTP ${res.status}`);
    }
    return res.json();
};

export const cancelarAgendamiento = async (id) => {
    const res = await fetch(`${BFF_URL}/agendamiento/${id}/cancelar`, {
        method: 'PUT',
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const consultaCompleta = async (patente) => {
    const res = await fetch(`${BFF_URL}/consulta-completa/${patente}`, {
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const buscarPorRutChofer = async (rut) => {
    const res = await fetch(`${BFF_URL}/agendamiento/rut/${rut}`, {
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const listarPorFechas = async (inicio, fin) => {
    const res = await fetch(`${BFF_URL}/agendamientos/fechas?inicio=${inicio}&fin=${fin}`, {
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const getUsuarioActual = async () => {
    const res = await fetch('/api/auth/me', {
        credentials: 'include'
    });
    verificarRespuesta(res);
    return res.json();
};

export const logout = async () => { //Crea funcion logout para cerrar sesion, export para usarla en otros archivos, async porque hace una llamada de red(espera respuesta)
    await fetch('/api/auth/logout', {  //Llama al backend / await pausa hasta que responda / La ruta pertenece el servicio Usuarios(vía proxy de Vite)
        method: 'POST',  
        credentials: 'include' //Envía la cookie httpOnly al servidor, sin esto el backend no sabría qué sesión cerrar.
    })
}