import Gun from "gun";
import type { IGunChainReference } from "gun/types/chain";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { Jadwal } from "./genericTypes";
import { gun, user } from "./initGun";

class MainStore {
  username: Writable<string>
  jadwalPerkuliahan: Writable<Jadwal[]>
  registeredCorsProxy: Writable<string[]>
  selectedCorsProxy: Writable<string>

  constructor(
    public user: IGunChainReference
  ){
    this.username = this._createUsernameStore(this.user)
    this.jadwalPerkuliahan = this._createCustomStore(this.user.get("jadwalPerkuliahan")) as Writable<Jadwal[]>
    this.registeredCorsProxy = this._createCustomStore(this.user.get("registeredCorsProxy")) as Writable<string[]>
    this.selectedCorsProxy = this._createCustomStore(this.user.get("selectedCorsProxy")) as Writable<string>
  }

  private _createUsernameStore(ref: IGunChainReference): Writable<string> {
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
      update
    }
  }

  private _createCustomStore(ref: IGunChainReference){
    const { subscribe, set, update } = writable();

    ref.on(value => {
      console.log(value)
    })

    return {
      subscribe,
      set,
      update
    }
  }

}


// const createUsername = (ref: IGunChainReference) => {
//   const { subscribe, set, update } = writable("");

//   ref.get("alias").on((value: string) => {
//     set(value);
//   });

//   // @ts-ignore
//   gun.on("auth", async (ack) => {
//     const alias = await ref.get("alias");
//     set(alias as unknown as string);
//   });

//   return {
//     subscribe,
//     set,
//     update
//   }
// };

// const createJadwalStore = (ref: IGunChainReference) => {
//   const { set, update, subscribe } = writable({})

//   ref.get("jadwal").map().on((data, key) => {
//     console.log(key, data)
//     if (data) {
//       update(store => ({ ...store, [key]: data }))
//     } else {
//       update(store => {
//         delete store[key]
//         return store
//       })
//     }
//   })

//   return {
//     subscribe,
//     set,
//     update: (key, value) => {
//       ref.get(key).put(value)
//     }
//   }
// }


// const createCorsProxy = (ref: IGunChainReference) => {
//   const { subscribe, set, update } = writable("");

//   ref.get("corsProxy").on((value: string) => {
//     set(value)
//   })

//   return {
//     subscribe,
//     set,
//     update
//   }
// }

// const createRegisteredeCorsProxy = (ref: IGunChainReference) => {
//   const { subscribe, set, update } = writable([]);

//   ref.get("corsProxy").on((value: string[]) => {
//     set(value)
//   })

//   return {
//     subscribe,
//     set,
//     update
//   }
// }

const mainStore = new MainStore(user)
export default mainStore

// export const username: Writable<string> = createUsername(user);
// export const jadwalPerkuliahan: any = createJadwalStore(user)
// export const registeredCorsProxy: Writable<string[]> = createRegisteredeCorsProxy(user)
// export const corsProxy: Writable<string> = createCorsProxy(user)