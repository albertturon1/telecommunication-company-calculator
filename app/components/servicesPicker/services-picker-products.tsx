import { Dispatch, SetStateAction, useCallback } from "react";

import { YearProducts } from "@app/page-client";
import { PricingYear, Product } from "@interfaces/IPricing";

import ServicesPickerProduct from "./services-picker-product";

const ServicesPickerProducts = ({
  yearPrices,
  products,
  selectedProductIDs,
  setSelectedProducts,
  selectedYear,
}: {
  products: Product[];
  yearPrices: PricingYear;
  selectedProductIDs: number[];
  setSelectedProducts: Dispatch<SetStateAction<YearProducts[]>>;
  selectedYear: number;
}) => {
  const onProductClick = useCallback(
    (product: Product) => {
      setSelectedProducts((prev) => {
        const selectedYearProductsIndex = prev.findIndex(
          (p) => p.year === selectedYear
        );
        const selectedYearlyProducts = prev[selectedYearProductsIndex];

        //selected year hasnt been initialized
        if (selectedYearProductsIndex === -1)
          return [
            ...prev,
            {
              year: selectedYear,
              products: [product],
            },
          ];

        const currentProductIndex = selectedYearlyProducts.products.findIndex(
          (selectedProduct) => selectedProduct.product_id === product.product_id
        );

        //product hasn't been already selected
        return prev.map((yearProduct) => {
          if (yearProduct.year !== selectedYear) return yearProduct;
          if (currentProductIndex === -1)
            return {
              ...yearProduct,
              products: [...yearProduct.products, product],
            };
          return {
            ...yearProduct,
            products: yearProduct.products.filter(
              (p) => p.product_id !== product.product_id
            ),
          };
        });
      });
    },
    [selectedYear, setSelectedProducts]
  );

  return (
    <div className="flex flex-col gap-3 w-full">
      {products.map((product) => {
        const productPricing = yearPrices.prices.find(
          (productData) => productData.product_id === product.product_id
        );

        //if product doesnt have list of required other products or alread ever required product have been selected
        const showProduct =
          !product.required ||
          product.required.every((product_id) =>
            selectedProductIDs.includes(product_id)
          );

        if (!productPricing || !showProduct) return null; //no data for pricing for product
        return (
          <ServicesPickerProduct
            key={product.product_id}
            name={product.name}
            price={productPricing.price}
            onButtonClick={() => {
              onProductClick(product);
            }}
            selected={selectedProductIDs.includes(product.product_id)}
          />
        );
      })}
    </div>
  );
};

export default ServicesPickerProducts;
