import axios from "axios";

const baakInstance = axios.create({
  baseURL: "https://baak.gunadarma.ac.id",
});

export const get = async ({query}) => {
  const site  = query.get("site");
  const url  = query.get("url");
  console.log(site, url)
  if (site && url) {
    switch (site) {
      case "baak":
        const baakProxy = await baakInstance
          .get(url)
          .then((res) => {
            return res.data;
          });
        return {
          body: baakProxy
        }
      default:
        throw new Error("Wrong site target")
    }
  } else {
    return {
      body: {
        status: "ok"
      }
    }
  }
}