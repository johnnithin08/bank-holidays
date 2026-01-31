'use client';
import React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { tva, type VariantProps } from '@gluestack-ui/utils/nativewind-utils';

const textStyle = tva({
  base: 'text-typography-950',
  variants: {
    size: {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    weight: {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black',
    },
  },
});

type TextProps = RNTextProps &
  VariantProps<typeof textStyle> & {
    className?: string;
  };

const Text = React.forwardRef<React.ComponentRef<typeof RNText>, TextProps>(
  function Text(
    { className, size = 'md', weight = 'normal', ...props },
    ref
  ) {
    return (
      <RNText
        ref={ref}
        {...props}
        className={textStyle({ size, weight, class: className })}
      />
    );
  }
);

Text.displayName = 'Text';
export { Text };

