import {lighten} from 'polished';
import * as React from 'react';
import styled from '../styled';

interface IconProps {
  name: string;
  color?: string;
}

const StyledIcon = styled.i`
  cursor: pointer;
  color: ${(props: any) => props.color};
  vertical-align: middle;
  &:hover {
    color: ${(props: any) => lighten(0.1, props.color || '#f5f6f7')};
  }
`;

const Icon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`icon icon-${name}`} />
);

// TODO: temporary solution with font-awesome icons
export const FAIcon = ({name, color}: IconProps) => (
  <StyledIcon color={color} className={`fa fa-${name}`} aria-hidden="true" />
);

export default Icon;
