import { promises as fs } from "fs";
import path from "path";

import { ShopResponse } from "@interfaces/IPricing";

import Landing from "./components/landing";
import Error from "./error";
import PageClient from "./page-client";

export const revalidate = 0;

async function getPricelist() {
  const jsonDirectory = path.join(process.cwd(), "json");
  //Read the json data file data.json
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
      <PageClient pricelist={pricelist} />
    </div>
  );
}
