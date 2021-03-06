import * as React from 'react';
import styled from 'styled-components';

const StyledInput = styled.input`
  background-color: transparent;
  border-radius: 4px;
  border: solid 1px rgba(140, 148, 160, 0.4);
  color: #f5f6f7;
  padding-left: 5px;
  box-sizing: border-box;
  height: 32px;
  width: 100%;

  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    cursor: pointer;
    display: block;
    width: 10px;
    background: transparent;
  }
`;

const StyledInputNumberComponent = styled.div`
  position: sticky;

  > span.up,
  > span.down {
    content: '';
    position: absolute;
    right: 5px;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-bottom: 6px solid #f5f6f7;
    z-index: 5;

    &:hover {
      cursor: pointer;
    }
  }

  > span.up {
    top: 8px;
  }

  > span.down {
    bottom: 8px;
    transform: rotate(180deg);
  }
`;

interface NumberInput {
  id?: string;
  value?: string;
  onChange: any;
  onArrowClick: any;
}

const NumberInput: React.SFC<NumberInput> = ({
  id,
  value,
  onChange,
  onArrowClick
}) => {
  return (
    <StyledInputNumberComponent>
      <StyledInput
        id={id}
        type="text"
        value={value}
        onChange={onChange(id)}
        // tslint:disable-next-line:jsx-no-lambda
        onKeyDown={e => {
          switch (e.keyCode) {
            case 38:
              onArrowClick('up', id)();
              e.preventDefault();
              break;
            case 40:
              onArrowClick('down', id)();
              e.preventDefault();
              break;
            default:
              break;
          }
        }}
        name={value}
      />
      <span className="up" onClick={onArrowClick('up', id)} />
      <span className="down" onClick={onArrowClick('down', id)} />
    </StyledInputNumberComponent>
  );
};

export default NumberInput;
