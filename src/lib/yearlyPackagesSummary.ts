import { YearProducts } from "@app/page-client";
import {
  BundleYear,
  Package,
  PricingYear,
  Product,
  ProductPrice,
} from "@interfaces/IPricing";

export function yearPrices(pricing: PricingYear[], selectedYear: number) {
  return pricing.find((y) => y.year === selectedYear);
}

export function selectedYearlyProducts(
  yearProducts: YearProducts[],
  selectedYear: number
) {
  const yearlyProducts = yearProducts.find(
    (yearProduct) => yearProduct.year === selectedYear
  );
  if (!yearlyProducts) return;
  return yearlyProducts.products;
}

export function selectedYearProductIDs(
  selectedProducts: Product[] | undefined
): number[] | undefined {
  if (!selectedProducts) return;
  return selectedProducts.map((selectedProduct) => selectedProduct.product_id);
}

//dodaj zliczenia ile kosztują rzeczy z pakietu osobno, potem porównaj do tego ile kosztują w pakiecie i posortujtak, żeby była jak najwieksza zniżka albo koszt całkowity był najnizszy
export function findYearlyPackages({
  selectedYear,
  yearProducts,
  yearBundles,
}: {
  yearProducts: YearProducts[];
  selectedYear: number;
  yearBundles: BundleYear | undefined;
}) {
  const selectedProducts = selectedYearlyProducts(yearProducts, selectedYear);
  const selectedProductIDs = selectedYearProductIDs(selectedProducts);
  let temporarySelectedProductIDs = [...(selectedProductIDs ?? [])].sort(
    (a, b) => (a > b ? 1 : -1)
  );
  const selectedPackages: Package[] = [];
  if (!yearBundles || temporarySelectedProductIDs.length === 0)
    return selectedPackages;
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

export function yearlyPackagesSummary({
  prices,
  bundles,
  selectedYear,
  yearProducts,
}: {
  prices: ProductPrice[] | undefined;
  bundles: BundleYear[];
  selectedYear: number;
  yearProducts: YearProducts[];
}) {
  const selectedProducts = selectedYearlyProducts(yearProducts, selectedYear);
  const selectedProductIDs = selectedYearProductIDs(selectedProducts);

  if (!selectedProductIDs || !prices) return;
  const regularPrice = prices.reduce((acc, item) => {
    if (selectedProductIDs.includes(item.product_id))
      // eslint-disable-next-line no-param-reassign
      return (acc += item.price);
    return acc;
  }, 0);

  const yearBundles = bundles.find((y) => y.year === selectedYear);

  const packages = findYearlyPackages({
    selectedYear,
    yearProducts,
    yearBundles,
  });
  const packagesProductIDs = packages?.flatMap(
    (bundlePackage) => bundlePackage.products
  );

  //price for accumulated prices of all packages
  const packagesPrice = packages.reduce(
    // eslint-disable-next-line no-param-reassign
    (acc, item) => (acc += item.price),
    0
  );

  const remainingProductIDs = selectedProductIDs.filter(
    (p) => !packagesProductIDs?.includes(p)
  );

  //remaining price calculated only when at least 1 package is selected
  const remainingPrice = packagesPrice
    ? prices.reduce((acc, item) => {
        if (remainingProductIDs.includes(item.product_id)) {
          // eslint-disable-next-line no-param-reassign
          acc += item.price;
        }
        return acc;
      }, 0)
    : 0;
  const discountedPrice = packagesPrice + remainingPrice;

  return {
    packagesPrice,
    remainingPrice,
    discountedPrice,
    regularPrice,
  };
}
