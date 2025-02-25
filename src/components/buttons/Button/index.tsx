import { Loading } from "@/components/miscellaneous/Loading";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  isLoading?: boolean;
  icon?: JSX.Element;
}

export function Button({ title, isLoading, icon, ...rest }: ButtonProps) {
  return (
    <button
      className={`w-full h-[52px] flex items-center justify-center bg-primary normal-case lg:text-base text-sm font-medium font-poppins rounded-lg disabled:opacity-[0.5] text-gray-50 font-secondary`}
      {...rest}
    >
      {isLoading ? <Loading hideText /> : title}
      {icon && icon}
    </button>
  );
}
