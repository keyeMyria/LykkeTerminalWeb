import {Form, withFormik} from 'formik';
import rem from 'polished/lib/helpers/rem';
import * as React from 'react';
import styled from 'styled-components';
import {OrderInputs} from '../../models';
import NumberInput from '../NumberInput/NumberInput';
import {
  OrderLimitProps,
  StyledActionTitle,
  StyledAvailable,
  StyledInputControl,
  StyledOrderButton,
  StyledReset
} from './index';
import OrderButton from './OrderButton';
import OrderPercentage from './OrderPercentage';

// tslint:disable-next-line:no-var-requires
const {Flex} = require('grid-styled');

const StyledTotal = Flex.extend`
  justify-content: space-between;
  border-top: 1px solid rgb(45, 45, 45);
  border-bottom: 1px solid rgb(45, 45, 45);
  padding: ${rem(19)} 0;
  margin: ${rem(23)} 0;
`;

const StyledTitle = styled.div`
  font-size: ${rem(16)};
`;

const OrderLimit: React.SFC<OrderLimitProps> = ({
  action,
  onChange,
  onArrowClick,
  quantity,
  quantityAccuracy,
  price,
  priceAccuracy,
  percents,
  onHandlePercentageChange,
  baseName,
  buttonMessage,
  quoteName,
  isSell,
  amount,
  isDisable,
  onReset,
  balance,
  isEditForm
}) => {
  return (
    <Form>
      <StyledInputControl>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <StyledActionTitle>
            {isEditForm ? 'Volume' : `${action} ${baseName}`}
          </StyledActionTitle>
          <StyledAvailable>
            {balance} {isSell ? baseName : quoteName} available
          </StyledAvailable>
        </Flex>
        <NumberInput
          value={quantity}
          id={OrderInputs.Quantity}
          onChange={onChange(quantityAccuracy)}
          onArrowClick={onArrowClick(quantityAccuracy)}
        />
      </StyledInputControl>
      <Flex justify={'space-between'}>
        {percents!.map((item: any, index: number) => (
          <OrderPercentage
            percent={item.percent}
            key={index}
            onClick={onHandlePercentageChange(index)}
            isActive={item.isActive}
          />
        ))}
      </Flex>
      <StyledInputControl style={{borderBottom: '1px solid #333'}}>
        <Flex justify={'space-between'} style={{marginBottom: '8px'}}>
          <StyledTitle>Price ({quoteName})</StyledTitle>
        </Flex>
        <NumberInput
          value={price}
          id={OrderInputs.Price}
          onChange={onChange(priceAccuracy)}
          onArrowClick={onArrowClick(priceAccuracy)}
        />
      </StyledInputControl>
      <StyledTotal>
        <StyledTitle>Total</StyledTitle>
        <StyledAvailable>
          {amount} {quoteName}
        </StyledAvailable>
      </StyledTotal>

      {/*{isEditForm && (*/}
      {/*<StyledNote>*/}
      {/*Your order may execute as a maker order or taker order.*/}
      {/*</StyledNote>*/}
      {/*)}*/}

      <StyledOrderButton>
        <OrderButton
          isDisable={isDisable}
          type={'submit'}
          message={buttonMessage}
        />
      </StyledOrderButton>

      {onReset && (
        <StyledReset justify={'center'}>
          <span onClick={onReset}>Reset and clear</span>
        </StyledReset>
      )}
    </Form>
  );
};

export default withFormik<OrderLimitProps, {}>({
  handleSubmit: (values: any, {props}) => {
    const {action, baseName, quoteName} = props;
    props.onSubmit(action, baseName, quoteName);
  }
})(OrderLimit);
