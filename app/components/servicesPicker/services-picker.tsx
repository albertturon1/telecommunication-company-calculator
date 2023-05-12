"use client";

import { Dispatch, SetStateAction } from "react";

import { YearProducts } from "@app/page-client";
import SectionLabel from "@components/misc/section-label";
import { Separator } from "@components/separator";
import { Button } from "@components/ui/button";
import { ShopResponse } from "@interfaces/IPricing";
import { cn } from "@src/lib/utils";
import {
  findYearlyPackages,
  selectedYearProductIDs,
  selectedYearlyProducts,
  yearPrices,
  yearlyPackagesSummary,
} from "@src/lib/yearlyPackagesSummary";

import ServicesPickerProducts from "./services-picker-products";
import ServicesSummaryWithPackages from "./services-summary-packages";
import YearSelect from "../year-select";

export const ServicesPicker = ({
  pricelist,
  availableYears,
  yearProducts,
  selectedYear,
  setYearProducts,
  showSeparator,
}: {
  pricelist: ShopResponse;
  availableYears: number[];
  yearProducts: YearProducts[];
  selectedYear: number;
  setYearProducts: Dispatch<SetStateAction<YearProducts[]>>;
  showSeparator: boolean;
}) => {
  const selectedProducts = selectedYearlyProducts(yearProducts, selectedYear);
  const selectedProductIDs = selectedYearProductIDs(selectedProducts);
  const selectedYearPrices = yearPrices(pricelist.pricing, selectedYear);

  const yearBundles = pricelist.bundles.find((y) => y.year === selectedYear);
  const packages = findYearlyPackages({
    selectedYear,
    yearProducts,
    yearBundles,
  });
  const summary = yearlyPackagesSummary({
    bundles: pricelist.bundles,
    prices: selectedYearPrices?.prices,
    selectedYear,
    yearProducts,
  });

  if (!selectedYearPrices || !selectedProductIDs || !summary) return null;
  return (
    <div className="flex flex-1 flex-col gap-y-4 w-full">
      <div className="flex gap-y-2 w-full items-center justify-between">
        <SectionLabel>{"Year of services"}</SectionLabel>
        <YearSelect
          onValueChange={(newYear) => {
            setYearProducts((prev) => {
              const currentYearProduct = prev.find(
                (p) => p.year === selectedYear
              );
              return prev.map((p) => {
                if (!currentYearProduct || p.year !== currentYearProduct.year)
                  return p;
                return { ...p, year: newYear };
              });
            });
          }}
          defaultValue={selectedYear}
          availableYears={[selectedYear, ...availableYears].sort()}
        />
      </div>
      <ServicesPickerProducts
        yearPrices={selectedYearPrices}
        products={pricelist.products}
        selectedProductIDs={selectedProductIDs}
        setSelectedProducts={setYearProducts}
        selectedYear={selectedYear}
      />
      <ServicesSummaryWithPackages {...summary} packages={packages} />
      {yearProducts.length > 1 && (
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            setYearProducts((prev) =>
              prev.filter((p) => p.year !== selectedYear)
            );
          }}
        >
          <p>{"Remove"}</p>
        </Button>
      )}
      {/* show separator when selected year is not last available and selected year has products OR more than 1 year is selected */}
      {showSeparator &&
        ((selectedProducts && selectedProducts.length > 0) ||
          yearProducts.length > 1) && (
          <div
            className={cn(
              "w-full self-center",
              yearProducts.length > 1 && "pt-2" //extra padding when more than 1 year is selected
            )}
          >
            <Separator />
          </div>
        )}
    </div>
  );
};
