import axios from "axios"

// TODO: Create a cors proxy here

const baakInstance = axios.create({
  baseURL: "https://baak.gunadarma.ac.id",
});

export const get = async ({params, path, query}) => {
  const { site } = params;
  const targetURL = path.replace(`/api/defaultcorsproxy/${site}/`, "")
  let targetQuery = {}
  for (const [key, value] of query.entries()) {
    targetQuery[key] = value
  }
    
  switch (site) {
    case "baak":
      const baakProxy = await baakInstance
        .get(targetURL, {
          params: targetQuery
        })
        .then((res) => {
          return res.data;
        });
      return {
        body: baakProxy
      }
    default:
      throw new Error("Wrong site target")
  }
}