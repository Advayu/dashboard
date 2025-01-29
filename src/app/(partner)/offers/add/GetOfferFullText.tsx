import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect } from "react";
import { useState } from "react";

const GetOfferFullText = () => {
  const offerDetail = useSelector((state: any) => state.offerDetails);
  const [fullText, setFullText] = useState("");

  useEffect(() => {
    const {
      discountType,
      discountValue,
      minimumOrderValue,
      maximumDiscountValue,
    } = offerDetail;

    let text = ""; // Initialize the text
    switch (discountType.toLowerCase()) {
      case "flat off":
        text = `Flat Rs ${discountValue} off above Rs ${minimumOrderValue}`;
        break;

      case "percentage off":
        text = `${discountValue}% OFF on all items above Rs ${minimumOrderValue} up to Rs ${maximumDiscountValue}`;
        break;

      case "free gift":
        text = `Get ${discountValue} All items on all above Rs. ${minimumOrderValue}`;
        break;

      case "buy n get n":
        if (offerDetail.discountValue.split(",").length > 1) {
        }

      case "items at set price":
        text = `Get All items at Rs. ${minimumOrderValue}`;
        break;
      default:
        text = "No discount available";
        break;
    }

    setFullText(text);
  }, [offerDetail]);

  return <>{fullText}</>;
};

export default GetOfferFullText;
