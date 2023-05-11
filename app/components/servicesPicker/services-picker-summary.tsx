import { DEFAULT_CURRENCY } from "@components/constants/globals";
import { BundleYear, Package, PricingYear } from "@interfaces/IPricing";

//dodaj zliczenia ile kosztują rzeczy z pakietu osobno, potem porównaj do tego ile kosztują w pakiecie i posortujtak, żeby była jak najwieksza zniżka albo koszt całkowity był najnizszy
function findYearBundles(
  selectedProductIDs: number[],
  yearBundles: BundleYear | undefined
) {
  let temporarySelectedProductIDs = [...selectedProductIDs].sort((a, b) =>
    a > b ? 1 : -1
  );
  const selectedPackages: Package[] = [];
  if (!yearBundles || temporarySelectedProductIDs.length === 0) return;
  const bundlePackagesSorted = yearBundles.packages.sort(
    (a, b) => (a.products.length < b.products.length ? 1 : -1) //descending
  ); //git

  for (const bundlePackage of bundlePackagesSorted) {
    const sortedBundleProducts = bundlePackage.products.sort(
      (a, b) => (a > b ? 1 : -1) //ascending
    );

    if (
      sortedBundleProducts.every((productID) =>
        temporarySelectedProductIDs.includes(productID)
      )
    ) {
      selectedPackages.push(bundlePackage);
      temporarySelectedProductIDs = temporarySelectedProductIDs.filter(
        (productID) => !sortedBundleProducts.includes(productID)
      );
    }
  }

  return selectedPackages;
}

const ServicesPickerSummary = ({
  bundles,
  yearPrices,
  selectedProductIDs,
  selectedYear,
}: {
  bundles: BundleYear[];
  yearPrices: PricingYear;
  selectedProductIDs: number[];
  selectedYear: number;
}) => {
  const summaryPrice = yearPrices.prices.reduce((acc, item) => {
    if (selectedProductIDs.includes(item.product_id))
      // eslint-disable-next-line no-param-reassign
      return (acc += item.price);
    return acc;
  }, 0);
  const yearBundles = bundles.find((y) => y.year === selectedYear);

  const packages = findYearBundles(selectedProductIDs, yearBundles);
  const packagesProductIDs = packages?.flatMap(
    (bundlePackage) => bundlePackage.products
  );

  //price for accumulated prices of all packages
  const packagesPrice = packages?.reduce(
    // eslint-disable-next-line no-param-reassign
    (acc, item) => (acc += item.price),
    0
  );

  const remainingProductIDs = selectedProductIDs.filter(
    (p) => !packagesProductIDs?.includes(p)
  );

  const remainingPrice = yearPrices.prices.reduce((acc, item) => {
    // eslint-disable-next-line no-param-reassign
    if (remainingProductIDs.includes(item.product_id)) acc += item.price;
    return acc;
  }, 0);
  const discountedPrice = (packagesPrice ?? 0) + remainingPrice;

  return (
    <div className="flex flex-col text-sm gap-y-1 px-1 w-full">
      {/* regular pricing */}
      {summaryPrice > 0 && (
        <div className="flex justify-between items-center">
          <p>{packages && packages.length > 0 ? "Regular price" : "Price"}</p>
          <p className="font-semibold">{`${summaryPrice} ${DEFAULT_CURRENCY}`}</p>
        </div>
      )}
      {/* packages pricing */}
      {packages && packages.length > 0 && discountedPrice > 0 && (
        <div className="flex flex-col gap-y-1">
          <div className="flex justify-between items-center">
            <p>{`Discounted price`}</p>
            <p className="font-semibold text-green-600">{`${discountedPrice} ${DEFAULT_CURRENCY}`}</p>
          </div>
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
    </div>
  );
};

export default ServicesPickerSummary;
