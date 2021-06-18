import _ from 'lodash';

import { Account, Cloudinary, Thumbnail } from '../types';

interface Data {
  accounts: Account[];
  adAccounts: any[];
  cloudinary: Cloudinary;
  images: Thumbnail[];
}

// On server doesn't have LocalStorage
const initialData: Data = {
  accounts: [],
  adAccounts: [],
  cloudinary: {},
  images: [],
};

const isBrowser = typeof window !== 'undefined';

class LocalStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }

  read(): Data | null {
    const value = isBrowser ? localStorage.getItem(this.key) : null;

    if (value === null) {
      return initialData;
    }

    return JSON.parse(value) as Data;
  }

  write(obj: Data): void {
    isBrowser && localStorage.setItem(this.key, JSON.stringify(obj));
  }
}

export const storage = new LocalStorage('data');

export function getData<K extends keyof Data>(key: K): Data[K] {
  return storage.read()[key];
}

export const addAccount = (account: Account) => {
  const data = storage.read();
  const accounts = [...data.accounts, account];
  const unique = _.uniqBy(accounts, 'id');
  storage.write({ ...data, accounts: unique });
};

export const removeAccount = (id: string) => {
  const data = storage.read();
  const accounts = data.accounts.filter((account) => account.id !== id);
  storage.write({ ...data, accounts });
};

export const setupCloudinary = (cloudinary: Cloudinary) => {
  const data = storage.read();
  storage.write({ ...data, cloudinary });
};

export const addCloundName = (cloudName: string) => {
  const data = storage.read();
  const cloudinary = { ...data.cloudinary, cloudName };
  storage.write({ ...data, cloudinary });
};

export const addPreset = (preset: string) => {
  const data = storage.read();
  const cloudinary = { ...data.cloudinary, preset };
  storage.write({ ...data, cloudinary });
};

export const addImage = (image: Thumbnail) => {
  const data = storage.read();
  const images = [...data.images, image];
  storage.write({ ...data, images });
};

export const removeImage = (id: Thumbnail['id']) => {
  const data = storage.read();
  const images = [...data.images];
  const index = images.findIndex((img) => img.id === id);
  if (index > -1) {
    images.splice(index, 1);
    storage.write({ ...data, images });
  }
};
