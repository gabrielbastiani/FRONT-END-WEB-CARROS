import axios from 'axios';
import Cookies from 'universal-cookie';
import { toast } from 'react-toastify';

function signOut() {
    try {
        const remove_cookie_user = new Cookies();
        remove_cookie_user.remove('@webcarros.token', { path: '/' });
        toast.success('Usuario deslogado com sucesso!');
    } catch (error) {
        toast.error("OPS... Erro ao deslogar");
    }
}

export function setupAPIClient() {

    const cookie_user = new Cookies();
    const cookies = cookie_user.get('@webcarros.token');

    const api = axios.create({
        baseURL: 'http://localhost:3333',
        headers: {
            Authorization: `Bearer ${cookies}`
        }
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                signOut();
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }
    );

    return api;

}