import { PersistConfig, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import organizationReducer from './organizationSlice';

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['organization'],
};

const persistedReducer = persistReducer(persistConfig, organizationReducer);

export default persistedReducer;
