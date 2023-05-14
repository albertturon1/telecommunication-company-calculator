import { YearProducts } from "@app/components/Services";
import ServicesSummary, {
  ServicesSummaryRow,
} from "@components/misc/ServicesSummary";
import { DEFAULT_CURRENCY } from "@constants/globals";
import { BundleYear, PricingYear } from "@interfaces/IPricing";
import { summarizePackagesForYear } from "@src/lib/servicesHelpers";
import { cn } from "@src/lib/utils";

const AllServicesSummary = ({
  pricingYears,
  bundleYears,
  selectedServices,
}: {
  selectedServices: YearProducts[];
  pricingYears: PricingYear[];
  bundleYears: BundleYear[];
}) => {
  const allYearsSummary = selectedServices.map((y) =>
    summarizePackagesForYear({
      selectedYear: y.year,
      pricingYears,
      selectedServices,
      bundleYears,
    })
  );

  const c = allYearsSummary.reduce(
    (acc, item) => {
      if (!item) return acc;
      acc.remainingPrice += item.remainingPrice;
      acc.discountedPrice += item.discountedPrice;
      acc.regularPrice += item.regularPrice;
      return acc;
    },
    { remainingPrice: 0, discountedPrice: 0, regularPrice: 0 }
  );

  return (
    <div
      className={cn(
        "fixed z-10 w-full pt-4 pb-6 flex flex-col border-t border-border bg-muted transition-all duration-150",
        c.regularPrice === 0 ? "-bottom-96" : "bottom-0"
      )}
    >
      <div className="container max-w-xl mx-auto flex flex-col gap-y-4">
        <h1 className="text-lg font-medium">{"Summary of services pricing"}</h1>
        <ServicesSummary
          {...c}
          regularPriceTitle={c.discountedPrice > 0 ? "Regular price" : "Price"}
        >
          <ServicesSummaryRow
            rightTextClassName="text-discount"
            visible={c.discountedPrice > 0}
            leftText={"Discounted price"}
            rightText={`${c.discountedPrice} ${DEFAULT_CURRENCY}`}
          />
        </ServicesSummary>
      </div>
    </div>
  );
};

export default AllServicesSummary;
