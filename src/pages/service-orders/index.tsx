import Image from "next/image";

import ScanCode from "../../components/scancode";
import ExemploTenisBranco from "../../assets/tenis-branco.jpg";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function App() {

  return (
    <>
      {/* <Header Title="Serviços" /> */}
      <main className="container mx-auto px-4 relative mt-6">
        {/* <Link
          className="flex w-fit items-center mx-auto mt-10 mb-10 font-bold text-amber-900 text-lg'"
          href="/service-orders/new"
        >
          Novo Serviço
        </Link> */}

        <div className="flex relative w-full mt-9 mb-16">
          <input
            className="bg-zinc-200 rounded-full px-16 py-2 w-full border-none outline-none h-14"
            type="text"
            placeholder="Nome do cliente, Nº serviço..."
          />
          <MagnifyingGlassIcon className="absolute left-6 top-4 h-6 text-gray-400"/>
        </div>

        <div className="flex flex-col gap-10">
          <div className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-zinc-950">
            <Image
              className="object-cover rounded-3xl absolute z-0 opacity-20 blur-sm"
              alt=""
              src={ExemploTenisBranco}
            />

            <div className="relative p-10 mx-auto w-fit z-2">
              <h3 className="text-zinc-200 font-bold text-3xl mb-4 text-center">
                Lucas Rodrigues
              </h3>
              <div className="flex gap-4 justify-center">
                <p className="text-zinc-200 text-2xl font-medium">12/05/23</p>
                <p className="text-zinc-200 text-2xl font-medium">R$48,00</p>
              </div>
            </div>
          </div>

          <div className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-zinc-950">
            <Image
              className="object-cover rounded-3xl absolute z-0 opacity-30"
              alt=""
              src={ExemploTenisBranco}
            />

            <div className="relative p-10 mx-auto w-fit z-2">
              <h3 className="text-zinc-200 font-bold text-3xl mb-4 text-center">
                Lucas Rodrigues
              </h3>
              <div className="flex gap-4 justify-center">
                <p className="text-zinc-200 text-2xl font-medium">12/05/23</p>
                <p className="text-zinc-200 text-2xl font-medium">R$48,00</p>
              </div>
            </div>
          </div>

          <div className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-zinc-950">
            <Image
              className="object-cover rounded-3xl absolute z-0 opacity-30"
              alt=""
              src={ExemploTenisBranco}
            />

            <div className="relative p-10 mx-auto w-fit z-2">
              <h3 className="text-zinc-200 font-bold text-3xl mb-4 text-center">
                Lucas Rodrigues
              </h3>
              <div className="flex gap-4 justify-center">
                <p className="text-zinc-200 text-2xl font-medium">12/05/23</p>
                <p className="text-zinc-200 text-2xl font-medium">R$48,00</p>
              </div>
            </div>
          </div>

          <div className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-zinc-950">
            <Image
              className="object-cover rounded-3xl absolute z-0 opacity-30"
              alt=""
              src={ExemploTenisBranco}
            />

            <div className="relative p-10 mx-auto w-fit z-2">
              <h3 className="text-zinc-200 font-bold text-3xl mb-4 text-center">
                Lucas Rodrigues
              </h3>
              <div className="flex gap-4 justify-center">
                <p className="text-zinc-200 text-2xl font-medium">12/05/23</p>
                <p className="text-zinc-200 text-2xl font-medium">R$48,00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ScanCode />
    </>
  );
}
