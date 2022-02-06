
import type { VercelRequest, VercelResponse } from '@vercel/node';
import axios from "axios"

const baakInstance = axios.create({
  baseURL: "https://baak.gunadarma.ac.id",
});

export default async (request: VercelRequest, response: VercelResponse) => {
  const { site, url } = request.query;
  if (site && url) {
    switch (site) {
      case "baak":
        const baakProxy = await baakInstance
          .get(url as string)
          .then((res) => {
            return res.data;
          });
        response.send(baakProxy);
        break;
      default:
        throw new Error("Wrong site target")
    }
  } else {
    return response.json({
      status: "ok"
    })
  }
}