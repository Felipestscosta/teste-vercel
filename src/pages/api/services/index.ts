import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest,res: NextApiResponse) {

  const { value, amount, delivery, description, orderId, image } = req.body;  
    
  if (req.method === "POST") {

    const convertedValue = Number(value.replace(/[^0-9]/g, ''));
    const convertedAmount = Number(amount);
    const convertedDeliveryDate = new Date(delivery).toISOString()

    const service = await prisma.service.create({
      data: {
        value: convertedValue,
        amount: convertedAmount,
        delivery: convertedDeliveryDate,
        description,
        image,
        orderId: orderId
      },
    });

    return res.status(201).json(service);
  }
}
