import cheerio from "cheerio";
import type { AxiosInstance } from "axios";
import { get } from "svelte/store";

import { NotificationType } from "$lib/genericTypes"
import type { Jadwal } from "$lib/genericTypes";
import { instanceFactory, InstanceType } from "$lib/proxies";
import mainStore from "$lib/stores";
import { createKeyFromString } from "$lib/utils";

enum DataType {
  WAKTU_PERKULIAHAN = 0,
  JADWAL_PERKULIAHAN = 1
}

const { selectedCorsProxy, notifications } = mainStore

class JadwalScraper {
  hariList: string[]
  waktuPerkulihanData: any[]
  jadwalData: [string, Jadwal][]
  corsProxyInstance: AxiosInstance

  constructor(public corsProxyURL: URL | string) {
    this.corsProxyInstance = instanceFactory(InstanceType.BAAK, corsProxyURL)
    this.hariList = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"]
  }

  public setCorsProxyURL(newCorsProxyURL: URL | string) {
    this.corsProxyURL = newCorsProxyURL
    this.corsProxyInstance = instanceFactory(InstanceType.BAAK, newCorsProxyURL)
  }

  public async getJadwalData(teks: string) {
    const jadwalDataRaw = await this._getRawData(`/jadwal/cariJadKul?teks=${teks}`)
    if (jadwalDataRaw) {
      const waktuPerkuliahanDataRaw = await this._getRawData("/kuliahUjian/6#")

      this.waktuPerkulihanData = await this._parseRawData(waktuPerkuliahanDataRaw, DataType.WAKTU_PERKULIAHAN)
      this.jadwalData = await this._parseRawData(jadwalDataRaw, DataType.JADWAL_PERKULIAHAN)

      return this.jadwalData
    }
  }


  private async _getRawData(path: string) {
    return await this.corsProxyInstance.get("/", {
      params: {
        url: path
      }
    })
      .catch(err => {
        notifications.notify({
          type: NotificationType.ERROR,
          message: `${err.message}`
        })
      })
  }

  private _parseRawData(response, rawDataType: DataType) {
    const html = response.data
    const $ = cheerio.load(html)

    switch (rawDataType) {
      case DataType.WAKTU_PERKULIAHAN:
        var rows = $("table.cell-xs-6").first().find("tr");
        let waktuPerkuliahanData: any[] = [];
        rows.each((i: number, row: any) => {
          let waktuPerkuliahanDatum: any[] = [];
          $(row).find("td,th").each((j: number, datum: any) => {
            waktuPerkuliahanDatum[j] = $(datum).text();
          });
          waktuPerkuliahanData = [...waktuPerkuliahanData, waktuPerkuliahanDatum];
        });
        waktuPerkuliahanData.shift();
        waktuPerkuliahanData = waktuPerkuliahanData.filter(
          (datum) => datum.length > 0
        );

        this._cleanParsedData(waktuPerkuliahanData, rawDataType)

        return waktuPerkuliahanData
      case DataType.JADWAL_PERKULIAHAN:
        var rows = $("tbody").first().find("tr");
        let jadwalData: any[] = [];

        rows.each((i: number, row: any) => {
          let jadwalDatum: any[] = [];
          $(row).find("td,th").each((j: number, datum: any) => {
            jadwalDatum[j] = $(datum).text();
          });

          let [kelas, hari, matkul, waktu, ruang, dosen] = jadwalDatum
          if (i > 0) {
            waktu = this._parseJadwalWaktu(waktu)
          }
          matkul = matkul.replace(/\s*$/g, "").replace(/\/*/g, "").replace(/\**/g, "").replace(/\#*/g, "")

          jadwalData = [...jadwalData, [`${kelas}_${hari}_${createKeyFromString(matkul)}_${createKeyFromString(dosen)}`, {
            kelas, hari, matkul, waktu, ruang, dosen
          }]]

        })

        jadwalData.shift()

        return jadwalData
      default:
        throw "Error DataType"
    }
  }

  private _cleanParsedData(parsedData: any[], parsedDataType: DataType) {
    switch (parsedDataType) {
      case DataType.WAKTU_PERKULIAHAN:
        parsedData.map(datum => {
          const [start, end] = datum[1].split(" - ").map(time => time.replace(".", ":"));
          datum[0] = start;
          datum[1] = end;
        });
        parsedData.unshift(["Start", "End"]);
        break
      // case DataType.JADWAL_PERKULIAHAN:

      //   break
      default:
        throw "Error DataType"
    }
  }

  private _parseJadwalWaktu(waktu: string) {
    const waktuParse = waktu.split("/").filter(item => item !== "");
    if (waktuParse.length > 0) {
      const waktuStart = this.waktuPerkulihanData[waktuParse[0]][0];
      const waktuEnd =
        this.waktuPerkulihanData[waktuParse[waktuParse.length - 1]][1];
      return `${waktuStart} - ${waktuEnd}`;
    } else {
      return ""
    }
  }

  private _sortJadwalByWaktu(a: Jadwal, b: Jadwal) {
    const waktu_a = a.waktu.replace(":", "")
    const waktu_b = b.waktu.replace(":", "")
    return waktu_a > waktu_b ? 1 : 0
  }

  private _sortJadwalByHari(a: Jadwal, b: Jadwal) {
    const hari_a = this.hariList.indexOf(a.hari)
    const hari_b = this.hariList.indexOf(b.hari)
    return hari_a > hari_b ? 1 : 0
  }

  private _sortJadwalByToday(today) {

  }

  private _sortHariListByToday(today) {
    return this.hariList.slice(today).concat(this.hariList.slice(0, today))
  }

  private _sortJadwal(byToday = false) {
    if (byToday) {
      const now = new Date()
      const today = now.getDay()
      // const nowTime = parseInt(`${now.getHours()}${now.getMinutes()}`)
    }
  }
}

const jadwalScraper = new JadwalScraper(get(selectedCorsProxy))
selectedCorsProxy.subscribe(newCorsProxyURL => {
  jadwalScraper.setCorsProxyURL(newCorsProxyURL)
})
export default jadwalScraper