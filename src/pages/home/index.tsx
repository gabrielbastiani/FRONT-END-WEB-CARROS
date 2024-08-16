import { useEffect, useState } from "react";
import { Container } from "../../components/container";
import { setupAPIClient } from "../../services/api";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import axios from "axios";

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

export function Home() {

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
            try {
                const response = await apiClient.get(`/list_all_cars_home`, {
                    params: {
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
    }, [currentPage, filters.filter, filters.limit]);

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


    return (
        <Container>
            <section className="bg-white p-4 rounded-lg - w-full max-w-3x1 mx-auto flex justify-center items-center gap-2">
                <input
                    className="w-full border-2 rounded-lg h-9 px-3 outline-none"
                    placeholder="Digite o nome do carro..."
                    type="text"
                    value={filters.filter}
                    onChange={(e) => updateFilter('filter', e.target.value)}
                />
            </section>

            <h1 className="font-bold text-center mt-6 text-2x1 mb-4">
                Carros novos e usados em todo o Brasil
            </h1>

            <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cars.map(car => (
                    <Link key={car.id} to={`/car/${car.id}`}>
                        <section className="w-full bg-white rounded-lg">
                            <div
                                className="w-full h-72 rounded-lg bg-slate-200"
                                style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
                            ></div>
                            <img
                                className="w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all"
                                src={"http://localhost:3333/files/" + car.image_car.set[0]}
                                alt="carro"
                                onLoad={() => handleImageLoad(car.id)}
                                style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                            />
                            <p className="font-bold mt-1 mb-2 px-2">{car.name}</p>

                            <div className="flex flex-col px-2">
                                <span className="text-zinc-700 mb-6">Ano {car.year_car} | {car.km_car} Km</span>
                                <strong className="text-black font-medium text-xl">R${car.price_car}</strong>
                            </div>

                            <div className="w-full h-px bg-slate-200 my-2"></div>

                            <div className="px-2 pb-2">
                                <span className="text-black">
                                    {car.city}
                                </span>
                            </div>
                        </section>
                    </Link>
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