import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  btnCover?: 'primary-button' | 'secondary-button',
  btnStyle?: "outline" | "fill" | "rounded-fill";
  icon?: React.ReactNode;
  showLogo?: boolean;
  textColor?: string;
  color?: string;
}

const GetColorsAndTextColors = (btnCover: string | undefined, btnStyle: string) => {
  if (btnCover === "secondary-button") {
    return {
      color: "bg-[#e5f2fb]",
      textColor: "text-[#4476c8]",
      hoverColor: "hover:bg-[#e5f2fb]",
      hoverTextColor: "hover:text-[#4476c8]",
      borderColor: "border-[#e5f2fb]",
      hoverBorderColor: "hover:border-[#e5f2fb]",
    };
  }
  return {
    color: "bg-primary",
    textColor: "text-white",
    hoverColor: "hover:bg-black",
    hoverTextColor: "hover:text-primary",
    borderColor: "border-primary",
    hoverBorderColor: "hover:border-primary",
  };
};

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  btnCover = "primary-button",
  type = "button",
  btnStyle = "outline",
  icon,
  showLogo = false,
  color,
  textColor,
  ...rest
}) => {
  const styles = GetColorsAndTextColors(btnCover, btnStyle);
  
  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "text-sm md:text-base px-4 py-2 rounded-md cursor-pointer",
        btnStyle === "fill"
          ? "bg-tertiary text-white" :
          btnStyle === "rounded-fill"
          ? `${styles.color} ${styles.textColor} font-bold rounded-full border ${styles.borderColor} hover:bg-white ${styles.hoverTextColor} ${styles.hoverBorderColor} dark:hover:bg-tertiary transition-all duration-300` :
          btnStyle === "outline"
          ? "border border-gray-300 text-gray-700"
          : "bg-[#F1F1F1] text-[#24252680]",
        icon && "flex items-center justify-between",
        className
      )}
      style={color ? {
        color: textColor,
        backgroundColor: color,
      } : undefined}
      {...rest}
    >
        {icon && <span className="mr-2 w-4 h-4">{icon}</span>}
        {children}
    </button>
  );
};

export default Button;
