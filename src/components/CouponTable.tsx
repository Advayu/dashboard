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
    <div className="rounded-lg border bg-white shadow-sm max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 px-4">Coupon Codes</h2>{" "}
      {/* Title moved here */}
      <table className="w-full text-sm table-fixed border-collapse">
        <thead className="shadow-md shadow-gray-500/10 border-b-2 sticky top-0 z-10 ">
          <tr className="bg-white">
            <th className="text-black font-bold py-3 px-4 text-left border-b">
              Code
            </th>
            <th className="text-black font-bold py-3 px-4 text-left border-b">
              Status
            </th>
          </tr>
        </thead>
        <tbody className="p-4">
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
