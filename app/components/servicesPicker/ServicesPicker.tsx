import { Dispatch, SetStateAction } from "react";

import dynamic from "next/dynamic";

import SectionLabel from "@components/misc/SectionLabel";
import { Separator } from "@components/ui/Separator";
import { Skeleton } from "@components/ui/Skeleton";
import { ShopResponse } from "@interfaces/IPricing";
import {
  findPackagesForYear,
  getSelectedYearProductIDs,
  getSelectedYearProducts,
  summarizePackagesForYear,
} from "@src/lib/servicesHelpers";
import { cn } from "@src/lib/utils";

import ServicesPickerProducts from "./ServicesPickerProducts";
import ServicesSummaryWithPackages from "./ServicesSummaryWithPackages";
import RemoveYearAlertDialog from "../RemoveYearAlertDialog";
import { YearProducts } from "../Services";

const Select = dynamic(() => import("react-select"), {
  ssr: false, //cancelling ssr to prevent hydration error (on the library side)
  loading: () => <Skeleton className="h-10 w-24" />,
});

type SelectOption = {
  label: string;
  value: number;
};

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
  const selectYearOptions = [selectedYear, ...availableYears]
    .sort()
    .map((a) => ({ value: a, label: a.toString() } satisfies SelectOption));
  const selectYearDefaultValue = {
    label: selectedYear.toString(),
    value: selectedYear,
  } satisfies SelectOption;

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
    setSelectedServices((prev) =>
      prev.map((p) => {
        if (p.year !== selectedYear) return p;
        return { ...p, year: newYear };
      })
    );
  };

  if (!selectedYearPrices || !selectedProductIDs || !summary) return null;

  return (
    <div className="flex flex-1 flex-col gap-y-4 w-full">
      <div className="flex gap-y-2 w-full items-center justify-between">
        <SectionLabel>{"Year of services"}</SectionLabel>
        <Select
          className="text-sm"
          onChange={(option) => {
            if (!option) return;
            onValueChange((option as SelectOption).value);
          }}
          defaultValue={selectYearDefaultValue}
          options={selectYearOptions}
          isSearchable={false}
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
