
import type { VercelRequest, VercelResponse } from '@vercel/node';
import FormData from 'form-data';
import axios from "axios"

const baakInstance = axios.create({
  baseURL: "https://baak.gunadarma.ac.id",
});
const sapInstance = axios.create({
  baseURL: "https://sap.gunadarma.ac.id",
});
const staffSiteInstance = axios.create({
  baseURL: "http://staffsite.gunadarma.ac.id",
});

export default async (request: VercelRequest, response: VercelResponse) => {
  let { site, url } = request.query;
  if (!url) {
    url = request.body.url
  }
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
      case "sap":
        const sapProxy = await sapInstance
          .get(url as string, { withCredentials: true })
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
        response.send(sapProxy);
        break;
      case "staffsite":
        // const { namanya } = request.body
        // const formData = new FormData()
        // formData.append("namanya", namanya)

        // TODO: replicate PHP form submit or something like that
        // Use index2.php if it still doesn't work

        const staffSiteProxy = await staffSiteInstance
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
          // .post(url as string, formData, {
          //   headers: {
          //     "Host": "staffsite.gunadarma.ac.id",
          //     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0",
          //     "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          //     "Accept-Language": "en-US,en;q=0.5",
          //     "Accept-Encoding": "gzip, deflate",
          //     "Referer": "http://staffsite.gunadarma.ac.id/",
          //     "Content-Type": "application/x-www-form-urlencoded",
          //     "Content-Length": `50`,
          //     "Origin": "http://staffsite.gunadarma.ac.id",
          //     // "Connection": "keep-alive",
          //     "Upgrade-Insecure-Requests": "1",
          //   }
          // })
        response.send(staffSiteProxy);
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