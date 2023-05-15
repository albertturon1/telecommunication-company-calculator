"use client";

import { useState } from "react";

import { Button } from "@components/ui/Button";
import { Product, ShopResponse } from "@interfaces/IPricing";
import { cn } from "@src/lib/utils";

import AllServicesSummary from "./AllServicesSummary";
import ServicesPicker from "./servicesPicker";

export type YearProducts = {
  year: number;
  products: Product[];
};

const Services = ({ pricelist }: { pricelist: ShopResponse }) => {
  const pricingYears = pricelist.pricing.map((y) => y.year);

  const [selectedServices, setSelectedServices] = useState<YearProducts[]>([
    { year: pricingYears[0], products: [] },
  ]);

  const selectedYears = selectedServices.map((yearProduct) => yearProduct.year);
  const availableYears = pricingYears
    .filter((year) => !selectedYears.includes(year))
    .sort();
  const allSelectedProductsLength = selectedServices.flatMap(
    (y) => y.products
  ).length;

  const addNextYear = () => {
    setSelectedServices((prev) => [
      ...prev,
      { year: availableYears[0], products: [] }, //setting next available year as default
    ]);
  };

  return (
    // padding so that AllServicesSummary does not obscure the elements below itself
    <main className={cn(allSelectedProductsLength > 0 ? "pb-36" : "pb-10")}>
      <div className="flex flex-col py-4 sm:pb-8 lg:pb-16 w-full items-center gap-y-6 xl:gap-y-8">
        {selectedYears.map((year, index) => (
          <div key={year} className="self-center max-w-md w-full">
            <ServicesPicker
              availableYears={availableYears}
              selectedYear={year}
              pricelist={pricelist}
              setSelectedServices={setSelectedServices}
              selectedServices={selectedServices}
              showSeparator={index !== pricingYears.length - 1}
            />
          </div>
        ))}
        {availableYears.length > 0 && allSelectedProductsLength > 0 && (
          <Button className="self-center" onClick={addNextYear}>
            <p>{"Add next year"}</p>
          </Button>
        )}
        <AllServicesSummary
          selectedServices={selectedServices}
          pricingYears={pricelist.pricing}
          bundleYears={pricelist.bundles}
        />
      </div>
    </main>
  );
};

export default Services;
