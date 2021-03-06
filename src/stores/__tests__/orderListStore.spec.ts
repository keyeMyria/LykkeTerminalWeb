import {OrderModel} from '../../models';
import * as mappers from '../../models/mappers';
import {OrderListStore, RootStore} from '../index';

describe('orderList store', () => {
  let orderListStore: OrderListStore;
  const api: any = {
    fetchAll: jest.fn(),
    placeLimit: jest.fn(),
    placeMarket: jest.fn()
  };

  beforeEach(() => {
    const rootStore = new RootStore(true);
    rootStore.orderBookStore.fetchAll = jest.fn();
    orderListStore = new OrderListStore(rootStore, api);

    api.fetchAll = jest.fn(() => [
      {
        AssetPairId: 'BTCUSD',
        CreateDateTime: '2018-01-17T07:17:40.84Z',
        Id: '1f4f1673-d7e8-497a-be00-e63cfbdcd0c7',
        OrderAction: 'Buy',
        Price: 1,
        Status: 'InOrderBook',
        Voume: 0.0001
      }
    ]);
  });

  describe('state', () => {
    it('orderLists should be defined after instantiation', () => {
      expect(orderListStore.limitOrders).toBeDefined();
      expect(orderListStore.limitOrders).not.toBeNull();
    });

    it('orderLists should be an empty array by default', () => {
      expect(orderListStore.limitOrders instanceof Array).toBeTruthy();
      expect(orderListStore.limitOrders.length).toBe(0);
    });
  });

  describe('reset', () => {
    it('should clear orderLists', async () => {
      orderListStore.reset();

      expect(orderListStore.limitOrders.length).toBe(0);
    });
  });

  describe('fetch orderLists', () => {
    it('should populate orderList collection', async () => {
      orderListStore.updateOrders = jest.fn();

      await orderListStore.fetchAll();

      expect(orderListStore.updateOrders).toHaveBeenCalledTimes(1);
    });
  });

  describe('update orderLists', () => {
    it('should update orderLists', async () => {
      orderListStore.reset();

      orderListStore.updateOrders(
        [
          {
            AssetPair: 'BTCUSD',
            DateTime: new Date(),
            Id: 12389418351364984,
            OrderType: 'Buy',
            Price: 5900.65,
            Volume: 1
          }
        ].map(mappers.mapToLimitOrder)
      );

      expect(orderListStore.allOrders.length).toBe(1);
    });
  });

  describe('order item', () => {
    it('should correctly map from dto', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrders[0];

      expect(orderListStore.allOrders).toHaveLength(1);
      expect(order.createdAt).toBeDefined();
      expect(order.price).toBeDefined();
      expect(order.id).toBeDefined();
      expect(order.side).toBeDefined();
      expect(order.symbol).toBeDefined();
      expect(order.volume).toBeDefined();
    });

    it('should be an instance of OrderModel', async () => {
      await orderListStore.fetchAll();
      const order = orderListStore.allOrders[0];
      expect(order instanceof OrderModel).toBeTruthy();
    });
  });
});
