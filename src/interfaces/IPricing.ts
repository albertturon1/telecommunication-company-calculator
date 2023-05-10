export type Product = {
  product_id: number;
  name: string;
  required: number[]; //foreign product id
};

export type ProductPrice = {
  price: number;
} & Pick<Product, "product_id">;

export type PricingYear = {
  year: number;
  prices: ProductPrice[];
};

export type BundleYear = {
  year: number;
  packages: Package[];
};

export type Package = {
  package_id: number;
  name: string;
  products: number[];
  price: number;
};

export type ShopResponse = {
  products: Product[];
  pricing: PricingYear[];
  bundles: BundleYear[];
};
