import { atom } from 'recoil';

export const updatedFromDialogAtom = atom({
  key: 'updatedFromDialogAtom',
  default: false,
})

export const deletedFromCardAtom = atom({
  key: 'deletedFromCardAtom',
  default: false,
})

export const checkedFromCardAtom = atom({
  key: 'checkedFromCardAtom',
  default: false,
})