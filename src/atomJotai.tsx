import { atom } from "jotai";
import { User } from "./models/User";

export const userAtom = atom<User | null>(null);
export const isUserInfoSetDoneAtom = atom<boolean>(false);
export const isLoggedinAtom = atom<boolean>(false);
export const updatedFromDialogAtom = atom<boolean>(false);
export const deletedFromCardAtom = atom<boolean>(false);
export const checkedFromCardAtom = atom<boolean>(false);
export const createdFromDialogAtom = atom<boolean>(false);