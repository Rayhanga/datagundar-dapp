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

const mainStore = new MainStore(user)
export default mainStore