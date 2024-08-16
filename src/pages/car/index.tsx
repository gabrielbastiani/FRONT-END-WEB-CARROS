import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { setupAPIClient } from "../../services/api";
import axios from "axios";
import { Container } from "../../components/container";
import { FaWhatsapp } from "react-icons/fa";
import { Swiper, SwiperSlide } from 'swiper/react';

interface CarProps {
    id: string;
    name: string;
    model_car: string;
    year_car: string;
    km_car: string;
    whatsapp: string;
    city: string;
    price_car: string;
    description_car: string;
    created_at: string;
    image_car: {
        map(arg0: (image: unknown) => import("react/jsx-runtime").JSX.Element): import("react").ReactNode;
        set: [null]
    }
}

export function CarDetail() {

    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2);

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCar() {
            if (!id) { return }
            try {
                const response = await apiClient.get(`/car_details_home?car_id=${id}`);
                setCar(response?.data || []);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.log(error.response?.data);
                } else {
                    console.error("Erro desconhecido", error);
                }
            }
        }

        loadCar();

    }, [id]);

    return (
        <Container>
            
            <Swiper
                slidesPerView={sliderPerView}
                pagination={{ clickable: true }}
                navigation
            >
                {car?.image_car}
            </Swiper>

            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                        <h1 className="font-bold text-3x1 text-black">R$ {car?.price_car}</h1>
                    </div>
                    <p>{car?.image_car.map(image => (
                        <SwiperSlide>
                            <img
                                src={"http://localhost:3333/files/" + image.set}
                                alt="carros"
                            />
                        </SwiperSlide>
                    ))}</p>

                    <div className="flex w-full gap-6 my-4">
                        <div className="flex flex-col gap-4">
                            <div>
                                <p>Cidade</p>
                                <strong>{car?.city}</strong>
                            </div>
                            <div>
                                <p>Ano</p>
                                <strong>{car?.year_car}</strong>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <p>KM</p>
                                <strong>{car?.km_car}</strong>
                            </div>
                        </div>
                    </div>

                    <strong>Descrição:</strong>
                    <p className="mb-4">{car?.description_car}</p>

                    <strong>Telefone / WhatsApp</strong>
                    <p>{car?.whatsapp}</p>

                    <a
                        className="cursor-pointer bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium"
                    >
                        Conversar com vendedor
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>

                </main>
            )}
        </Container>
    )
}