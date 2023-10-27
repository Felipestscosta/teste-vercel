import Header from "@/components/header";
import { api } from "@/lib/axios";
import { prisma } from "@/lib/prisma";
import {
  ArrowPathIcon,
  BanknotesIcon,
  CalendarIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

interface serviceProp {
  value: number;
  description: string;
  image: string;
  amount: number;
}

export default function ServiceOrdersDetails({ order, services }: any) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const orderFormated = JSON.parse(order);
  let totalValue = 0;
  services.map((service: serviceProp) => {
    return (totalValue += service.value);
  });
  const totalValueFormated = totalValue / 100;

  async function handleFinishOrder() {
    setIsLoading(true);

    await api
      .put("/orders", { orderId: orderFormated.id, active: false })
      .then((data) => {
        router.push("/");
        setIsLoading(false);
      });
  }

  return (
    <div className="h-full bg-gray-100 pb-16">
      <Header Title={orderFormated.client.name} />
      <div className="flex flex-col px-8 pt-28">
        <div className="grid grid-cols-2 gap-4 mb-16">
          <div className="flex relative gap-4 items-center justify-center text-center p-2 py-6 shadow-2xl rounded-lg bg-white">
            <div className="absolute -top-6 p-3 bg-gray-800 rounded-full">
              <CalendarIcon className="h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <h3>
                {format(
                  new Date(orderFormated.created_at),
                  "dd / MMM",
                  {
                    locale: ptBR,
                  }
                )}
              </h3>
              <h3 className="text-lg font-extrabold">
                {format(new Date(orderFormated.output), "dd / MMM", {
                  locale: ptBR,
                })}
              </h3>
            </div>
          </div>

          <div className="flex relative gap-4 items-center justify-center p-2 py-6 pr-8 pl-8 shadow-2xl rounded-lg bg-white">
            <div className="absolute -top-6  p-3 bg-gray-800 rounded-full">
              <BanknotesIcon className="h-5 text-white" />
            </div>
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-extrabold">
              {totalValueFormated.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </h3>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <button
            type="button"
            className="flex text-2xl font-extrabold hover:underline"
            onClick={handleFinishOrder}
            disabled={isLoading ? true : false}
          >
            {isLoading ? (
              <ArrowPathIcon className="h-6 animate-spin" />
            ) : (
              "Finalizar entrega"
            )}
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {services.map((service: serviceProp, index: number) => {
            let formatedIndividualValue = service.value / 100;
            return (
              <div
                className="flex flex-col relative text-center bg-white rounded-lg shadow-xl mb-12"
                key={index}
              >
                <Image
                  className="h-80 rounded-t-lg"
                  width={500}
                  height={500}
                  style={{ objectFit: "cover" }}
                  src={service.image}
                  alt=""
                />
                <div className="flex flex-col gap-4 bg-gradient-to-br bg-white p-8 rounded-b-lg">
                  <span className="flex absolute h-12 w-12 -top-5 -right-2 justify-center items-center bg-red-700 text-white font-bold p-3 rounded-full">
                    {service.amount}
                  </span>
                  <p className="text-lg text-gray-800">{service.description}</p>
                  <p className="text-2xl text-gray-800 font-bold">
                    {formatedIndividualValue.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context: {
  params: { orderId: string };
}) => {
  const orderId = context.params.orderId;

  const services = await prisma.service.findMany({
    where: {
      orderId: orderId,
    },
  });

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      client: true,
    },
  });

  const dataServices = services.map((service) => {
    return {
      description: service.description,
      value: service.value,
      image: service.image,
      amount: service.amount,
    };
  });

  return {
    props: {
      services: dataServices,
      order: JSON.stringify(order),
    },
  };
};
