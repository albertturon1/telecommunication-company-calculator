import { Dispatch, SetStateAction } from "react";

import { YearProducts } from "@app/components/services";
import SectionLabel from "@components/misc/section-label";
import { Separator } from "@components/separator";
import { ShopResponse } from "@interfaces/IPricing";
import {
  findPackagesForYear,
  getSelectedYearProductIDs,
  getSelectedYearProducts,
  summarizePackagesForYear,
} from "@src/lib/servicesHelpers";
import { cn } from "@src/lib/utils";

import ServicesPickerProducts from "./services-picker-products";
import ServicesSummaryWithPackages from "./services-summary-with-packages";
import RemoveYearAlertDialog from "../remove-year-alert-dialog";
import YearSelect from "../year-select";

export const ServicesPicker = ({
  pricelist,
  availableYears,
  selectedServices,
  selectedYear,
  setSelectedServices,
  showSeparator,
}: {
  pricelist: ShopResponse;
  availableYears: number[];
  selectedServices: YearProducts[];
  selectedYear: number;
  setSelectedServices: Dispatch<SetStateAction<YearProducts[]>>;
  showSeparator: boolean;
}) => {
  const selectedProducts = getSelectedYearProducts(
    selectedServices,
    selectedYear
  );
  const selectedProductIDs = getSelectedYearProductIDs(selectedProducts);
  const selectedYearPrices = pricelist.pricing.find(
    (y) => y.year === selectedYear
  )?.prices;

  const packages = findPackagesForYear({
    selectedYear,
    selectedServices,
    bundleYears: pricelist.bundles,
    pricingYears: pricelist.pricing,
  });
  const summary = summarizePackagesForYear({
    bundleYears: pricelist.bundles,
    pricingYears: pricelist.pricing,
    selectedYear,
    selectedServices,
  });

  const onValueChange = (newYear: number) => {
    setSelectedServices((prev) => {
      const currentYearProduct = prev.find((p) => p.year === selectedYear);
      return prev.map((p) => {
        if (!currentYearProduct || p.year !== currentYearProduct.year) return p;
        return { ...p, year: newYear };
      });
    });
  };

  if (!selectedYearPrices || !selectedProductIDs || !summary) return null;
  return (
    <div className="flex flex-1 flex-col gap-y-4 w-full">
      <div className="flex gap-y-2 w-full items-center justify-between">
        <SectionLabel>{"Year of services"}</SectionLabel>
        <YearSelect
          onValueChange={onValueChange}
          defaultValue={selectedYear}
          availableYears={[selectedYear, ...availableYears].sort()}
        />
      </div>
      <ServicesPickerProducts
        productsPrices={selectedYearPrices}
        products={pricelist.products}
        selectedProductIDs={selectedProductIDs}
        setSelectedProducts={setSelectedServices}
        selectedYear={selectedYear}
      />
      <ServicesSummaryWithPackages {...summary} packages={packages} />
      <RemoveYearAlertDialog
        selectedProductsLength={selectedProducts?.length ?? 0}
        visible={selectedServices.length > 1}
        onClick={() => {
          setSelectedServices((prev) =>
            prev.filter((p) => p.year !== selectedYear)
          );
        }}
      />
      {/* show separator when selected year is not last available AND selected year has products OR more than 1 year is selected */}
      {showSeparator &&
        ((selectedProducts && selectedProducts.length > 0) ||
          selectedServices.length > 1) && (
          <div
            className={cn(
              "w-full self-center",
              selectedServices.length > 1 && "pt-2" //extra padding when more than 1 year is selected
            )}
          >
            <Separator />
          </div>
        )}
    </div>
  );
};
