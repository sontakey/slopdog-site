import type { ComponentPropsWithoutRef } from "react";

type Props = ComponentPropsWithoutRef<"span"> & {
  name: string;
  size?: number;
};

export default function MaterialIcon({ name, size = 20, className = "", style, ...rest }: Props) {
  return (
    <span
      className={`material-symbols-outlined ${className}`.trim()}
      style={{ fontSize: size, lineHeight: 1, ...(style ?? {}) }}
      aria-hidden="true"
      {...rest}
    >
      {name}
    </span>
  );
}
