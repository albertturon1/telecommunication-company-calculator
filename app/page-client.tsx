"use client";

import { Fragment, useState } from "react";

import { Separator } from "@components/separator";
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
    <main className="flex flex-col gap-y-8 py-4 sm:py-8 lg:py-16">
      {years.map((year, index) => (
        <Fragment key={year}>
          <ServicesPicker
            availableYears={availableYears}
            selectedYear={year}
            pricelist={pricelist}
            setYearProducts={setYearProducts}
            yearProducts={yearProducts}
          />
          {yearProducts.length > 1 && (
            <Button
              variant="destructive"
              onClick={() => {
                setYearProducts((prev) => prev.filter((p) => p.year !== year));
              }}
            >
              <p>{"Remove"}</p>
            </Button>
          )}
          {index !== pricingYears.length - 1 && (
            <div className="w-full self-center">
              <Separator />
            </div>
          )}
        </Fragment>
      ))}
      {availableYears.length > 0 && (
        <Button
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
