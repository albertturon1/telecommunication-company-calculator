import { Dispatch, SetStateAction, useCallback } from "react";

import { YearProducts } from "@app/components/Services";
import { Product, ProductPrice } from "@interfaces/IPricing";

import ServicesPickerProduct from "./ServicesPickerProductsItem";

const ServicesPickerProducts = ({
  productsPrices,
  products,
  selectedProductIDs,
  setSelectedProducts,
  selectedYear,
}: {
  productsPrices: ProductPrice[];
  products: Product[];
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
        const selectedYearProducts = prev[selectedYearProductsIndex];

        //initialized new object for selected year
        if (selectedYearProductsIndex === -1)
          return [
            ...prev,
            {
              year: selectedYear,
              products: [product],
            },
          ];

        const currentProductIndex = selectedYearProducts.products.findIndex(
          (selectedProduct) => selectedProduct.product_id === product.product_id
        );

        return prev.map((yearProduct) => {
          if (yearProduct.year !== selectedYear) return yearProduct; //skipping data from other years
          if (currentProductIndex === -1)
            //adding product
            return {
              ...yearProduct,
              products: [...yearProduct.products, product],
            };

          //removing product
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
        const productPricing = productsPrices.find(
          (productData) => productData.product_id === product.product_id
        );

        //if product doesn't have a list of required products or already every required product have been selected
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
