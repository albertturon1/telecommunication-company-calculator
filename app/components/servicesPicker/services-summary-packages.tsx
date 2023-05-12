import { DEFAULT_CURRENCY } from "@components/constants/globals";
import ServicesSummary, {
  ServicesSummaryRow,
} from "@components/misc/services-summary";
import { Package } from "@interfaces/IPricing";

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
  >
    {packages && packages.length > 0 && discountedPrice > 0 && (
      <div className="flex flex-col gap-y-1">
        <ServicesSummaryRow
          rightTextClassName="text-discount"
          leftText={"Discounted price"}
          rightText={`${discountedPrice} ${DEFAULT_CURRENCY}`}
        />
        {/* show extra information about packages */}
        {(packages.length > 1 || remainingPrice > 0) && (
          <>
            {packages.map((bundlePackage) => (
              <div
                className="flex justify-between items-center text-black/80 text-xs gap-x-1"
                key={bundlePackage.package_id}
              >
                <p>{bundlePackage.name}</p>
                <p className="font-semibold min-w-[50px] text-end">{`${bundlePackage.price} ${DEFAULT_CURRENCY}`}</p>
              </div>
            ))}
            {remainingPrice > 0 && (
              <div className="flex justify-between items-center text-black/80 text-xs gap-x-1">
                <p>{"Rest"}</p>
                <p className="font-semibold min-w-[50px] text-end">{`${remainingPrice} ${DEFAULT_CURRENCY}`}</p>
              </div>
            )}
          </>
        )}
      </div>
    )}
  </ServicesSummary>
);

export default ServicesSummaryWithPackages;
