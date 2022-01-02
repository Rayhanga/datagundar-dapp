import { baakInstance } from "$lib/proxies";
import { sortJadwal, sortJadwalByToday } from "$lib/utils";
import cheerio from "cheerio";

export const getJadwalKuliah = async (teks: string) => {
  const waktuPerkuliahan = await baakInstance
    .get("/kuliahUjian/6#")
    .then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      const rows = $("table.cell-xs-6").first().find("tr");
      let waktuPerkuliahanData: any[] = [];
      rows.each((i: number, row: any) => {
        let waktuPerkuliahanDatum: any[] = [];
        $(row)
          .find("td,th")
          .each((j: number, datum: any) => {
            waktuPerkuliahanDatum[j] = $(datum).text();
          });
        waktuPerkuliahanData = [...waktuPerkuliahanData, waktuPerkuliahanDatum];
      });
      waktuPerkuliahanData.shift();
      waktuPerkuliahanData = waktuPerkuliahanData.filter(
        (datum) => datum.length > 0
      );

      // Clean the data
      waktuPerkuliahanData.map((datum) => {
        const [start, end] = datum[1]
          .split(" - ")
          .map((time) => time.replace(".", ":"));
        datum[0] = start;
        datum[1] = end;
      });
      waktuPerkuliahanData.unshift(["Start", "End"]);

      return waktuPerkuliahanData;
    });

  return await baakInstance
    .get("/jadwal/cariJadKul", {
      params: {
        teks,
      },
    })
    .then((res) => {
      const html = res.data;
      const $ = cheerio.load(html);
      const rows = $("tbody").first().find("tr");
      let jadwalData: any[] = [];
      rows.each((i: number, row: any) => {
        let jadwalDatum: any[] = [];
        $(row)
          .find("td,th")
          .each((j: number, datum: any) => {
            jadwalDatum[j] = $(datum).text();
          });

        let waktu = jadwalDatum[3];

        if (i > 0) {
          const waktuParse = jadwalDatum[3].split("/").filter(item => item !== "");
          if (waktuParse.length > 0) {
            const waktuStart = waktuPerkuliahan[waktuParse[0]][0];
            const waktuEnd =
              waktuPerkuliahan[waktuParse[waktuParse.length - 1]][1];
            waktu = `${waktuStart} - ${waktuEnd}`;
          }
        }

        const kelas = jadwalDatum[0];
        const hari = jadwalDatum[1];
        const matkul = jadwalDatum[2];
        const ruang = jadwalDatum[4];
        const dosen = jadwalDatum[5];

        // console.log(jadwalDatum)

        jadwalData = [
          ...jadwalData,
          {
            kelas,
            hari,
            matkul,
            waktu,
            ruang,
            dosen,
          },
        ];
      });


      jadwalData.shift()
      sortJadwalByToday(jadwalData)

      return jadwalData;
    });
};
