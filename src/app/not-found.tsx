import React from "react";
// import { useRouter } from "next/router";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFoundPage = () => {
  //   const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-100 via-gray-300 to-gray-500 text-gray-800">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-6">
        Oops! The page you are looking for does not exist.
      </p>
      <Link
        href="/partner"
        className="flex items-center gap-2 px-6 py-3 text-lg font-medium bg-teal-500 text-white rounded-lg shadow-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 ">
        <ArrowLeft /> Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
