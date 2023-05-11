"use client";

import { useState } from "react";

import { Button } from "@components/ui/button";
import { Product, ShopResponse } from "@interfaces/IPricing";

import ServicesPicker from "./components/servicesPicker";

export type YearProducts = {
  year: number;
  products: Product[];
};

const PageClient = ({ pricelist }: { pricelist: ShopResponse }) => {
  const pricingYears = pricelist.pricing.map((y) => y.year);
  const [summaryPrice, setSummaryPrice] = useState(0);
  const [yearProducts, setYearProducts] = useState<YearProducts[]>([
    { year: pricingYears[0], products: [] },
  ]);

  const years = yearProducts.map((y) => y.year);
  const availableYears = pricingYears.filter((p) => !years.includes(p));

  return (
    <main className="flex flex-col py-4 sm:py-8 lg:py-16 w-full flex-col items-center gap-y-8 ">
      {years.map((year, index) => (
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
        <Button
          className="self-center"
          onClick={() => {
            setYearProducts((prev) => [
              ...prev,
              { year: availableYears[0], products: [] },
            ]);
          }}
        >
          <p>{"Add next year"}</p>
        </Button>
      )}
      {!!summaryPrice && (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <p>{"Services selected:"}</p>
          </div>
          <p>{`Final summaryPrice: ${summaryPrice}`}</p>
        </div>
      )}
    </main>
  );
};

export default PageClient;
