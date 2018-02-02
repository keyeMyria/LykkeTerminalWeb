import {computed, observable, runInAction} from 'mobx';
import {add, pathOr} from 'rambda';
import {BalanceListApi} from '../api/index';
import keys from '../constants/tradingWalletKeys';
import {AssetBalanceModel, BalanceModel} from '../models';
import {BaseStore, RootStore} from './index';

class BalanceListStore extends BaseStore {
  @computed
  get getBalances() {
    return this.balanceLists.sort(
      (a: BalanceModel, b: BalanceModel) => b.balance - a.balance
    );
  }

  @computed
  get totalBalance() {
    return this.balanceLists.map(b => b.balance).reduce(add, 0);
  }

  @computed
  get tradingWalletAssets() {
    return this.tradingAssets;
  }

  @computed
  get totalWalletAssetsBalance() {
    const tradingWallet = this.balanceLists.find(w => w.type === keys.trading);
    return pathOr(0, ['balance'], tradingWallet);
  }

  @observable private balanceLists: any[] = [];
  @observable private tradingAssets: AssetBalanceModel[] = [];

  constructor(store: RootStore, private readonly api: BalanceListApi) {
    super(store);
  }

  fetchAll = () => {
    return this.api
      .fetchAll()
      .then((balanceListDto: any) => {
        runInAction(async () => {
          const tempBalanceLists = balanceListDto.map(
            (wallet: any) => new BalanceModel(wallet)
          );
          this.updateBalance(tempBalanceLists);
          this.setTradingAssets(tempBalanceLists);
        });
        return Promise.resolve();
      })
      .catch(Promise.reject);
  };

  updateBalance = async (
    tempBalanceLists: BalanceModel[] = this.balanceLists
  ) => {
    const promises = tempBalanceLists.map((balanceList: BalanceModel) => {
      return balanceList.updateBalance(this.rootStore.referenceStore);
    });
    await Promise.all(promises);
    this.balanceLists = [...tempBalanceLists];
  };

  setTradingAssets = (balanceList: BalanceModel[]) => {
    this.tradingAssets = this.getTradingWallet(balanceList).balances.map(
      (assetsBalance: any) => {
        const assetBalance = new AssetBalanceModel(assetsBalance);
        const assetById = this.rootStore.referenceStore.getAssetById(
          assetBalance.id
        );
        assetBalance.name = pathOr('', ['name'], assetById);
        assetBalance.accuracy = pathOr('', ['accuracy'], assetById);
        return assetBalance;
      }
    );
  };

  subscribe = (session: any) => {
    session.subscribe(`balances`, this.onUpdateBalance);
  };

  onUpdateBalance = (args: any) => {
    const {a: asset, b: balance, r: reserved} = args[0];
    const assetBalance = this.tradingAssets.find(b => b.id === asset);
    if (assetBalance) {
      assetBalance.balance = balance;
      assetBalance.reserved = reserved;
    }
  };

  reset = () => {
    this.balanceLists = [];
    this.tradingAssets = [];
  };

  private getTradingWallet = (balanceList: BalanceModel[]) => {
    return balanceList.find(b => b.type === keys.trading)!;
  };
}

export default BalanceListStore;
