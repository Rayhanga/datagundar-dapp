import axios from "axios";

const dev = process.env.NODE_ENV === "development";


export const baakInstance = axios.create({
  baseURL: dev ? "http://localhost:3003/baak" : "https://baak.gunadarma.ac.id",
});

export const sapInstance = axios.create({
  baseURL: "https://sap.gunadarma.ac.id",
});
