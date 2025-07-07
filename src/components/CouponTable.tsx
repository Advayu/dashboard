// components/CouponTable.tsx
import React from "react";

type Coupon = {
  code: string;
  status: "active" | "expired" | string;
};

type CouponTableProps = {
  coupons: Coupon[];
};

export default function CouponTable({ coupons }: CouponTableProps) {
  return (
    <div className="max-h-[50vh] overflow-y-auto border rounded-md">
      <table className="min-w-full border-collapse">
        <thead className="shadow-md shadow-gray-500/10 border-b-2 sticky top-0 bg-white z-10">
          <tr className="">
            <th className="text-black font-bold py-3 px-4 text-left border-b">
              Code
            </th>
            <th className="text-black font-bold py-3 px-4 text-left border-b">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {coupons?.map((coupon, index) => (
            <tr key={index} className="hover:bg-gray-50 transition">
              <td className="py-3 px-4 border-b">{coupon.code}</td>
              <td className="py-3 px-4 border-b">
                <span
                  className={`${
                    coupon.status === "active"
                      ? "text-green-500 bg-green-100"
                      : "text-red-500 bg-red-100"
                  } px-2 py-1 rounded-full text-sm font-medium`}>
                  {coupon.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
