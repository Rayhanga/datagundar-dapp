import GUN from "gun";
import 'gun/axe.js'
import 'gun/sea.js'

export const gun = GUN();
export const user = gun.user().recall({ sessionStorage: true });
