"use client";

import { useState } from "react";

import { ShopResponse } from "@interfaces/IPricing";

import ServicesPicker from "./components/servicesPicker";

export type YearProducts = {
  year: number;
  product_ids: number[];
};

const PageClient = ({ pricelist }: { pricelist: ShopResponse }) => {
  const pricingYears = pricelist.pricing.map((y) => y.year);
  const [price, setPrice] = useState(0);
  const [services, setServices] = useState<YearProducts[]>([]);

  const alreadyUsedYears = services.map((y) => y.year);
  const availableYears = pricingYears.filter(
    (year) => !alreadyUsedYears.includes(year)
  );

  return (
    <main className="flex flex-col gap-y-6 py-4 sm:py-8 lg:py-16">
      <ServicesPicker
        alreadyUsedYears={alreadyUsedYears}
        availableYears={availableYears}
        pricelist={pricelist}
      />

      {!!price && (
        <div className="flex flex-col gap-y-2">
          <div className="flex flex-col gap-y-1">
            <p>{"Services selected:"}</p>
          </div>
          <p>{`Final price: ${price}`}</p>
        </div>
      )}
    </main>
  );
};

export default PageClient;
