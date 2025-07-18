"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { styled } from "@mui/material/styles";
import { ChevronRight } from "lucide-react";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Link from "next/link";
import { Power } from "lucide-react";
import { useLogout } from "@/hooks/use-auth";
import { useRole } from "@/hooks/use-role";
interface SettingProps {
  // Define your props here
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: "4rem",
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles("dark", {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: "4rem",
    backgroundColor: "#199EAD",
    ...theme.applyStyles("dark", {
      backgroundColor: "#D9D9D9",
    }),
  },
}));

export default function Page() {
  const { isAdmin } = useRole();
  const { mutate: logout } = useLogout()



  return (
    <div className="md:w-[93%] w-full flex flex-col md:pl-[2.5rem] mt-[4rem] md:pr-[1rem] px-5">
      <div className="flex items-center md:flex-row justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
        <div className="flex space-x-[1.5rem] items-center mt-[1rem] md:mt-0">
          <div className="flex items-center relative">

            <button
              type="button"
              onClick={() => logout()}
              className="flex gap-2 items-center bg-gray-100 px-4 py-2 rounded-lg cursor-pointer">
              <Power /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-full md:max-w-[60vw] bg-[#F3F3F3] p-[1.5rem] rounded-lg mt-[0.9375rem]">
        <h2 className="text-[1.3125rem] font-bold">Profile completion</h2>
        <p className="font-normal text-[1rem] mt-[0.9375rem]">
          Maximize your visibility: Complete your profile and watch your brand
          soar on Advayu!
          <br />
          Unlock our powerful management tools to supercharge your success.
        </p>
        <div className="flex items-center space-x-[1rem] my-[1.5rem]">
          <p className="font-bold text-[2rem]">30%</p>
          <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <BorderLinearProgress variant="determinate" value={30} />
          </Stack>
        </div>
        <Button className="w-[12rem] text-[1.125rem] font-bold">
          Complete profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] mt-[2.0625rem] gap-x-2">
        <div className="space-y-[1rem]">
          {[
            { name: "Profile", link: "profile" },
            {
              name: "Brand",
              link: `brand/edit`,
            },
            { name: "Offers", link: "offers" },
          ].map((item, idx) => (
            <Link
              href={item.link}
              key={idx}
              className=" group w-full max-w-md flex items-center justify-between px-[1rem] py-[0.75rem] rounded-xl border border-black bg-white">
              <span className="text-xl text-gray-900">{item.name}</span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform ease-in-out h-[1.5rem] w-[1.5rem]" />
            </Link>
          ))}
        </div>
        <div className="space-y-[1rem] md:mt-0 mt-[1.5rem]">
          <Link
            href={"store/all"}
            className=" group w-full max-w-md flex items-center justify-between px-[1rem] py-[0.75rem] rounded-xl border border-black bg-white">
            <span className="text-xl text-gray-900">{"Outlets"}</span>
            <ChevronRight className="group-hover:translate-x-2 transition-transform ease-in-out h-[1.5rem] w-[1.5rem]" />
          </Link>
          {isAdmin && (
            <Link
              href={`/manage-users`}
              className=" group w-full max-w-md flex items-center justify-between px-[1rem] py-[0.75rem] rounded-xl border border-black bg-white">
              <span className="text-xl text-gray-900">
                {"Manage brand users"}
              </span>
              <ChevronRight className="group-hover:translate-x-2 transition-transform ease-in-out h-[1.5rem] w-[1.5rem]" />
            </Link>
          )}
        </div>
      </div>

      <footer className="py-[4rem]">
        <div className="max-w-7xl px-[1rem] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-[1fr_5fr] gap-[2rem] mb-[2rem] md:mb-0">
          {[
            ["Customer service", "/customer-service"],
            ["API", "/api"],
            ["Terms and conditions", "/terms"],
            ["Blogs", "/blog"],
            ["Privacy policy", "/privacy"],

            ["About Advayu", "/about"],
          ].map(([text, link], idx) => (
            <div key={idx} className="flex flex-col space-y-[0.5rem]">
              <a href={link} className="text-gray-800 hover:text-gray-600">
                {text}
              </a>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
