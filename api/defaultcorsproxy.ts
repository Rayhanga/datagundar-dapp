
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
          })
          .catch(err => {
            if (!err.response) {
              response.status(504).json({
                message: `Connection timeout with ${site}`,
              })
            } else {
              response.status(err.response.status).json({
                message: err.message,
              })
            }
          });
        response.send(baakProxy);
        break;
      default:
        response.status(403).json({
          message: "Wrong site target",
        })
    }
  } else {
    response.json({
      status: "ok"
    })
  }
}