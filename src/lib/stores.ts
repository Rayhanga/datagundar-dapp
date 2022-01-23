import type { IGunChainReference } from "gun/types/chain";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { Jadwal } from "./genericTypes";
import { gun, user } from "./initGun";

const createUsername = (ref: IGunChainReference) => {
  const { subscribe, set, update } = writable("");

  ref.get("alias").on((value: string) => {
    set(value);
  });

  // @ts-ignore
  gun.on("auth", async (ack) => {
    const alias = await ref.get("alias");
    set(alias as unknown as string);
  });

  return {
    subscribe,
    set,
    update,
  };
};

// TODO: Find out how to map gunjs array
const createJadwalUser = (ref: IGunChainReference) => {
  const { subscribe, set, update } = writable([]);

  ref.get("jadwal").once((value: Jadwal[]) => {
    set(value)
  })

  ref.get("jadwal").on((value: Jadwal[]) => {
    set(value)
  })
  
  return {
    subscribe,
    set,
    update
  }
}

const createCorsProxy = (ref: IGunChainReference) => {
  const { subscribe, set, update } = writable("");

  // @ts-ignore
  ref.get("corsProxy").once((value: string) => {
    if (value){
      set(value)
    }
  })

  ref.get("corsProxy").on((value: string) => {
    set(value)
  })
  
  return {
    subscribe,
    set,
    update
  }
}

export const username: Writable<string> = createUsername(user);
export const dataJadwal: Writable<Jadwal[]> = createJadwalUser(user)
export const corsProxy: Writable<string> = createCorsProxy(user)