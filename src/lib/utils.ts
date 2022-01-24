import axios from "axios"

export const isCorsProxyAvailable = async (corsProxyURL: URL) => {
  const {origin} = corsProxyURL
  const response = await axios.get(origin)
  const { status } = response.data
  return status === "ok"
}