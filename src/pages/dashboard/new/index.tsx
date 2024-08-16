import { ChangeEvent, useContext, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { FiTrash, FiUpload } from "react-icons/fi";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/painelheader";
import { useForm } from "react-hook-form";
import { Input } from "../../../components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import { setupAPIClient } from "../../../services/api";

const schema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O Ano do carro é obrigatório"),
    km: z.string().nonempty("O KM do carro é obrigatório"),
    price: z.string().nonempty("O preço é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatória"),
    whatsapp: z.string().min(1, "O Telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Numero de telefone invalido."
    }),
    description: z.string().nonempty("A descrição é obrigatória")
})

type FormData = z.infer<typeof schema>;

export function New() {

    const { user } = useContext(AuthContext);

    const [productPhotos, setProductPhotos] = useState<File[]>([]);
    const [photoInsertUrl, setPhotoInsertUrl] = useState<string[]>([]);

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    });

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            const validFiles = selectedFiles.filter(file =>
                file.type === 'image/jpeg' || file.type === 'image/png'
            );

            if (validFiles.length === 0) {
                toast.error("Envie imagens no formato JPEG ou PNG!");
                return;
            }

            setProductPhotos(validFiles);
            setPhotoInsertUrl(validFiles.map(file => URL.createObjectURL(file)));
        }
    }

    async function onSubmit(date: FormData) {

        if (!user?.id) {
            toast.error('Usuário não autenticado!');
            return;
        }

        if (productPhotos.length === 0) {
            toast.error('Carregue pelo menos uma imagem!');
            console.log("Carregue pelo menos uma imagem!");
            return;
        }

        if (productPhotos.length > 15) {
            toast.error('É possivel cadastrar no máximo 15 imagens por carro');
            console.log("É possivel cadastrar no máximo 15 imagens por carro");
            return;
        }

        try {
            const formData = new FormData();

            productPhotos.forEach(photo => {
                formData.append('files', photo);
            });

            formData.append('user_id', user.id);
            formData.append('name', date?.name);
            formData.append('model_car', date?.model);
            formData.append('year_car', date?.year);
            formData.append('km_car', date?.km);
            formData.append('whatsapp', date?.whatsapp);
            formData.append('city', date?.city);
            formData.append('price_car', date?.price);
            formData.append('description_car', date?.description);

            const apiClient = setupAPIClient();
            await apiClient.post(`/create_car`, formData);

            toast.success('Carro cadastrado com sucesso!!!');

            reset();
            setProductPhotos([]);
            setPhotoInsertUrl([]);

        } catch (err) {
            if (err instanceof Error) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                console.log((err as any).response?.data);
                toast.error('Ops erro ao cadastrar carro!');
            } else {
                console.error("Erro desconhecido", err);
                toast.error('Erro desconhecido ao cadastrar carro!');
            }
        }
    }

    function handleDeleteImage(url: string) {
        const index = photoInsertUrl.indexOf(url);
        if (index !== -1) {
            const updatedPhotos = [...productPhotos];
            const updatedUrls = [...photoInsertUrl];

            updatedPhotos.splice(index, 1);
            updatedUrls.splice(index, 1);

            setProductPhotos(updatedPhotos);
            setPhotoInsertUrl(updatedUrls);
        }
    }



    return (
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="opacity-0 curso"
                            onChange={handleFile}
                        />
                    </div>
                </button>

                {photoInsertUrl && photoInsertUrl.map((url, index) => (
                    <div key={index} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(url)}>
                            <FiTrash size={28} color="#FFF" />
                        </button>
                        <img
                            src={url}
                            alt="Preview"
                            className="rounded-lg w-full h-32 object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="name"
                            error={errors.name?.message}
                            placeholder="Ex: Onix 1.0..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
                        <Input
                            type="text"
                            register={register}
                            name="model"
                            error={errors.model?.message}
                            placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                        />
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano do carro</p>
                            <Input
                                type="text"
                                register={register}
                                name="year"
                                error={errors.year?.message}
                                placeholder="Ex: 2016/2016..."
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodados</p>
                            <Input
                                type="text"
                                register={register}
                                name="km"
                                error={errors.km?.message}
                                placeholder="Ex: 23.000..."
                            />
                        </div>
                    </div>

                    <div className="flex w-full mb-3 flex-row items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / WhatsApp</p>
                            <Input
                                type="text"
                                register={register}
                                name="whatsapp"
                                error={errors.whatsapp?.message}
                                placeholder="Ex: 054991558966..."
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                register={register}
                                name="city"
                                error={errors.city?.message}
                                placeholder="Ex: Caxias do Sul - RS..."
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            register={register}
                            name="price"
                            error={errors.price?.message}
                            placeholder="Ex: 69.000..."
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 w-full rounded-md h24 px-2"
                            {...register("description")}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro..."
                        />
                        {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
                    </div>

                    <button type="submit" className="w-full rounded-md bg-zinc-900 text-white font-medium h-10">
                        Cadastrar
                    </button>
                </form>
            </div>
        </Container>
    )
}