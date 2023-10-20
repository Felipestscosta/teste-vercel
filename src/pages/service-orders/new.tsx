import Header from "@/components/header";
import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { AdvancedImage } from "@cloudinary/react";
import { Cloudinary } from "@cloudinary/url-gen";
import axios from "axios";
import { CameraIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function New() {
  const [image, setImage] = useState("");
  const [isOpenModal, setIsOpenModal] = useState(false);
  const webcamRef = useRef(null);

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
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }

    setIsOpenModal(false);

    // const response = await fetch(
    //   `https://api.cloudinary.com/v1_1/daruxsllg/upload`,
    //   {
    //     method: "POST",
    //     body: JSON.stringify({
    //       file: imageSrc,
    //       upload_preset: 'kwcppivy'
    //     }),
    //   }
    // );

    // if (response.ok) {
    //   const data = await response.json();
    //   console.log("URL da imagem salva:", data.secure_url);
    // } else {
    //   console.error("Erro ao enviar a imagem para o Cloudinary");
    // }
  };

  return (
    <div>
      <Header Title="Novo serviço"/>

      {/* <h1 className="pt-6 pb-6 mb-16 text-2xl font-bold text-center shadow-lg">
        Novo serviço
      </h1> */}

      <div className="w-full px-8">
        <form action="">
          <div className="flex flex-col mb-12 justify-center items-center">
            <button
              type="button"
              onClick={() => setIsOpenModal(true)}
              className="flex relative overflow-hidden h-48 w-48 justify-center items-center bg-slate-100 mb-20 border-dashed border-2 rounded-full cursor-pointer hover:bg-slate-50"
            >
            <AdvancedImage cldImg={img} className="object-cover rounded-3xl absolute"/>
              <span className="text-slate-300">
                <CameraIcon className="h-12"/>
              </span>
            </button>

            <div className="grid grid-cols-2 gap-8">
              <div>
                <label htmlFor="valor" className="mb-2" tabIndex={0}>
                  Valor
                </label>
                <input
                  className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0"
                  type="text"
                />
              </div>
              <div>
                <label htmlFor="valor" className="mb-2" tabIndex={1}>
                  Quantidade
                </label>
                <input
                  className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950  px-0"
                  type="text"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col mb-12">
            <label htmlFor="valor" className="mb-2">
              Cliente
            </label>
            <input
              className="border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950 px-0"
              type="text"
              tabIndex={2}
            />
          </div>

          <div className="flex flex-col mb-12">
            <label htmlFor="valor" className="mb-2">
              O que vai ser feito?
            </label>
            <textarea
              className="border-t-0 border-l-0 border-r-0 border-b-2 border-gray-950  px-0"
              tabIndex={3}
            />
          </div>
        </form>
      </div>

      <div
        className={`absolute w-full h-full top-0 left-0 bg-gray-950 ${
          isOpenModal === true ? "flex" : "hidden"
        } items-center justify-center`}
      >
        <button
          type="button"
          onClick={() => setIsOpenModal(false)}
          className="absolute border-none right-4 top-4"
        >
          <XMarkIcon className="h-10 text-gray-200"/>
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
          <CameraIcon className="h-12"/>
        </button>
      </div>
    </div>
  );
}
