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
      <div className="flex flex-col py-4 sm:pb-8 lg:pb-16 w-full items-center gap-y-6 xl:gap-y-8 container mx-auto">
        <div className="flex flex-col gap-y-3 flex-wrap max-w-2xl mb-5">
          <h1 className="text-2xl font-semibold">{"Services"}</h1>
          <p className="text-lg">
            {
              "Our customizable telecommunication packages allow you to choose the services you want, at a price that fits your budget"
            }
          </p>
        </div>
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
        {availableYears.length > 0 && productsLength > 0 && (
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
