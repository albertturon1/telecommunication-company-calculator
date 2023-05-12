import { MinusCircle, PlusCircle } from "lucide-react";

import { Button } from "@components/ui/button";
import { DEFAULT_CURRENCY } from "@constants/globals";
import Theme from "@src/Theme";

const ServicesPickerProduct = ({
  name,
  onButtonClick,
  price,
  selected,
}: {
  name: string;
  onButtonClick: () => void;
  price: number;
  selected: boolean;
}) => (
  <Button
    onClick={(e) => {
      e.stopPropagation();
      onButtonClick();
    }}
    variant="outline"
  >
    <div className="flex w-full items-center justify-between gap-x-3">
      {selected ? (
        <MinusCircle color="red" />
      ) : (
        <PlusCircle color={Theme.colors.deep_blue} />
      )}
      <p>{name}</p>
      <p>{`${price} ${DEFAULT_CURRENCY}`}</p>
    </div>
  </Button>
);

export default ServicesPickerProduct;
