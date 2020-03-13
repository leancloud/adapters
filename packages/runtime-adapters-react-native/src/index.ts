import { Adapters } from "@leancloud/adapter-types";
export * from "@leancloud/runtime-adapters-browser";

import LegacyStorage from "@react-native-community/async-storage-backend-legacy";
import AsyncStorageFactory, {
  AsyncStorage
} from "@react-native-community/async-storage";

type StorageModel = { [key in symbol | number | string]: string };

const defaultLegacyStorage = AsyncStorageFactory.create(
  new LegacyStorage<StorageModel>(),
  {}
);

const createStorage = (
  asyncStorage: AsyncStorage<StorageModel, any>
): Adapters["storage"] => ({
  async: true,
  getItem: asyncStorage.get.bind(asyncStorage),
  setItem: asyncStorage.set.bind(asyncStorage),
  removeItem: asyncStorage.remove.bind(asyncStorage),
  clear: asyncStorage.clearStorage.bind(asyncStorage)
});

export const storage = createStorage(defaultLegacyStorage);
