import {extendObservable} from 'mobx';
import {OrderType, Side} from './index';

class TradeModel {
  id: string;
  asset: string;
  side: string;
  quantity: number;
  timestamp: string;
  tradeId: string;
  symbol: string;
  price: number;
  oppositeQuantity: number;
  buyVolume: number;
  sellVolume: number;
  orderType: OrderType;
  fee?: number;

  constructor(trade: Partial<TradeModel>) {
    extendObservable(this, trade);
    this.buyVolume = Math.abs(
      this.side === Side.Buy ? this.quantity : this.oppositeQuantity
    );
    this.sellVolume = Math.abs(
      this.side === Side.Sell ? this.quantity : this.oppositeQuantity
    );
  }
}

export default TradeModel;
