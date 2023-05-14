import { SelectValue } from "@radix-ui/react-select";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from "@components/ui/Select";

const YearSelect = ({
  onValueChange,
  value,
  availableYears,
}: {
  onValueChange: (year: number) => void;
  value: number;
  availableYears: number[];
}) => (
    <Select
      onValueChange={(newYear) => {
        onValueChange(Number(newYear));
      }}
      value={value.toString()}
    >
      <SelectTrigger className="max-w-[150px] w-full">
        <SelectValue placeholder="Select year" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {availableYears.map((year) => (
            <SelectItem value={year.toString()} key={year}>
              <p>{year}</p>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );

export default YearSelect;
