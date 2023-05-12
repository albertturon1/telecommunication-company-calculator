"use client";

import { useState } from "react";

import { Button } from "@components/ui/button";
import { Product, ShopResponse } from "@interfaces/IPricing";
import { cn } from "@src/lib/utils";

import AllServicesSummary from "./components/all-services-summary";
import ServicesPicker from "./components/servicesPicker";

export type YearProducts = {
  year: number;
  products: Product[];
};

const PageClient = ({ pricelist }: { pricelist: ShopResponse }) => {
  const pricingYears = pricelist.pricing.map((y) => y.year);

  const [yearProducts, setYearProducts] = useState<YearProducts[]>([
    { year: pricingYears[0], products: [] },
  ]);

  const selectedYears = yearProducts.map((y) => y.year);
  const availableYears = pricingYears.filter((p) => !selectedYears.includes(p));

  const addNextYear = () => {
    setYearProducts((prev) => [
      ...prev,
      { year: availableYears[0], products: [] },
    ]);
  };
  const productsLength = yearProducts.flatMap((y) => y.products).length;
  return (
    // padding so that AllServicesSummary does not obscure the elements below itself
    <main className={cn(productsLength > 0 ? "pb-36" : "pb-10")}>
      <div className="flex flex-col py-4 sm:py-8 lg:py-16 w-full items-center gap-y-8">
        {selectedYears.map((year, index) => (
          <div key={year} className="self-center max-w-md w-full">
            <ServicesPicker
              availableYears={availableYears}
              selectedYear={year}
              pricelist={pricelist}
              setYearProducts={setYearProducts}
              yearProducts={yearProducts}
              showSeparator={index !== pricingYears.length - 1}
            />
          </div>
        ))}
        {availableYears.length > 0 && (
          <Button className="self-center" onClick={addNextYear}>
            <p>{"Add next year"}</p>
          </Button>
        )}
        <AllServicesSummary
          yearProducts={yearProducts}
          pricing={pricelist.pricing}
          bundles={pricelist.bundles}
        />
      </div>
    </main>
  );
};

export default PageClient;
