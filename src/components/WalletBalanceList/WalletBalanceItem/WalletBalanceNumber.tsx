import * as React from 'react';
import styled from '../../styled';

const StyledNumber = styled.div.attrs({})`
  color: ${(p: any) => p.color};
  span {
    color: #f5f6f7;
  }
`;

interface WalletBalanceNumberProps {
  num: number;
  accuracy: number;
  color?: string;
}

const WalletBalanceNumber: React.SFC<WalletBalanceNumberProps> = ({
  num,
  accuracy,
  color = '#ffffff',
  children
}) => {
  if (!num) {
    return null;
  }
  return (
    <StyledNumber color={color}>
      {num.toFixed(accuracy).replace(/[.,]?0+$/, '')}
      {children}
    </StyledNumber>
  );
};

export default WalletBalanceNumber;
