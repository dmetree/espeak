import * as React from 'react';

export type TextVariant =
  | 'body'
  | 'bodySmall'
  | 'bodyLarge'
  | 'caption'
  | 'overline';

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';

export type TextColor =
  | 'default'
  | 'muted'
  | 'strong'
  | 'danger'
  | 'success'
  | 'warning';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div';
  /** Typography style, maps to the CSS you already have */
  variant?: TextVariant;
  /** Font weight override (optional, otherwise use default for variant) */
  weight?: TextWeight;
  align?: TextAlign;
  color?: TextColor;
  /** Extra classes on top of the variant */
  className?: string;
  children: React.ReactNode;
}

// Typography from Figma tokens (Helvetica, 150% line-height)
// Body           21px
// Body small     16px
// Description    12px
// Description sm  9px
const TEXT_VARIANTS: Record<TextVariant, string> = {
  // Main body text: 21px / 150%
  body: 'text-[21px] leading-[150%]',
  // Smaller body: 16px / 150%
  bodySmall: 'text-[16px] leading-[150%]',
  // Optional larger body – currently same as body for consistency
  bodyLarge: 'text-[21px] leading-[150%]',
  // Description: 12px / 150%
  caption: 'text-[12px] leading-[150%]',
  // Small description / overline: 9px / 150%
  overline: 'text-[9px] leading-[150%] uppercase',
};

const TEXT_WEIGHTS: Record<TextWeight, string> = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const TEXT_ALIGN: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const TEXT_COLORS: Record<TextColor, string> = {
  default: 'text-gray-900',
  muted: 'text-gray-500',
  strong: 'text-gray-950',
  danger: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-amber-600',
};

export const Text: React.FC<TextProps> = ({
  as: Component = 'p',
  variant = 'body',
  weight,
  align,
  color = 'default',
  className,
  children,
  ...rest
}) => {
  const classes = [
    TEXT_VARIANTS[variant],
    color && TEXT_COLORS[color],
    align && TEXT_ALIGN[align],
    weight && TEXT_WEIGHTS[weight],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
};
