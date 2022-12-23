import * as SelectPrimitive from "@radix-ui/react-select";
import ChevronDownIcon from "../assets/chevron-down.svg";

interface SelectProps {
  title: string;
  value: string;
  placeholder: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
}

export default function Select({
  title,
  value,
  items,
  placeholder,
  onValueChange,
}: SelectProps) {
  return (
    <SelectPrimitive.Root onValueChange={onValueChange} value={value}>
      <SelectPrimitive.Trigger
        className="flex max-w-[50%] items-center gap-2 rounded-md bg-neutral-800 px-4 py-1 text-left outline-none"
        aria-label={title}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDownIcon strokeWidth={1.5} className="stroke-current" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="max-w-[95%]">
          <SelectPrimitive.Viewport className="rounded-md bg-neutral-800 p-1.5 text-xs shadow-lg ring-1 ring-neutral-700/50">
            <SelectPrimitive.Group>
              {items.map(({ value, label }) => (
                <SelectPrimitive.Item
                  key={value}
                  value={value}
                  className="cursor-default rounded-md px-2 py-2 outline-none radix-highlighted:bg-blue-500"
                >
                  <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
