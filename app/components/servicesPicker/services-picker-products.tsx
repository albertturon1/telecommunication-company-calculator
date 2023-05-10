import { Dispatch, SetStateAction, useCallback } from "react";

import { PricingYear, Product } from "@interfaces/IPricing";

import ServicesPickerProduct from "./services-picker-product";

const ServicesPickerProducts = ({
  yearPrices,
  products,
  selectedProductIDs,
  selectedProducts,
  setSelectedProducts,
}: {
  products: Product[];
  yearPrices: PricingYear;
  selectedProductIDs: number[];
  selectedProducts: Product[];
  setSelectedProducts: Dispatch<SetStateAction<Product[]>>;
}) => {
  const onProductClick = useCallback(
    (product: Product) => {
      setSelectedProducts((prev) => {
        const currentProductIndex = selectedProducts.findIndex(
          (selectedProduct) => selectedProduct.product_id === product.product_id
        );

        if (currentProductIndex === -1) {
          //product hasn't been already selected
          return [...prev, product];
        } else
          return selectedProducts.filter(
            (selectedProduct) =>
              selectedProduct.product_id !== product.product_id
          );
      });
    },
    [selectedProducts, setSelectedProducts]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 w-full">
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
