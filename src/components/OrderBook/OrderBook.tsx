import {observable} from 'mobx';
import {rem} from 'polished';
import {curry} from 'rambda';
import * as React from 'react';
import Scrollbars from 'react-custom-scrollbars';
import styled from 'styled-components';
import {displayType} from '../../constants/orderBook';
import {Order} from '../../models';
import {capitalize} from '../../utils';
import {css} from '../styled';
import {Table} from '../Table/index';
import {OrderBookItem} from './';

const Wrapper = styled.div`
  height: 100%;
  margin-right: -0.9375rem;
  padding-top: ${rem(55)};
`;

const StyledHead = styled.thead`
  display: block;
  position: absolute;
  width: 100%;
  left: 0;
  background: #333;
  z-index: 1;
`;

const StyledRow = styled.tr`
  display: flex;
  justify-content: space-evenly;
  &:hover {
    background: rgba(0, 0, 0, 0.6);
  }
`;

const StyledSellOrders = styled.tbody`
  display: block;
  margin: 34px 0.9375rem 0 0;
`;

const StyledBuyOrders = styled(StyledSellOrders)`
  margin: 0 0.9375rem 0 0;
`;

const StyledMidPrice = styled.tbody`
  display: flex;
  justify-content: center;
  margin: 0 0.9375rem 0 0;
  background: rgba(0, 0, 0, 0.2);

  &:hover {
    cursor: pointer;
  }
`;

const StyledHeader = styled.th.attrs({
  style: (props: any) => ({
    textAlign: props.align
  })
})`
  flex-grow: 1;
` as any;

const Switch = styled.div`
  color: #ffffff;
  display: flex;
  align-items: center;
  top: ${rem(18)};
  left: ${rem(8)};
  right: ${rem(8)};
  z-index: 10;
  position: absolute;
`;

const SwitchItem = styled.div`
  border: solid 1px rgba(140, 148, 160, 0.4);
  border-radius: 4px;
  padding: ${rem(8)} ${rem(18)};
  cursor: pointer;
  ${(p: any) =>
    p.active &&
    css`
      background-color: rgb(3, 136, 239);
      border: solid 1px rgba(0, 0, 0, 0.2);
      margin: -1px 0 -1px;
    `};
  :first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  :last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
` as any;

const Bar = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  height: 1px;
  margin-right: ${rem(15)};
`;

interface OrderBookProps {
  asks: Order[];
  bids: Order[];
  mid: number;
  priceAccuracy: number;
  volumeAccuracy: number;
  updatePrice: any;
  stateFns: any[];
}

class OrderBook extends React.Component<OrderBookProps> {
  @observable valueToShow: string = displayType[0];
  private scrollComponent: any;
  private wrapper: any;
  private content: any;
  private midPrice: any;

  private refHandlers = {
    content: (innerRef: any) => (this.content = innerRef),
    midPrice: (innerRef: any) => (this.midPrice = innerRef),
    scrollComponent: (ref: any) => (this.scrollComponent = ref),
    wrapper: (innerRef: any) => (this.wrapper = innerRef)
  };
  private isScrollSet: boolean = false;

  constructor(props: OrderBookProps) {
    super(props);

    this.props.stateFns.push(this.clearScroll);
  }

  clearScroll = () => {
    this.isScrollSet = false;
  };

  handleChange = (e: React.ChangeEvent<any>) => {
    this.valueToShow = e.target.id;
  };

  componentDidUpdate() {
    if (this.isScrollSet) {
      return;
    }

    const scroll =
      this.midPrice.offsetTop - this.scrollComponent.container.offsetHeight / 2;
    this.scrollComponent.scrollTop(scroll);

    if (this.props.asks.length && this.props.bids.length && scroll > 0) {
      this.isScrollSet = true;
    }
  }

  handleClick = (price: number, depth: number) => () => {
    this.props.updatePrice(price, depth);
  };

  render() {
    const {bids, asks, mid, priceAccuracy, volumeAccuracy} = this.props;

    const mapWithValueToShow = (o: Order) => o[this.valueToShow];

    const fromBids = curry(this.getMinMaxValue)(bids, mapWithValueToShow);
    const maxBidValue = fromBids(Math.max);
    const minBidValue = fromBids(Math.min);

    const fromAsks = curry(this.getMinMaxValue)(asks, mapWithValueToShow);
    const maxAskValue = fromAsks(Math.max);
    const minAskValue = fromAsks(Math.min);

    return (
      <Wrapper innerRef={this.refHandlers.wrapper}>
        <Switch>
          {displayType.map(x => (
            <SwitchItem
              key={x}
              active={this.valueToShow === x}
              onClick={this.handleChange}
              id={x}
            >
              {capitalize(x)}
            </SwitchItem>
          ))}
        </Switch>
        <Bar />
        <Table>
          <StyledHead>
            <StyledRow>
              <StyledHeader align="right">Buy</StyledHeader>
              <StyledHeader align="center">Price</StyledHeader>
              <StyledHeader align="left">Sell</StyledHeader>
            </StyledRow>
          </StyledHead>
        </Table>
        <Scrollbars autoHide={true} ref={this.refHandlers.scrollComponent}>
          <Table innerRef={this.refHandlers.content}>
            <StyledSellOrders>
              {asks.map(order => (
                <OrderBookItem
                  maxValue={maxAskValue}
                  minValue={minAskValue}
                  key={order.id}
                  valueToShow={order[this.valueToShow]}
                  {...order}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onClick={this.handleClick}
                />
              ))}
            </StyledSellOrders>
            <StyledMidPrice
              innerRef={this.refHandlers.midPrice}
              onClick={this.handleClick(Number(mid), 0)}
            >
              <tr>
                <td>{mid}</td>
              </tr>
            </StyledMidPrice>
            <StyledBuyOrders>
              {bids.map(order => (
                <OrderBookItem
                  maxValue={maxBidValue}
                  minValue={minBidValue}
                  key={order.id}
                  valueToShow={order[this.valueToShow]}
                  {...order}
                  priceAccuracy={priceAccuracy}
                  volumeAccuracy={volumeAccuracy}
                  onClick={this.handleClick}
                />
              ))}
            </StyledBuyOrders>
          </Table>
        </Scrollbars>
      </Wrapper>
    );
  }

  private getMinMaxValue = (
    orders: Order[],
    selector: (o: Order) => any,
    fn: Math['min'] | Math['max']
  ) => fn(...orders.map(selector));
}

export default OrderBook;
