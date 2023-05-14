import { promises as fs } from "fs";
import path from "path";

import PagePadding from "@components/misc/page-padding";
import { ShopResponse } from "@interfaces/IPricing";

import Landing from "./components/landing";
import Services from "./components/services";
import ServicesHeader from "./components/services-header";
import Error from "./error";

export const revalidate = 0;

async function getPricelist() {
  const jsonDirectory = path.join(process.cwd(), "json");

  const fileContents = await fs.readFile(
    `${jsonDirectory}/pricing.json`,
    "utf8"
  );

  return JSON.parse(fileContents) as ShopResponse;
}

export default async function Home() {
  const pricelist = await getPricelist();

  if (!pricelist) return Error;
  return (
    <div>
      <Landing />
      <PagePadding>
        <ServicesHeader />
        <Services pricelist={pricelist} />
      </PagePadding>
    </div>
  );
}
