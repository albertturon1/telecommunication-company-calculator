import { ReactNode } from "react";

import { DEFAULT_CURRENCY } from "@components/constants/globals";
import { cn } from "@src/lib/utils";

const ServicesSummary = ({
  regularPrice,
  regularPriceTitle,
  children,
  containerClassName,
}: {
  regularPrice: number;
  regularPriceTitle: string;
  children?: ReactNode;
  containerClassName?: string;
}) => {
  if (regularPrice === 0) return null;
  return (
    <div
      className={cn(
        "flex flex-col text-sm gap-y-1 px-1 w-full",
        containerClassName
      )}
    >
      {/* regular pricing */}
      <ServicesSummaryRow
        leftText={regularPriceTitle}
        rightText={`${regularPrice} ${DEFAULT_CURRENCY}`}
      />
      {children}
    </div>
  );
};

export type ServicesSummaryRowProps = {
  visible?: boolean;
  leftText: string;
  rightText: string | number;
  containerClassName?: string;
  leftTextClassName?: string;
  rightTextClassName?: string;
};

export const ServicesSummaryRow = ({
  visible = true,
  leftText,
  rightText,
  containerClassName,
  leftTextClassName,
  rightTextClassName,
}: ServicesSummaryRowProps) => {
  if (!visible) return null;
  return (
    <div
      className={cn("flex justify-between items-center", containerClassName)}
    >
      <p className={leftTextClassName}>{leftText}</p>
      <p className={cn("font-semibold", rightTextClassName)}>{rightText}</p>
    </div>
  );
};

export default ServicesSummary;
