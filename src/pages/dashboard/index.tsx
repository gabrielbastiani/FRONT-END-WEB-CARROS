import { FiTrash2 } from "react-icons/fi";
import { Container } from "../../components/container";
import { DashboardHeader } from "../../components/painelheader";

export function Dashboard() {
    return (
        <Container>
            <DashboardHeader />

            <main className="grid gird-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                <section className="w-full bg-white rounded-lg relative">

                    <button
                        onClick={ () => {} }
                        className="absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow">
                        <FiTrash2 size={26} color="#000" />
                    </button>
                    <img
                        className="w-full rounded-lg mb-2 max-h-70"
                        src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2024/202407/20240730/bmw-x4-3-0-twinpower-gasolina-m40i-steptronic-wmimagem20424796540.webp?s=fill&w=249&h=186&q=70"
                    />
                    <p className="font-bold mt-1 px-2 mb-2">NISSAN VERSA</p>

                    <div className="flex flex-col px-2">
                        <span className="text-zinc-700">
                            Ano 2016 | 230.000 km
                        </span>
                        <strong className="text-black font-bold mt-4">
                            R$150.000
                        </strong>
                    </div>

                    <div className="w-full h-px bg-slate-200 my-2"></div>

                    <div className="px-2 pb-2">
                        <span className="text-black">
                            Caxias do Sul - RS
                        </span>
                    </div>
                </section>

            </main>
        </Container>
    )
}