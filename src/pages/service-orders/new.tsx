import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import { CameraIcon, PlusIcon } from "@heroicons/react/24/outline";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { SubmitHandler, useForm } from "react-hook-form";

import axios, { all } from "axios";

import Header from "@/components/header";
import { InputMask } from "@react-input/mask";
import { InputNumberFormat } from "@react-input/number-format";
import { api } from "@/lib/axios";
import Link from "next/link";

interface ClientProps {
  id: string;
  name: string;
  phone: string;
}

interface FormData {
  name: string;
  phone: string;

  value: number;
  amount: number;
  delivery: Date;
  description: string;
}

export default function New() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState("");
  const [urlImage, setUrlImage] = useState("")
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [showFormClient, setShowFormClient] = useState(true);
  const [allClients, setAllClients] = useState([]);
  const [findedClient, setFindedClient] = useState<ClientProps[]>([]);
  const [nameField, setNameField] = useState("");
  const [orderId, setOrderId] = useState();
  const [clientId, setClientId] = useState("");

  const { register, handleSubmit, reset } = useForm();
  const chooseClient: SubmitHandler<any> = async (data: FormData) => {
    if (findedClient.length === 0) {
      try {
        const client = await api.post("/clients", {
          name: data.name,
          phone: data.phone,
        });

        await api.post("/orders", { clientId: client.data.id }).then((data) => setOrderId(data.data.id));

        setShowFormClient(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      setShowFormClient(false);
    }
  };

  const saveService: SubmitHandler<any> = async (data: FormData) => {
    await api.post("/services", {
      value: data.value,
      amount: data.amount,
      delivery: data.delivery,
      description: data.description,
      orderId: orderId,
      image: urlImage,
    });

    reset({
      value: "",
      amount: "",
      delivery: "",
      description: ""
    })
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "environment",
  };

  const myCld = new Cloudinary({
    cloud: {
      cloudName: "daruxsllg",
    },
  });

  let img = myCld.image(image);

  const captureImage = async () => {
    //@ts-ignore
    const imageSrc = webcamRef.current.getScreenshot();

    // Enviar a imagem para o Cloudinary
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/daruxsllg/upload",
        {
          file: imageSrc,
          upload_preset: "ml_default",
        }
      );

      setImage(response.data.public_id);
      setUrlImage(response.data.url);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    setIsOpenModal(false);
  };

  const handleFindClient = (data: string) => {
    // @ts-ignore
    const clients = allClients.data;

    const findedClients = clients.filter(
      (client: ClientProps) => client.phone === data
    );

    if (findedClients.length === 1) {
      setFindedClient(
        clients.filter((client: ClientProps) => client.phone === data)
      );
    } else {
      setFindedClient([]);
      setNameField("");
    }
  };

  const handleConfirmClient = async () => {
    const clientId = findedClient[0].id;

    setNameField(findedClient[0].name);
    setClientId(findedClient[0].id);
    await api.post("/orders", { clientId: clientId }).then((data) => setOrderId(data.data.id));
  };

  useEffect(() => {
    // @ts-ignore
    api.get("/clients").then((data) => setAllClients(data));
  }, [findedClient, orderId]);

  return (
    <div>
      <Header Title="Novo serviço" />
      <div className="w-full px-8 pt-32 pb-10">
        <form
          className={showFormClient ? "flex flex-col" : "hidden"}
          onSubmit={handleSubmit(chooseClient)}
        >
          <div className="flex flex-col mb-12">
            <label htmlFor="valor" className="font-bold" tabIndex={1}>
              Celular
            </label>
            <InputMask
              className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3 mb-12"
              mask="(__) _____-____"
              replacement={{ _: /\d/ }}
              tabIndex={1}
              {...register("phone")}
              onChange={(e) => {
                e.target.value.length >= 15 && handleFindClient(e.target.value);
              }}
              required
            />

            <div
              className={`justify-between items-center mb-9 bg-amber-950 text-white p-6 rounded-2xl shadow-lg ${
                findedClient.length !== 0 && nameField.length === 0
                  ? "flex"
                  : "hidden"
              }`}
            >
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-bold" title={findedClient[0]?.name}>
                  {findedClient[0]?.name.length > 20
                    ? `${findedClient[0].name.slice(0, 20)}...`
                    : findedClient[0]?.name}
                </h3>
                <p className="flex items-center gap-2">
                  {findedClient[0]?.phone}
                </p>
              </div>
              <div>
                <button
                  type="button"
                  className="flex items-center justify-center bg-white shadow-2xl rounded-full p-4"
                  onClick={handleConfirmClient}
                >
                  <CheckIcon className="h-11 text-gray-950" />
                </button>
              </div>
            </div>

            <label htmlFor="valor" className="text-left font-bold">
              Nome do Cliente
            </label>
            <input
              className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3"
              type="text"
              tabIndex={2}
              {...register("name")}
              defaultValue={nameField}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              className="flex gap-2 justify-center font-black shadow-lg rounded-full p-4"
              disabled={
                findedClient.length !== 0 && nameField.length === 0
                  ? true
                  : false
              }
            >
              <ArrowRightIcon className="h-8" />
            </button>
          </div>
        </form>

        {/* Formulário do serviço */}
        <form
          action=""
          className={showFormClient ? "hidden" : "flex flex-col"}
          onSubmit={handleSubmit(saveService)}
        >
          <div className="flex flex-col mb-12 justify-center items-center">
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className="flex relative overflow-hidden h-48 w-48 justify-center items-center bg-slate-100 mb-20 border-dashed border-2 rounded-full cursor-pointer hover:bg-slate-50"
            >
              <AdvancedImage
                cldImg={img}
                className="object-cover rounded-3xl absolute"
              />
              <span className="text-slate-300">
                <CameraIcon className="h-12" />
              </span>
            </button>

            <div className="grid grid-cols-3 gap-8">
              <div>
                <label htmlFor="valor" className="font-bold" tabIndex={0}>
                  Valor
                </label>
                <InputNumberFormat
                  className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3"
                  locales="pt-BR"
                  format="currency"
                  currency="BRL"
                  {...register("value")}
                />
              </div>
              <div>
                <label htmlFor="valor" className="font-bold" tabIndex={1}>
                  Quantidade
                </label>
                <input
                  className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3"
                  type="number"
                  min={1}
                  {...register("amount")}
                />
              </div>
              <div>
                <label htmlFor="delivery" className="font-bold" tabIndex={2}>
                  Entrega
                </label>
                <input
                  className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3"
                  type="date"
                  {...register("delivery")}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-12">
            <label htmlFor="description" className="font-bold">
              O que vai ser feito?
            </label>
            <textarea
              className="border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0 py-3"
              tabIndex={3}
              placeholder="Ex: Colar e costurar solado..."
              {...register("description")}
            />
          </div>

          <div className="flex justify-between mt-9">
            {/* <button
              onClick={() => setShowFormClient(true)}
              className="flex gap-2 justify-center shadow-lg rounded-full p-4"
              type="button"
            >
              <ArrowLeftIcon className="h-8" />
            </button> */}

            <button
              className="flex gap-2 justify-center shadow-lg rounded-full p-4"
            >
              <PlusIcon className="h-8" />
            </button>

            <Link
              href="/"
              className="flex gap-2 justify-center shadow-lg rounded-full p-4 bg-green-500 text-gray-100"
              type="button"
            >
              <CheckIcon className="h-8" />
            </Link>
          </div>
        </form>
      </div>

      {/* Modal da câmera */}
      <div
        className={`fixed w-full h-full top-0 left-0 bg-gray-950 ${
          isOpenModal === true ? "flex" : "hidden"
        } items-center justify-center z-20`}
      >
        <button
          type="button"
          onClick={() => setIsOpenModal(false)}
          className="absolute border-none right-4 top-4"
        >
          <XMarkIcon className="h-10 text-gray-200" />
        </button>

        <Webcam
          audio={false}
          ref={webcamRef}
          videoConstraints={videoConstraints}
        />

        <button
          onClick={captureImage}
          className="absolute bottom-12 border-solid bg-gray-300 border-2 p-6 rounded-full"
        >
          <CameraIcon className="h-12" />
        </button>
      </div>
    </div>
  );
}
