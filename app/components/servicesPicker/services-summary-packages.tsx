import ServicesSummary, {
  ServicesSummaryRow,
} from "@components/misc/services-summary";
import { DEFAULT_CURRENCY } from "@constants/globals";
import { Package } from "@interfaces/IPricing";
import { cn } from "@src/lib/utils";

const ServicesSummaryWithPackages = ({
  remainingPrice,
  discountedPrice,
  regularPrice,
  packages,
}: {
  remainingPrice: number;
  discountedPrice: number;
  regularPrice: number;
  packages: Package[];
}) => (
  <ServicesSummary
    regularPrice={regularPrice}
    regularPriceTitle={
      packages && packages.length > 0 ? "Regular price" : "Price"
    }
    containerClassName="px-4"
  >
    {packages && (
      <div className="flex flex-col gap-y-1">
        {packages.length > 0 && (
          <ServicesSummaryRow
            rightTextClassName="text-discount"
            leftText={"Discounted price"}
            rightText={`${discountedPrice} ${DEFAULT_CURRENCY}`}
          />
        )}
        {packages.length > 1 &&
          packages.map((bundlePackage) => (
            <DiscountRow
              key={bundlePackage.package_id}
              leftText={bundlePackage.name}
              rightText={`${bundlePackage.price} ${DEFAULT_CURRENCY}`}
            />
          ))}
        {remainingPrice > 0 && (
          <DiscountRow
            leftText={"Rest"}
            rightText={`${remainingPrice} ${DEFAULT_CURRENCY}`}
          />
        )}
      </div>
    )}
  </ServicesSummary>
);

const DiscountRow = ({
  className,
  leftText,
  rightText,
}: {
  className?: string;
  leftText: string;
  rightText: string | number;
}) => (
  <div
    className={cn(
      "flex justify-between items-center text-black/80 text-xs gap-x-1",
      className
    )}
  >
    <p>{leftText}</p>
    <p className={"font-semibold min-w-[50px] text-end"}>{rightText}</p>
  </div>
);

export default ServicesSummaryWithPackages;
