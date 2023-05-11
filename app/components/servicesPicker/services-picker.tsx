"use client";

import { Dispatch, SetStateAction } from "react";

import { YearProducts } from "@app/page-client";
import SectionLabel from "@components/misc/section-label";
import { Separator } from "@components/separator";
import { Button } from "@components/ui/button";
import { ShopResponse } from "@interfaces/IPricing";

import ServicesPickerProducts from "./services-picker-products";
import ServicesPickerSummary from "./services-picker-summary";
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
  const selectedProducts =
    yearProducts.find((yearProduct) => yearProduct.year === selectedYear)
      ?.products ?? [];

  const selectedProductIDs =
    selectedProducts.map((selectedProduct) => selectedProduct.product_id) ?? [];

  const yearPrices = pricelist.pricing.find((y) => y.year === selectedYear);

  if (!yearPrices) return null;
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
        yearPrices={yearPrices}
        products={pricelist.products}
        selectedProductIDs={selectedProductIDs}
        setSelectedProducts={setYearProducts}
        selectedYear={selectedYear}
      />
      <ServicesPickerSummary
        bundles={pricelist.bundles}
        yearPrices={yearPrices}
        selectedProductIDs={selectedProductIDs}
        selectedYear={selectedYear}
      />
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
      {/* show separator when year is not last available and on selected year are any products OR more than 1 year is selected */}
      {showSeparator &&
        (selectedProducts.length > 0 || yearProducts.length > 1) && (
          <div className="w-full self-center pt-4">
            <Separator />
          </div>
        )}
    </div>
  );
};
