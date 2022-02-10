import axios from "axios"
import type { WritableGunCollection, WritableGunItem } from "./storeTypes"

export const isCorsProxyAvailable = async (corsProxyURL: URL) => {
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

export const createKeyFromString = (str) => {
  return str.replace(/\s/g, "-")
}