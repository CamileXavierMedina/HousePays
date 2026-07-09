// guarda a url da api para o front-end saber onde enviar as requisicoes
export const CONFIG = {
    API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5196'
};
