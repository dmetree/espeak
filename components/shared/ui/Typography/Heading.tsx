import * as React from 'react';

export type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingAlign = 'left' | 'center' | 'right';

export type HeadingWeight = 'regular' | 'bold';

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Visual style */
  variant?: HeadingVariant;
  /** Semantic HTML element – defaults to follow the variant */
  as?: HeadingVariant;
  align?: HeadingAlign;
  /** Font weight override (normal vs bold token) */
  weight?: HeadingWeight;
  className?: string;
  children: React.ReactNode;
}

// Typography from Figma tokens (Helvetica, 150% line-height)
// Title      80px
// Heading1   61px
// Heading2   47px
// Heading3   36px
// Heading4   27px
// Body       21px (used here for h6)
const HEADING_VARIANTS: Record<HeadingVariant, string> = {
  h1: 'text-[80px] leading-[150%]',
  h2: 'text-[61px] leading-[150%]',
  h3: 'text-[47px] leading-[150%]',
  h4: 'text-[36px] leading-[150%]',
  h5: 'text-[27px] leading-[150%]',
  h6: 'text-[21px] leading-[150%]',
};

const HEADING_ALIGN: Record<HeadingAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const HEADING_WEIGHT: Record<HeadingWeight, string> = {
  regular: 'font-normal',
  bold: 'font-bold',
};

export const Heading: React.FC<HeadingProps> = ({
  variant = 'h2',
  as,
  align,
  weight = 'regular',
  className,
  children,
  ...rest
}) => {
  const Component = as ?? variant;

  const classes = [
    HEADING_VARIANTS[variant],
    HEADING_WEIGHT[weight],
    align && HEADING_ALIGN[align],
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
