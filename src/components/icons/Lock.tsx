import React from "react";
type LockProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
  color?: string;
};
const Lock: React.FC<LockProps> = ({
  size = 24,
  color = "#000",
  className = "",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}>
      <path
        d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14a1 1 0 0 1 1 1v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a1 1 0 0 1 1-1z"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Lock;
