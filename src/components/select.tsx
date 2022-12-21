import * as SelectPrimitive from "@radix-ui/react-select";

interface SelectProps {
  value: string;
  placeholder: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
}

export default function Select({
  value,
  items,
  placeholder,
  onValueChange,
}: SelectProps) {
  return (
    <SelectPrimitive.Root onValueChange={onValueChange} value={value}>
      <SelectPrimitive.Trigger
        className="flex items-center justify-center gap-4 overflow-hidden rounded-md bg-neutral-800 px-4 py-1 text-sm"
        aria-label="Video Device"
      >
        <span className="truncate">
          <SelectPrimitive.Value placeholder={placeholder} />
        </span>
        <SelectPrimitive.Icon></SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content>
          <SelectPrimitive.Viewport className="rounded-md bg-neutral-800 p-2 text-sm shadow-lg">
            <SelectPrimitive.Group>
              {items.map(({ value, label }) => (
                <SelectPrimitive.Item
                  key={value}
                  value={value}
                  className="cursor-default rounded-md px-2 py-1 outline-none radix-highlighted:bg-neutral-700"
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
