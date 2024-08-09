/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, useNavigate } from 'react-router-dom'
import logoImg from '../../assets/logo.svg'
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'

const schema = z.object({
    email: z.string().email("Insira um email válido").nonempty("O campo email é obrigatório"),
    password: z.string().nonempty("O campo senha é obrigatório")
})

type FormData = z.infer<typeof schema>

export function Login() {

    const navigate = useNavigate();
    const { signIn } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    async function onSubmit(data: FormData) {
        const email = data?.email;
        const password = data?.password;
        try {
            let dataUser = {
                email,
                password
            };

            const success = await signIn(dataUser);
            
            if (success) {
                navigate('/dashboard', { replace: true });
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Container>
            <div className='w-full min-h-screen flex justify-center items-center flex-col gap-4'>
                <Link to="/" className='mb-6 max-w-sm w-full'>
                    <img
                        src={logoImg}
                        alt='logo-do-site'
                        className='w-full'
                    />
                </Link>

                <form
                    className='bg-white max-w-xl w-full rounded-lg p-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className='mb-3'>
                        <Input
                            type="email"
                            placeholder="Digite seu email..."
                            name="email"
                            error={errors.email?.message}
                            register={register}
                        />
                    </div>

                    <div className='mb-3'>
                        <Input
                            type="password"
                            placeholder="Digite sua senha..."
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />
                    </div>

                    <button
                        type='submit'
                        className='bg-black w-full rounded-md text-white h-10 font-medium'
                    >
                        Acessar
                    </button>
                </form>

                <Link to="/register">
                    Ainda não possui uma conta? Cadastre-se
                </Link>

            </div>
        </Container>
    )
}