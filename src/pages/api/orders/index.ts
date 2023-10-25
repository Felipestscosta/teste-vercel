import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { clientId } = req.body;

    const orderCount = await prisma.order.count()+1;

    const order = await prisma.order.create({
      data: {
        number: orderCount,
        clientId: clientId.toString(),
        active: true
      },
    });

    return res.status(201).json(order);
  }
}
