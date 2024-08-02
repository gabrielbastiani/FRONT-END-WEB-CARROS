/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext, ReactNode, useState, useEffect } from 'react';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';
import { redirect } from 'react-router-dom';
import { useCookies } from 'react-cookie';

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
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
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {
        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { token } = response.data;

            setCookie('@webcarros.token', token, {
                maxAge: 60 * 60 * 24 * 30,
                path: "/"
            });

            //Passar para proximas requisiçoes o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success('Logado com sucesso!');

        } catch (err) {
            toast.error("Erro ao acessar, confirmou seu cadastro em seu email?");
            /* @ts-ignore */
            toast.error(`${err.response.data.error}`);
            console.log("Erro ao acessar, confirmou seu cadastro em seu email? ", err);
        }
    }

    useEffect(() => {

        let token = cookies['@webcarros.token'];

        if (token) {

            api.get(`/me?user_id=${token}`).then(response => {

                const { id, name, email } = response.data;

                setUser({
                    id,
                    name,
                    email
                })

            });

        }

    }, [cookies]);

    function signOut() {
        try {
            removeCookie('@webcarros.token', { path: '/' });
            toast.success('Usuario deslogado com sucesso!');
            return redirect('/login');
        } catch (error) {
            toast.error("OPS... Erro ao deslogar");
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}