import { YearProducts } from "@app/components/services";
import {
  BundleYear,
  Package,
  PricingYear,
  Product,
} from "@interfaces/IPricing";

export function getSelectedYearProducts(
  selectedServices: YearProducts[],
  selectedYear: number
) {
  const yearlyProducts = selectedServices.find(
    (yearProduct) => yearProduct.year === selectedYear
  );
  if (!yearlyProducts) return;
  return yearlyProducts.products;
}

export function getSelectedYearProductIDs(
  selectedProducts: Product[] | undefined
): number[] | undefined {
  if (!selectedProducts) return;
  return selectedProducts.map((selectedProduct) => selectedProduct.product_id);
}

export function findPackagesForYear({
  selectedYear,
  selectedServices,
  bundleYears,
  pricingYears,
}: {
  selectedServices: YearProducts[];
  selectedYear: number;
  bundleYears: BundleYear[];
  pricingYears: PricingYear[];
}) {
  const selectedPackages: Package[] = [] satisfies Package[];
  const selectedProducts = getSelectedYearProducts(
    selectedServices,
    selectedYear
  );
  const selectedProductIDs = getSelectedYearProductIDs(selectedProducts);
  const prices = pricingYears.find((y) => y.year === selectedYear)?.prices;
  const packages = bundleYears.find((y) => y.year === selectedYear)?.packages;

  if (
    !packages ||
    !prices ||
    !selectedProductIDs ||
    selectedProductIDs.length === 0
  )
    return selectedPackages;

  //calculating values of without discounts from multipack
  const packagesPricesWithoutDiscount = packages.flatMap((p) => {
    const priceWithoutDiscount = p.products.reduce((acc, product_id) => {
      const productPricing = prices.find((p) => p.product_id === product_id);
      if (!productPricing) return acc;
      // eslint-disable-next-line no-param-reassign
      acc += productPricing?.price;
      return acc;
    }, 0);

    return {
      ...p,
      priceWithoutDiscount,
      diffrence: priceWithoutDiscount - p.price,
    };
  });

  let temporarySelectedProductIDs = [...selectedProductIDs];
  const bundlePackagesSorted = packagesPricesWithoutDiscount.sort(
    (a, b) => (a.diffrence < b.diffrence ? 1 : -1) //descending
  );

  for (const bundlePackage of bundlePackagesSorted) {
    const sortedBundleProducts = bundlePackage.products.sort(
      (a, b) => (a > b ? 1 : -1) //ascending
    );

    if (
      sortedBundleProducts.every((productID) =>
        temporarySelectedProductIDs.includes(productID)
      )
    ) {
      //removal of unused variables
      const {
        diffrence: _diffrence,
        priceWithoutDiscount: _priceWithoutDiscount,
        ...rest
      } = bundlePackage;

      selectedPackages.push(rest);
      temporarySelectedProductIDs = temporarySelectedProductIDs.filter(
        (productID) => !sortedBundleProducts.includes(productID)
      );
    }
  }

  return selectedPackages;
}

// 2  //88-79
// 3  //129-100

export function summarizePackagesForYear({
  pricingYears,
  bundleYears,
  selectedYear,
  selectedServices,
}: {
  pricingYears: PricingYear[];
  bundleYears: BundleYear[];
  selectedYear: number;
  selectedServices: YearProducts[];
}) {
  const selectedProducts = getSelectedYearProducts(
    selectedServices,
    selectedYear
  );
  const selectedProductIDs = getSelectedYearProductIDs(selectedProducts);
  const prices = pricingYears.find((y) => y.year === selectedYear)?.prices;

  if (!selectedProductIDs || !prices) return;
  const regularPrice = prices.reduce((acc, item) => {
    if (selectedProductIDs.includes(item.product_id))
      // eslint-disable-next-line no-param-reassign
      return (acc += item.price);
    return acc;
  }, 0);

  const packages = findPackagesForYear({
    selectedYear,
    selectedServices,
    bundleYears,
    pricingYears,
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
