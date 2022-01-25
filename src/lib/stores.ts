import type { IGunChainReference } from "gun/types/chain";
import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { Notification } from "./genericTypes"
import { NotificationType } from "./genericTypes";
import { gun, user } from "./initGun";

interface WritableGunCollection extends Writable<object> {
  getItemKey(targetValue: any): string | null
  getItemByKey(key: string): any
  addItem(value: any, key?: string): void
  updateItem(key: string, value: any): void
  removeItem(key: string): void
  clearCollection(): void
  setCollection(newCollection: any[]): void
}

interface WritableGunItem<T> extends Writable<T> {
  setValue(newValue: T): void
  deleteValue(): void
}

interface NotificationStore extends Writable<object> {
  notify(notification: Notification): void
  removeNotification(key: string): void
}

class MainStore {
  username: WritableGunItem<string>
  userkelas: WritableGunItem<string>
  jadwalPerkuliahan: WritableGunCollection
  registeredCorsProxies: WritableGunCollection
  selectedCorsProxy: WritableGunItem<string>
  notifications: NotificationStore

  constructor(
    public user: IGunChainReference
  ) {
    this.username = this._createUsernameStore(this.user)
    this.userkelas = this._createCustomGunStore(this.user.get("kelas"))
    this.selectedCorsProxy = this._createCustomGunStore(this.user.get("selectedCorsProxy"))
    this.jadwalPerkuliahan = this._createCustomGunCollectionStore(this.user.get("jadwalPerkuliahan"))
    this.registeredCorsProxies = this._createCustomGunCollectionStore(this.user.get("registeredCorsProxies"))
    this.notifications = this._createNotificationStore()
  }

  private _createNotificationStore(): NotificationStore {
    const { subscribe, set, update } = writable({});

    const notify = (notification: Notification) => {
      update(oldValue => {
        return {
          ...oldValue,
          [Date.now()]: notification
        }
      })
    }

    const removeNotification = (key: string) => {
      update(oldValue => {
        const temp = oldValue;
        delete temp[key];
        return temp;
      })
    }

    return {
      subscribe,
      set,
      update,
      notify,
      removeNotification
    }
  }

  private _createUsernameStore(ref: IGunChainReference): WritableGunItem<string> {
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

  private _createCustomGunCollectionStore(ref: IGunChainReference): WritableGunCollection {
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
          this.notifications.notify({
            type: NotificationType.ERROR,
            message: "Duplicate Value!"
          })
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

  private _createCustomGunStore(ref: IGunChainReference): WritableGunItem<any> {
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