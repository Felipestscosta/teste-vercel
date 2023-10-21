// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {

    const { number } = req.body

    const order = await prisma.order.create

    return res.status(201).json(order);
  }

//   if(req.method === "GET"){
//     const clients = await prisma.client.findMany();

//     return res.status(200).json(clients);
//   }
}
