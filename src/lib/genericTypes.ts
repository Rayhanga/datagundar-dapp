export interface MataKuliah {
  kode: string;
  judul: string;
  dosen: Dosen;
  materi: Materi[];
}

export interface Dosen {
  nama: string;
  materi: Materi[];
}

export interface Materi {
  nama: string;
  sumber: URL;
}

export interface Jadwal {
  kelas: string;
  dosen: Dosen;
  ruang: string;
  waktu: string;
  hari: string;
  matkul: MataKuliah;
}

export enum NotificationType {
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
  SUCCESS = "success"
}

export interface Notification {
  type: NotificationType
  message: string
}
