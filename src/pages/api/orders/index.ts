import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { clientId, output } = req.body;

    const orderCount = await prisma.order.count()+1;

    const convertedOutputDate = new Date(output).toISOString()

    const order = await prisma.order.create({
      data: {
        number: orderCount,
        clientId: clientId.toString(),
        active: true,
        output: convertedOutputDate
      },
    });

    return res.status(201).json(order);
  }

  if (req.method === "PUT") {
    const { orderId, active } = req.body;


    await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        active: active
      },
    });

    return res.status(201).json({orderId, active});
  }
}
