import type { Jadwal } from "./genericTypes";

export const sortJadwal = (jadwalData: Jadwal[]) => {
  const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"]
  const sortWaktu = jadwalData.sort((a, b) => parseInt(a.waktu.replace(":", "")) > parseInt(b.waktu.replace(":", "")) ? 1 : 0)
  const sortHari = sortWaktu.sort((a, b)=> hari.indexOf(a.hari) > hari.indexOf(b.hari) ? 1 : 0)

  return sortHari
}

// TODO: Create 
export const sortJadwalByToday = (jadwalData: Jadwal[]) => {
  const now = new Date()
  const nowDay = now.getDay()
  const nowTime = parseInt(`${now.getHours()}${now.getMinutes()}`)
  const hari = ["Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu", "Minggu"]
  const sortedHari = hari.slice(nowDay).concat(hari.slice(0,nowDay));
  // const sortWaktu = jadwalData.sort((a, b) => parseInt(a.waktu.replace(":", "")) > parseInt(b.waktu.replace(":", "")) ? 1 : 0)
  const sortHari = jadwalData.sort((a, b)=> sortedHari.indexOf(a.hari) > sortedHari.indexOf(b.hari) ? 1 : 0)

  return sortHari
}