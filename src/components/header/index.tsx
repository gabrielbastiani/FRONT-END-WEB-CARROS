import logoImg from '../../assets/logo.svg';
import { Link } from 'react-router-dom';
import { FiUser, FiLogIn } from 'react-icons/fi'
import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

export function Header() {

    const { isAuthenticated, loadingAuth } = useContext(AuthContext);

    return (
        <div className='w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4'>
            <header className='flex w-full max-w-7x1 items-center justify-between px-4 mx-auto'>
                <Link to="/">
                    <img
                        src={logoImg}
                        alt='logo do site'
                    />
                </Link>

                {!loadingAuth && isAuthenticated && (
                    <Link to="/dashboard">
                        <div className='border-2 rounded-full p-1 border-gray-900'>
                            <FiUser cursor="pointer" size={24} color="#000" />
                        </div>
                    </Link>
                )}

                {!loadingAuth && !isAuthenticated && (
                    <Link to="/login">
                        <div className="border-2 rounded-full p-1 border-gray-900">
                            <FiLogIn size={22} color="#000" />
                        </div>
                    </Link>
                )}
            </header>
        </div>
    )
}