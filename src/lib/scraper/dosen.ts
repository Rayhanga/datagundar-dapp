import cheerio from "cheerio";
import type { AxiosInstance } from "axios";
import { get } from "svelte/store";

import { NotificationType } from "$lib/genericTypes"
import { instanceFactory, InstanceType } from "$lib/proxies";
import mainStore from "$lib/stores";
import { createKeyFromString } from "$lib/utils";

const { selectedCorsProxy, notifications } = mainStore

class DosenScraper {
  corsProxyInstance: AxiosInstance

  constructor(public corsProxyURL: URL | string) {
    this.corsProxyInstance = instanceFactory(InstanceType.STAFFSITE, corsProxyURL)
  }

  public setCorsProxyURL(newCorsProxyURL: URL | string) {
    this.corsProxyURL = newCorsProxyURL
    this.corsProxyInstance = instanceFactory(InstanceType.STAFFSITE, newCorsProxyURL)
  }

  public async getData() {
    // const response = await this._getRawData("index.php?go=search", {
    //   namanya: nama
    // })
    const response = await this._getRawData("/index2.php")
    // @ts-ignore
    const html = response.data
    const $ = cheerio.load(html)
    const rows = $("[width='80%']").find("td")
    let dosenData = []
    rows.each((i: number, row: any) => {
      const details = $(row).find("a")
      let email, homesite;
      try {
        email = $(details[0]).attr("href").replace("mailto:", "")
        homesite = $(details[1]).attr("href")
      } catch {
      }
      const nama = $(row).text().replace(/\[email\]|\[homesite\]/g, "").replace(/\s*$/g, "")
      if (nama !== "top" && nama !== "" && email) {
        dosenData = {
          ...dosenData,
          [createKeyFromString(nama)]: {
            nama,
            email,
            homesite
          }
        }
      }
    })

    return dosenData

    // let rows = $find("td,th").each((j: number, datum: any) => {
    //   waktuPerkuliahanDatum[j] = $(datum).text();
    // });
  }

  private async _getRawData(path: string, body = {}) {
    return await this.corsProxyInstance.get("/", {
      params: {
        url: path
      }
    })
    //   return await this.corsProxyInstance.post("/", {
    //     ...body
    //   }, {
    //     params: {
    //       url: path
    //     }
    //   })
    //     .catch(err => {
    //       notifications.notify({
    //         type: NotificationType.ERROR,
    //         message: `${err.message}`
    //       })
    //     })
  }
}

const dosenScraper = new DosenScraper(get(selectedCorsProxy))
selectedCorsProxy.subscribe(newCorsProxyURL => {
  dosenScraper.setCorsProxyURL(newCorsProxyURL)
})
export default dosenScraper