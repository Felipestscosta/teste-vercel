import { GetServerSideProps } from "next";
import Image from "next/image";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import ptBR from "date-fns/locale/pt-BR";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

import ScanCode from "../../components/scancode";
import { useRouter } from "next/router";
import { ArrowPathIcon, CircleStackIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface serviceProps {
  created_at: string;
  delivery: string;
  value: number;
}

export interface ordersProps{
  id: string;
  number: number
  nome: string
  phone: string
}

interface arrayOrdersProps{
  orders: Array<ordersProps>
}

export default function App({ orders }: arrayOrdersProps) {
  const router = useRouter();
  const [ filteredOrders, setFilteredOrders ] = useState<ordersProps[]>(orders)
  const [ isLoading, setIsLoading ] = useState(false)
  
  function handleSearch(wordSearch: string){
    setIsLoading(true)

    const ordersFiltered = orders.filter( (order) => {
      console.log("Telefone:", order.phone)
      return order.nome.includes(wordSearch.toLowerCase()) || order.phone.includes(wordSearch)
    })

    setFilteredOrders(ordersFiltered)

    console.log("Todos as ordens: ", ordersFiltered)
    setIsLoading(false)
  }

  return (
    <>
      {/* <Header Title="Serviços" /> */}
      <main className="flex flex-col h-full min-h-screen relative bg-gray-50 px-4">
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
            onChange={(e) => { handleSearch(e.target.value)}}
          />
          <MagnifyingGlassIcon className="absolute left-6 top-4 h-6 text-gray-400" />
        </div>

        <div className="flex flex-col gap-10">
          {
            isLoading ?
            <div className="flex flex-col w-full justify-center items-center text-center gap-6">
              <ArrowPathIcon className="h-32 text-gray-300 animate-spin"/>
              <p className="w-60 text-lg font-medium text-gray-300">Buscando pelo serviço...</p>
            </div>
            :
            filteredOrders.length === 0 ?
              <div className="flex flex-col w-full justify-center items-center text-center gap-6">
                <CircleStackIcon className="h-32 text-gray-300"/>
                <p className="w-60 text-lg font-medium text-gray-300">Não foi encontrado nenhum serviço. <Link className="underline" href={`/service-orders/new`}>Cadastrar</Link></p>
              </div>
              :   
              filteredOrders.map((order: any, index: number) => {
                  const services = JSON.parse(order.services);
                  let totalValue = 0;
                  services.map((service: serviceProps) => {
                    totalValue += service.value;
                  });

                  let formatedValue = totalValue / 100;

                  return (
                    <div
                      key={index}
                      className="flex shadow-2xl relative items-center justify-center rounded-3xl overflow-hidden bg-gradient-to-br from-amber-900 to-black cursor-pointer"
                      onClick={() => {
                        router.push(`/service-orders/${order.id}`);
                      }}
                    >
                      <Image
                        className="object-cover rounded-3xl absolute z-0 opacity-20 blur-sm"
                        alt=""
                        src={order.featureImage}
                        width={450}
                        height={170}
                      />

                      <div className="relative p-10 mx-auto w-full z-2">
                        <h3 className="text-zinc-200 font-bold text-3xl capitalize mb-6">
                          {order.nome}
                        </h3>
                        <hr className="mb-4 opacity-30 border-zinc-300" />
                        <div className="grid grid-cols-2">
                          <p className="text-zinc-200 text-2xl">
                            {format(new Date(order.data), "dd MMM", { locale: ptBR })}
                          </p>
                          <p className="text-zinc-200 text-2xl text-right">
                            {formatedValue.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              
            }
        </div>
      </main>
      <ScanCode />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const orders = await prisma.order.findMany({
    where: { active: true },
    include: {
      client: true,
      service: true,
    },
  });

  const dataOrders = orders.map((order) => {
    return {
      id: order.id,
      nome: order.client.name,
      data: order.output.toISOString(),
      featureImage: order.service[0]?.image ?? "",
      services: JSON.stringify(order.service),
      number: order.number,
      phone: order.client.phone
    };
  });

  return {
    props: {
      orders: dataOrders,
    },
  };
};
