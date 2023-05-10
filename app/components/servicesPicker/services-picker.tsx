"use client";

import { Dispatch, SetStateAction } from "react";

import { YearProducts } from "@app/page-client";
import SectionLabel from "@components/misc/section-label";
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
}: {
  pricelist: ShopResponse;
  availableYears: number[];
  yearProducts: YearProducts[];
  selectedYear: number;
  setYearProducts: Dispatch<SetStateAction<YearProducts[]>>;
}) => {
  const selectedProducts =
    yearProducts.find((yearProduct) => yearProduct.year === selectedYear)
      ?.products ?? [];

  const selectedProductIDs =
    selectedProducts.map((selectedProduct) => selectedProduct.product_id) ?? [];

  const yearPrices = pricelist.pricing.find((y) => y.year === selectedYear);

  if (!yearPrices) return null;
  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <div className="flex flex-col gap-y-2">
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
    </div>
  );
};
