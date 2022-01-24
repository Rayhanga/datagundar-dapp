import type { IGunChainReference } from "gun/types/chain";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { Jadwal } from "./genericTypes";
import { gun, user } from "./initGun";

interface WritableCollection extends Writable<object> {
  getItemKey(targetValue: any): string | null
  getItemByKey(key: string): any
  addItem(value: any, key?: string): void
  updateItem(key: string, value: any): void
  removeItem(key: string): void
  clearCollection(): void
  setCollection(newCollection: any[]): void
}

interface WritableItem<T> extends Writable<T> {
  setValue(newValue: T): void
  deleteValue(): void
}

class MainStore {
  username: WritableItem<string>
  userkelas: WritableItem<string>
  jadwalPerkuliahan: WritableCollection
  registeredCorsProxies: WritableCollection
  selectedCorsProxy: WritableItem<string>

  constructor(
    public user: IGunChainReference
  ) {
    this.username = this._createUsernameStore(this.user)
    this.userkelas = this._createCustomStore(this.user.get("kelas"))
    this.selectedCorsProxy = this._createCustomStore(this.user.get("selectedCorsProxy"))
    this.jadwalPerkuliahan = this._createCustomCollectionStore(this.user.get("jadwalPerkuliahan"))
    this.registeredCorsProxies = this._createCustomCollectionStore(this.user.get("registeredCorsProxies"))
  }

  private _createUsernameStore(ref: IGunChainReference): WritableItem<string> {
    const { subscribe, set, update } = writable("");

    ref.get("alias").on((value: string) => {
      set(value);
    });

    // @ts-ignore
    gun.on("auth", async (ack) => {
      const alias = await ref.get("alias");
      set(alias as unknown as string);
    });

    const setValue = (newValue) => {
      ref.get("alias").put(newValue)
    }

    const deleteValue = () => {
      ref.get("alias").put(null)
    }

    return {
      subscribe,
      set,
      update,
      setValue,
      deleteValue
    }
  }

  private _createCustomCollectionStore(ref: IGunChainReference): WritableCollection {
    const { subscribe, set, update } = writable({});

    ref.map().on((value, key) => {
      update(oldValue => {
        return {
          ...oldValue,
          [key]: value
        }
      })
    })

    // @ts-ignore
    // gun.on("auth", async (ack) => {
    //   ref.map().on((value, key) => {
    //     update(oldValue => {
    //       return {
    //         ...oldValue,
    //         [key]: value
    //       }
    //     });
    //   })
    // });

    const getItemKey = (targetValue) => {
      let itemKey = null
      subscribe(value => {
        for (const [key, val] of Object.entries(value)) {
          if (targetValue === val) {
            itemKey = key
            break
          }
        }
      })
      return itemKey
    }

    const getItemByKey = (targetKey: string) => {
      subscribe(value => {
        for (const [key, val] of Object.entries(value)) {
          // console.log(key, val)
          if (targetKey === key) {
            console.log(key, val)
            return [key, val]
            break
          }
        }
      })
      return null
    }

    const addItem = (value, key = undefined) => {
      if (key) {
        updateItem(key, value)
      } else {
        if (getItemKey(value)) {
          // TODO: Create better error handler
          throw new Error("Duplicate value")
        } else {
          ref.set(value)
        }
      }
    }

    const updateItem = (key, value) => {
      ref.get(key).put(value)
    }

    const removeItem = (key) => {
      ref.get(key).put(null)
    }

    const clearCollection = () => {
      ref.put(null)
    }

    const setCollection = (newCollection: any[]) => {
      for (const item of newCollection) {
        ref.set(item)
      }
    }

    return {
      subscribe,
      set,
      update,
      getItemKey,
      addItem,
      updateItem,
      removeItem,
      clearCollection,
      setCollection,
      getItemByKey
    }
  }

  private _createCustomStore(ref: IGunChainReference): WritableItem<any> {
    const { subscribe, set, update } = writable();

    ref.on(value => {
      set(value)
    })

    // @ts-ignore
    // gun.on("auth", async (ack) => {
    //   ref.on(value => {
    //     set(value)
    //   })
    // });

    const setValue = (newValue) => {
      ref.put(newValue)
    }

    const deleteValue = () => {
      ref.put(null)
    }

    return {
      subscribe,
      set,
      update,
      setValue,
      deleteValue
    }
  }
}

const mainStore = new MainStore(user)
export default mainStore