import axios from "axios"

export const isCorsProxyAvailable = async (corsProxyURL: URL) => {
  console.log(corsProxyURL)
  const { href } = corsProxyURL
  const response = await axios.get(href)
  const { status } = response.data
  return status === "ok"
}

export const toTitleCase = (str) => {
  return str.replace(
    /\w\S*/g,
    (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}