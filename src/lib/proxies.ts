import axios, { AxiosInstance } from "axios";

export enum InstanceType {
  BAAK = 0,
  SAP = 1,
  STAFFSITE = 2
}

export const instanceFactory = (instanceType: InstanceType, corsProxy: URL | string): AxiosInstance => {
  switch (instanceType) {
    case InstanceType.BAAK:
      return axios.create({
        baseURL: `${corsProxy}/baak`,
      })
    case InstanceType.SAP:
      return axios.create({
        baseURL: `${corsProxy}/sap`,
      })
    case InstanceType.STAFFSITE:
      return axios.create({
        baseURL: `${corsProxy}/staffsite`,
      })
  }
}