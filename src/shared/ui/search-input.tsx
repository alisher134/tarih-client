import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/shared/ui/input-group";
import { cn } from "cn";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
} & React.ComponentProps<"input">;

export function SearchInput({
  placeholder = "Поиск...",
  className,
  ...props
}: SearchInputProps) {
  return (
    <InputGroup className={cn("w-full", className)}>
      <InputGroupInput placeholder={placeholder} {...props} />

      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
    </InputGroup>
  );
}
