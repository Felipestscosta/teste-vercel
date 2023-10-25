import { GetServerSideProps } from "next";
import Image from "next/image";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ptBR from "date-fns/locale/pt-BR";
import { prisma } from "@/lib/prisma";
import { format } from 'date-fns'

import ScanCode from "../../components/scancode";

interface serviceProps {
  created_at: string;
  delivery: string;
  value: number;
}

export default function App({ orders }: any) {

  return (
    <>
      {/* <Header Title="Serviços" /> */}
      <main className="flex flex-col relative bg-gray-50 px-4">
        {/* <Link
          className="flex w-fit items-center mx-auto mt-10 mb-10 font-bold text-amber-900 text-lg'"
          href="/service-orders/new"
        >
          Novo Serviço
        </Link> */}

        <div className="flex relative mt-9 mb-16 z-10">
          <input
            className="rounded-full px-16 py-2 w-full outline-none h-14 shadow-lg"
            type="text"
            placeholder="Nome do cliente, Nº serviço..."
          />
          <MagnifyingGlassIcon className="absolute left-6 top-4 h-6 text-gray-400" />
        </div>

        <div className="flex flex-col gap-10">
          {orders.map((order: any, index: number) => {
            const services = JSON.parse(order.services);
            let totalValue = 0;
            services.map((service: serviceProps) => {
              totalValue += service.value
            })

            let formatedValue = totalValue / 100;

            return(
              
              <div key={index} className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-black">
              <Image
                className="object-cover rounded-3xl absolute z-0 opacity-20 blur-sm"
                alt=""
                src={order.featureImage}
                width={450}
                height={170}
              />

              <div className="relative p-10 mx-auto w-full z-2">
                <h3 className="text-zinc-200 font-bold text-3xl mb-6">
                  {order.nome}
                </h3>
                <hr className="mb-4 opacity-30 border-zinc-300"/>
                <div className="flex justify-between">
                  <p className="text-zinc-200 text-2xl">{format(new Date(order.data), 'dd MMM', { locale: ptBR})}</p>
                  <p className="text-zinc-200 text-2xl">{formatedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                </div>
              </div>
            </div>
            )
        })}
        </div>
      </main>
      <ScanCode />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const orders = await prisma.order.findMany({
    include: {
      client: true,
      service: true
    },
  });

  // console.log(orders[0].service);

  const dataOrders = orders.map((order) => {
    return {
      nome: order.client.name,
      data: order.created_at.toISOString(),
      featureImage: order.service[0]?.image ?? "",
      services: JSON.stringify(order.service)
    };
  });

  // console.log(dataOrders)

  // let convert = JSON.parse(dataOrders[0].service);

  

  // console.log("====STRING FY======",typeof JSON.stringify(dataOrders[0].service))
  // console.log("=====PARSE====",typeof JSON.parse(dataOrders[0].service))
  // console.log("==========",typeof JSON.parse(dataOrders[0].service)[0])


  return {
    props: {
      orders: dataOrders,
    },
  };
};
