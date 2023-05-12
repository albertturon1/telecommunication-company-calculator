import { ShopResponse } from "@interfaces/IPricing";

import Landing from "./components/landing";
import Error from "./error";
import PageClient from "./page-client";

export const revalidate = 0;

async function getPricelist() {
  return (await fetch(`http://localhost:3000/pricing.json`).then((res) =>
    res.json()
  )) as ShopResponse | undefined;
}

export default async function Home() {
  const pricelist = await getPricelist();

  if (!pricelist) return Error;
  return (
    <div>
      <Landing />
      <PageClient pricelist={pricelist} />
    </div>
  );
}
