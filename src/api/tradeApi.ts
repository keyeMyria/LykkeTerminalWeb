import {ApiResponse} from './types';

export interface TradeApi {
  fetchAll: () => ApiResponse;
}

export class RestTradeApi implements TradeApi {
  fetchAll = () => Promise.resolve([] as any[]);
}

// tslint:disable-next-line:max-classes-per-file
export class MockTradeApi implements TradeApi {
  fetchAll = () =>
    Promise.resolve<any[]>([
      {
        Asset: 'BTC',
        DateTime: new Date(),
        Direction: 'Buy',
        OppositeAsset: 'USD',
        Price: 6500,
        TradeId: 1,
        Volume: 10
      },
      {
        Asset: 'BTC',
        DateTime: new Date(),
        Direction: 'Sell',
        OppositeAsset: 'EUR',
        Price: 6500,
        TradeId: 2,
        Volume: 10
      }
    ]);
}

export default TradeApi;
