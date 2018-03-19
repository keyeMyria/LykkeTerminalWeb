import {rem} from 'polished';
import * as React from 'react';
import {FormattedNumber} from 'react-intl';
import styled from '../styled';
import {Table} from '../Table/index';
import {BalanceListItem} from './';
import {BalanceListProps} from './';

const ManageWalletLink = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: rgb(255, 255, 255);
  min-width: 250px;
  min-height: 48px;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${rem(16)};
  font-weight: bold;
  line-height: 1;
  text-align: center;
  margin-top: ${rem(24)};
`;

const Total = styled.tr`
  background: rgba(0, 0, 0, 0.1);

  td {
    font-weight: bold !important;
    padding-top: ${rem(12)};
    padding-bottom: ${rem(12)};
  }
`;

const BalanceList: React.SFC<BalanceListProps> = ({
  balances = [],
  baseAssetName,
  total,
  accuracy
}) => (
  <React.Fragment>
    <Table>
      <thead>
        <tr>
          <th>Symbol</th>
          <th title="Balance in base asset">Balance</th>
        </tr>
      </thead>
      <tbody>
        <Total>
          <td>Total</td>
          <td>
            <FormattedNumber value={+total.toFixed(accuracy)} />&nbsp;{
              baseAssetName
            }
          </td>
        </Total>
        {balances.map((balanceList: any) => (
          <BalanceListItem
            key={`balanceitem_${balanceList.id}`}
            accuracy={accuracy}
            {...balanceList}
            baseAssetName={baseAssetName}
          />
        ))}
      </tbody>
    </Table>
    <ManageWalletLink
      href={process.env.REACT_APP_WEBWALLET_URL}
      target="_blank"
    >
      Manage wallets in Account
    </ManageWalletLink>
  </React.Fragment>
);

export default BalanceList;
