import React from "react";

const OrDivider = () => {
  return (
    <div className="relative flex items-center my-4 w-full">
      <div className="h-[2px] w-full bg-gray-300/50 rounded" />
      <span className="absolute left-1/2 -translate-x-1/2 bg-white px-3 text-gray-400 text-xs font-medium">
        OR
      </span>
    </div>
  );
};

export default OrDivider;
