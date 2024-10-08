/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';
import { useCookies } from 'react-cookie';

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    loadingAuth?: boolean;
    signIn: (credentials: SignInProps) => Promise<boolean>;
    signOut: () => void;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {

    const [cookies, setCookie, removeCookie] = useCookies(['@webcarros.token']);
    const [cookiesId, setCookieId, removeCookieId] = useCookies(['@idUser']);
    const [user, setUser] = useState<UserProps>();
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const isAuthenticated = !!user;


    async function signIn({ email, password }: SignInProps): Promise<boolean> {
        setLoadingAuth(true);
        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, token } = response.data;

            setCookie('@webcarros.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });

            setCookieId('@idUser', id, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });

            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso!');

            setUser({ id, name: response.data.name, email });

            return true;

        } catch (err) {
            toast.error("Erro ao acessar, confirmou seu cadastro em seu email?");
            /* @ts-ignore */
            toast.error(`${err.response.data.error}`);
            console.log("Erro ao acessar, confirmou seu cadastro em seu email? ", err);
            return false;
        } finally {
            setLoadingAuth(false);
        }
    }

    useEffect(() => {
        let token = cookies['@webcarros.token'];
        let userid = cookiesId['@idUser'];

        async function loadUserData() {
            if (token) {
                try {
                    const response = await api.get(`/me?user_id=${userid}`);

                    const { id, name, email } = response.data;

                    setUser({
                        id,
                        name,
                        email
                    });

                } catch (error) {
                    console.error("Erro ao carregar dados do usuário: ", error);
                }
            }

            setLoadingAuth(false);
        }

        loadUserData();
    }, [cookies, cookiesId]);

    function signOut() {
        try {
            removeCookie('@webcarros.token', { path: '/' });
            removeCookieId('@idUser', { path: '/' });
            setUser(undefined);
            toast.success('Usuário deslogado com sucesso!');
        } catch (error) {
            toast.error("OPS... Erro ao deslogar");
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loadingAuth, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}