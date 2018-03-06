import {pathOr} from 'rambda';
import {MarketApi} from '../api/';
import {Side} from '../models';

export default class MarketService {
  static convert = async (assets: any[], assetId: string) => {
    const convertedQuotes = await MarketApi.convert({
      AssetsFrom: assets.map((asset: any) => ({
        Amount: asset.Balance,
        AssetId: asset.AssetId
      })),
      BaseAssetId: assetId,
      OrderAction: Side.Sell
    });
    return convertedQuotes.Converted.map((converted: any) => ({
      AssetId: pathOr(null, ['To', 'AssetId'], converted),
      Balance: pathOr(0, ['To', 'Amount'], converted),
      FromAssetId: pathOr(null, ['From', 'AssetId'], converted)
    }));
  };
}
