import axios from "axios";
import { setupAPIClient } from "../../services/api";
import { AuthContext } from "../../contexts/AuthContext";
import { FiTrash2 } from "react-icons/fi";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/painelheader";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type CarsProps = {
    id: string;
    name: string;
    model_car: string;
    year_car: string;
    km_car: string;
    whatsapp: string;
    city: string;
    price_car: string;
    description_car: string;
    image_car: {
        set: [null]
    }
}

export function Dashboard() {

    const { user } = useContext(AuthContext);

    const [cars, setCars] = useState<CarsProps[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(10);
    const [loadImages, setLoadImages] = useState<string[]>([]);

    const initialFilters = {
        filter: '',
        limit: 10
    };

    const [filters, setFilters] = useState(initialFilters);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadStoreProducts() {

            if (!user?.id) {
                toast.error('Usuário não autenticado!');
                return;
            }

            try {
                const response = await apiClient.get(`/user_cars`, {
                    params: {
                        user_id: user.id,
                        page: currentPage,
                        limit: filters.limit,
                        filter: filters.filter
                    },
                });

                setCars(response?.data?.cars || []);
                setTotalPages(response?.data?.totalPages);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data);
                } else {
                    console.error("Erro desconhecido", error);
                }
            }

        }
        loadStoreProducts();
    }, [currentPage, filters.filter, filters.limit, user?.id]);

    async function loadStoreProducts() {
        const apiClient = setupAPIClient();

        if (!user?.id) {
            toast.error('Usuário não autenticado!');
            return;
        }

        try {
            const response = await apiClient.get(`/user_cars`, {
                params: {
                    user_id: user.id,
                    page: currentPage,
                    limit: filters.limit,
                    filter: filters.filter
                },
            });

            setCars(response?.data?.cars || []);
            setTotalPages(response?.data?.totalPages);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
            } else {
                console.error("Erro desconhecido", error);
            }
        }

    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        const maxPagesToShow = 10;
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = startPage + maxPagesToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`bg-gray-200 border border-gray-300 rounded-[10%] text-gray-800 px-2 py-1 mx-1 cursor-pointer transition-colors duration-300 ${i === currentPage ? 'bg-[rgb(17,192,17)] border-orange-500 text-white cursor-default' : ''}`}
                    disabled={i === currentPage}
                >
                    {i}
                </button>
            );
        }

        return pages;
    };

    const updateFilter = (filter: string, value: string) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [filter]: value,
        }));
    };

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id]);
    }

    async function handleDeleteCar(id: string) {
        const apiClient = setupAPIClient();
        try {
            await apiClient.delete(`/delete_car_user?car_id=${id}`);

            toast.success("Carro deletado com sucesso");

            loadStoreProducts();

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log(error.response?.data);
                toast.error("Ops... erro ao deletar esse carro.")
            } else {
                console.error("Erro desconhecido", error);
            }
        }
    }


    return (
        <Container>

            <DashboardHeader />

            <section className="bg-white p-4 rounded-lg - w-full max-w-3x1 mx-auto flex justify-center items-center gap-2">
                <input
                    className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                    placeholder="Digite o nome do carro..."
                    type="text"
                    value={filters.filter}
                    onChange={(e) => updateFilter('filter', e.target.value)}
                />
            </section>

            <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                {cars.map(car => (
                    <section key={car.id} className="w-full bg-white rounded-lg relative">

                        <button
                            onClick={() => handleDeleteCar(car.id)}
                            className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                            <FiTrash2 size={26} color="#000" />
                        </button>
                        <img
                            className="w-full rounded-lg mb-2 max-h-70"
                            src={"http://localhost:3333/files/" + car.image_car.set[0]}
                            alt="carros"
                            onLoad={() => handleImageLoad(car.id)}
                            style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                        />
                        <p className="font-bold mt-1 px-2 mb-2">{car.name}</p>

                        <div className="flex flex-col px-2">
                            <span className="text-zinc-700">
                                {car.year_car} | {car.km_car} km
                            </span>
                            <strong className="text-black font-bold mt-4">
                                R${car.price_car}
                            </strong>
                        </div>

                        <div className="w-full h-px bg-slate-200 my-2"></div>

                        <div className="px-2 pb-2">
                            <span className="text-black">
                                {car.city}
                            </span>
                        </div>
                    </section>
                ))}
            </main>

            <div className="flex align-middle justify-center mr-10">
                <button className="border-none bg-none cursor-pointer" disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}><FaArrowLeft size={25} /></button>
                {renderPagination()}
                <button className="border-none bg-none cursor-pointer" disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}><FaArrowRight size={25} /></button>
            </div>

            <div className="flex align-middle justify-center">
                Página {currentPage} de {totalPages}
            </div>
        </Container>
    )
}