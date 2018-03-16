import {action, computed, extendObservable, observable} from 'mobx';
import {join} from 'rambda';
import {AssetModel} from './index';

class InstrumentModel {
  id: string;
  name: string;
  baseAsset: AssetModel;
  quoteAsset: AssetModel;
  accuracy: number;
  invertedAccuracy: number;

  @observable price: number;
  @observable priceInBase: number;
  @observable change: number;
  @observable change24h: number;
  @observable volume: number;

  @computed
  get displayName() {
    if (this.baseAsset && this.quoteAsset) {
      return join('/', [this.baseAsset.name, this.quoteAsset.name]);
    }
    return undefined;
  }

  constructor(instrument: Partial<InstrumentModel>) {
    extendObservable(this, instrument);
  }

  @action
  updatePrice = (nextPrice: number) => {
    if (this.price !== nextPrice) {
      this.change = (nextPrice - this.price) / this.price * 100;
      this.price = nextPrice;
    }
  };
}

export default InstrumentModel;
