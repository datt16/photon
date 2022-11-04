import { Vector3 } from "babylonjs";
import { atom } from "recoil";
import { AtomKeys } from "../recoilKeys";

export const positionState = atom<Vector3>({
    key: AtomKeys.POSITION,
    default: Vector3.Zero()
})
