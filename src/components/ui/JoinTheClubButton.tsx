'use client'
import { Button } from "@/components/ui/button";
import Image from "next/image";
import arrow from "../../../public/image/Arrow 18.svg";
import { useRouter } from "next/navigation";

interface JoinTheClubButtonProps {
  text: string;
}



const JoinTheClubButton: React.FC<JoinTheClubButtonProps> = ({ text }) => {
  const router = useRouter();

  const onclick = () => {
    console.log("this is clicked")
    router.push("/partner-with-us")
  }
  return (
  
    <Button
      variant="rounded"
      className="bg-black my-4"
      onClick={onclick}
    >
      {text}
      <Image className="invert mx-1" src={arrow} alt="" width={30} />
    </Button>
  );
};

export default JoinTheClubButton;