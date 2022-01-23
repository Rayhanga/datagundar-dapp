import axios, { AxiosInstance } from "axios";

export enum InstanceType {
  BAAK = 0,
  SAP = 1,
  STAFFSITE = 2
}

export const instanceFactory = (instanceType: InstanceType, corsProxy: string): AxiosInstance => {
  switch (instanceType) {
    case 0:
      return axios.create({
        baseURL: `${corsProxy}/baak`,
      })
    case 1:
      return axios.create({
        baseURL: `${corsProxy}/sap`,
      })
    case 2:
      return axios.create({
        baseURL: `${corsProxy}/staffsite`,
      })
  }
}