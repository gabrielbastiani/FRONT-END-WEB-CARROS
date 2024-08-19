import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
        set: string[];
    }
}

export function CarDetail() {

    const { id } = useParams();
    const [car, setCar] = useState<CarProps>();
    const [sliderPerView, setSliderPerView] = useState<number>(2);
    const navigate = useNavigate();

    useEffect(() => {
        const apiClient = setupAPIClient();
        async function loadCar() {
            if (!id) { return }
            try {
                const response = await apiClient.get(`/car_details_home?car_id=${id}`);
                if(!response.data){
                    navigate("/")
                }
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

    }, [id, navigate]);

    useEffect(() => {
        function handleResize(){
            if(window.innerWidth < 720){
                setSliderPerView(1);
            } else {
                setSliderPerView(2);
            }
        }
        handleResize();

        window.addEventListener("resize", handleResize);
        
        return() => {
            window.removeEventListener("resize", handleResize)
        }

    }, []);


    return (
        <Container>

            {car && (
                <Swiper
                    slidesPerView={sliderPerView}
                    pagination={{ clickable: true }}
                    navigation
                >
                    {car?.image_car.set.map((image, index) => (
                        <SwiperSlide key={index}>
                            <img
                                src={"http://localhost:3333/files/" + image}
                                alt="carro"
                                className="w-full h-96 object-cover"
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                        <h1 className="font-bold text-3xl text-black">R$ {car?.price_car}</h1>
                    </div>
                    <p>{car?.model_car}</p>

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
                        href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá vi esse ${car?.name} no site WebCarros e fique interessado!`}
                        target="_blank"
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