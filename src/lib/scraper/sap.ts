import { NotificationType } from "$lib/genericTypes"
import { instanceFactory, InstanceType } from "$lib/proxies"
import mainStore from "$lib/stores"
import { createKeyFromString } from "$lib/utils"
import type { AxiosInstance } from "axios"
import { get } from "svelte/store"

const { selectedCorsProxy, notifications } = mainStore

class SapScraper {
  corsProxyInstance: AxiosInstance

  constructor(public corsProxyURL: URL | string) {
    this.corsProxyInstance = instanceFactory(InstanceType.SAP, corsProxyURL)
  }

  public setCorsProxyURL(newCorsProxyURL: URL | string) {
    this.corsProxyURL = newCorsProxyURL
    this.corsProxyInstance = instanceFactory(InstanceType.SAP, newCorsProxyURL)
  }

  public async getSapData() {
    // await this._getRawData()
    const sapDataRaw = await this._getRawData("/api/dafsap.php")
    if(!sapDataRaw) {
      throw new Error("Empty value ;-;")
    }
    let temp = {}

    for (const { nama_fak, jurusan } of sapDataRaw) {
      for (const { jenjang, nama_jur, matkul } of jurusan) {
        const key = createKeyFromString(`${nama_fak}_${nama_jur}`)
        temp[key] = {}
        for (const {
          id_mk,
          kode_mk,
          nama_mk,
          desc_mk,
          file,
        } of matkul) {
          temp[key][id_mk] = {
            kode: kode_mk,
            nama: nama_mk,
            fakultas: nama_fak,
            jurusan: nama_jur,
            jenjang: jenjang,
            deskripsi: desc_mk,
            downloadUrl: `https://sap.gunadarma.ac.id/upload/${file}`,
          }
        }
        temp[key] = JSON.stringify(temp[key])
      }
    }

    return temp
  }

  private async _getRawData(path: string) {
    return await this.corsProxyInstance.get("/", {
      params: {
        url: path
      }
    })
      .then(res => {
        return res.data
      })
      .catch(err => {
        notifications.notify({
          type: NotificationType.ERROR,
          message: `${err.message}`
        })
      })

  }
}

const sapScraper = new SapScraper(get(selectedCorsProxy))
selectedCorsProxy.subscribe(newCorsProxyURL => {
  sapScraper.setCorsProxyURL(newCorsProxyURL)
})
export default sapScraper