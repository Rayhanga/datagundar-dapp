import axios from "axios"
import mainStore from "./stores"

export const isCorsProxyAvailable = async (corsProxyURL: URL) => {
  const { origin } = corsProxyURL
  const response = await axios.get(origin)
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