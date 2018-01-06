import {computed, observable} from 'mobx';
import {AuthApi} from '../api/index';
import keys from '../constants/storageKeys';
import {StorageUtils} from '../utils/index';
import {BaseStore, RootStore} from './index';

const tokenStorage = StorageUtils(keys.token);

class AuthStore extends BaseStore {
  @computed
  get isAuth() {
    return !!this.token;
  }

  @observable token: string = tokenStorage.get() || '';
  @observable notificationId: string = '';

  constructor(store: RootStore, private readonly api: AuthApi) {
    super(store);
  }

  fetchBearerToken = (email: string, password: string) =>
    this.api
      .fetchBearerToken('/client/auth', email, password)
      .then((resp: any) => {
        this.token = resp.AccessToken;
        this.notificationId = resp.NotificationsId;
        tokenStorage.set(this.token);
        return Promise.resolve();
      })
      .catch((err: any) => Promise.reject(JSON.parse(err.message)));

  signOut = () => {
    this.rootStore.reset();
  };

  reset = () => {
    this.token = '';
    this.notificationId = '';
    tokenStorage.clear();
  };
}

export default AuthStore;
