import axios from "axios";

const baakInstance = axios.create({
  baseURL: "https://baak.gunadarma.ac.id",
});

export const get = async ({ query }) => {
  const site = query.get("site");
  const url = query.get("url");
  if (site && url) {
    switch (site) {
      case "baak":
        const baakProxy = await baakInstance
          .get(url)
          .then((res) => {
            return res.data;
          })
          .catch(err => {
            if (!err.response) {
              return {
                status: 504,
                body: {
                  message: `Connection timeout with ${site}`,
                }
              }
            } else {
              return {
                status: err.response.status,
                body: {
                  message: err.message,
                }
              }
            }
          })
        return {
          body: baakProxy
        }
      default:
        return {
          status: 403,
          body: {
            message: "Wrong site target"
          }
        }
    }
  } else {
    return {
      body: {
        status: "ok"
      }
    }
  }
}