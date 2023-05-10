"use client";

import { useState } from "react";

import { Separator } from "@components/separator";
import { Product, ShopResponse } from "@interfaces/IPricing";

import ServicesPickerProducts from "./services-picker-products";
import ServicesPickerSummary from "./services-picker-summary";
import YearSelect from "../year-select";
import SectionLabel from "@components/misc/section-label";

export const ServicesPicker = ({
  pricelist,
  availableYears,
  alreadyUsedYears,
}: {
  pricelist: ShopResponse;
  availableYears: number[];
  alreadyUsedYears: number[];
}) => {
  const pricingYears = pricelist.pricing.map((y) => y.year);

  const [selectedYear, setSelectedYear] = useState(pricingYears[0]);

  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const selectedProductIDs = selectedProducts.map(
    (selectedProduct) => selectedProduct.product_id
  );

  console.log("---------------");
  console.log(selectedYear);
  console.log(JSON.stringify(selectedProducts, null, 2));

  const yearPrices = pricelist.pricing.find((y) => y.year === selectedYear);

  if (!yearPrices) return null;
  return (
    <div className="flex flex-1 flex-col gap-y-3">
      <div className="flex flex-col gap-y-2 mb-6">
        <SectionLabel>{"Year of services"}</SectionLabel>
        <YearSelect
          onValueChange={setSelectedYear}
          defaultValue={availableYears[0]}
          availableYears={pricingYears}
        />
      </div>
      <ServicesPickerProducts
        yearPrices={yearPrices}
        products={pricelist.products}
        selectedProductIDs={selectedProductIDs}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />
      <ServicesPickerSummary
        bundles={pricelist.bundles}
        yearPrices={yearPrices}
        selectedProductIDs={selectedProductIDs}
        selectedYear={selectedYear}
      />
      <div className="w-full self-center pt-2">
        <Separator />
      </div>
    </div>
  );
};
