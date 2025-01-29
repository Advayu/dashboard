"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  resetOfferDetails,
  setOfferfield,
} from "@/store/offerSlice/offerDetailsSlice";
import { setOutletData2 } from "@/store/globalSlice/outletSlice";
import { useDispatch, useSelector } from "react-redux";
// import { RootState } from "@/store/createOfferStore";
import { RootState } from "@/store/store";
import EmblaCarouselReact from "embla-carousel-react";
import axios from "axios";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import { Offer } from "@/Types/type";
import {
  saveOfferAsDraft,
  getDetailsByBrandId,
  getOutletDataByBrandId,
} from "@/services/api/offers/offersApi";
import { useToast } from "@/hooks/use-toast";

import { setBrandData } from "@/store/globalSlice/brandSlice";
import { useRouter } from "next/navigation";
import { generateOfferTitle } from "../generateOfferTitle";

interface OfferDetailsProps {
  // Define your component props here
  handleNext: () => void;
  activeStep: number;
}

interface OfferDetails {
  offerType: string; // e.g., "Flat off", "Percentage off", etc.
  offerCode: string; // Unique offer code
  conditions: {
    flatOff?: {
      flatOff: number; // Flat discount amount
      abovePurchase: number; // Minimum purchase required
    };
    percentageOff?: {
      percentage: number; // Discount percentage
      price: number;
      abovePurchase: number; // Minimum purchase required
      uptoDiscount: number; // Maximum discount amount
    };
    buyNGetN?: {
      buy: number; // Items to buy
      get: number; // Items to get for free or discounted
      description: string; // Description of the offer
    };
    freeGift?: {
      description: string; // Gift description
      minPurchase: number; // Minimum purchase required
    };
    itemsAtSetPrice?: {
      get: string; // Description of items
      value: number; // Fixed price
    };
    comboOffer?: {
      comboDetails: string; // Description of combo
    };
  };
}

const OfferDetails: React.FC<OfferDetailsProps> = ({
  handleNext,
  activeStep,
}) => {
  const [offerDetailText, setOfferDetailText] = useState("");
  const dispatch = useDispatch();
  const offerDetail = useSelector((state: RootState) => state.offerDetails);
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const brandUser = useSelector((state: RootState) => state.brandUser);
  const [outletData, setOutletData] = useState<any>([]);
  const router = useRouter();
  const [loadingState, setLoadingState] = useState({
    saveDraft: false,
    processed: false,
  });

  const [offerDetails, setOfferDetails] = useState<OfferDetails>({
    offerType: "",
    offerCode: "",
    conditions: {},
  });

  const { toast } = useToast();

  const handleOfferTypeChange = (value: string) => {
    console.log("offer type:", value);
    // setOfferDetails((prev) => ({ ...prev, offerType: value }));
    // setOfferDetails((prev) => ({ ...prev, conditions: {} }));

    dispatch(setOfferfield({ field: "discountType", value: value })); // Correct
    // dispatch(clearOfferConditions());
    console.log("offer details from store:", offerDetail);
  };

  // Handle offer unique code change and set to the redux state store
  const handleOfferCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setOfferfield({
        field: "discountCode",
        value: e.target.value.toUpperCase(),
      })
    ); // Correct(e.target.value));
  };

  // Handle flat off change
  const handleFlatOffChange = (
    flatOffAmount: string,
    abovePurchase: string
  ) => {
    console.log(
      "flatOffAmount:",
      flatOffAmount,
      "abovePurchase:",
      abovePurchase
    );
    // remove text from the input field
    flatOffAmount = flatOffAmount.replace(/[^0-9]/g, "");
    abovePurchase = abovePurchase.replace(/[^0-9]/g, "");
    dispatch(setOfferfield({ field: "discountValue", value: flatOffAmount }));
    dispatch(setOfferfield({ field: "minOrderValue", value: abovePurchase }));

    // console.log("offer details for store:", offerDetail);
  };

  const handlePercentageOffChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(event.target.name, event.target.value);
    event.target.value = event.target.value.replace(/[^0-9]/g, "");
    dispatch(
      setOfferfield({
        field: event.target.name as keyof Offer,
        value: event.target.value,
      })
    );
    // console.log(
    //   "percentage:",
    //   percentage,
    //   "price:",
    //   price,
    //   "abovePurchase:",
    //   abovePurchase,
    //   "uptoRs:",
    //   uptoRs
    // );

    // dispatch(setOfferfield({ field: "discountValue", value: percentage }));
    // dispatch(setOfferfield({ field: "minOrderValue", value: abovePurchase }));
    // dispatch(setOfferfield({ field: "maxDiscountValue", value: uptoRs }));

    // setOfferDetails((prev) => ({
    //   ...prev,
    //   conditions: {
    //     ...prev.conditions,
    //     percentageOff: {
    //       percentage,
    //       price,
    //       abovePurchase,
    //       uptoDiscount: uptoRs,
    //     },
    //   },
    // }));
    console.log("offer details from store:", offerDetail);
  };

  const handleBuyNGetNChange = (buy: number | string, get: number | string) => {
    const buyStr = buy.toString().replace(/[^0-9]/g, "");
    const getStr = get.toString().replace(/[^0-9]/g, "");
    dispatch(setOfferfield({ field: "minOrderValue", value: buyStr }));
    dispatch(setOfferfield({ field: "maxDiscountValue", value: getStr }));
    console.log("offer details for store:", offerDetail);
  };

  const handleItemsAtSetPriceChange = (get: string, value: number) => {
    console.log("get:", get, "value:", value);
    setOfferDetails((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        itemsAtSetPrice: { get, value },
      },
    }));
    dispatch(setOfferfield({ field: "maxDiscountValue", value: get }));
    dispatch(
      setOfferfield({ field: "minOrderValue", value: value.toString() })
    );
    console.log("offer details for store:", offerDetail);
  };

  const handleComboOfferChange = (value: string) => {
    // clear all the condition
    setOfferDetails((prev) => ({
      ...prev,
      conditions: {},
    }));
    console.log("offer details:", offerDetail);

    setOfferDetails((prev) => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        comboOffer: { comboDetails: value },
      },
    }));

    console.log("offer details:", offerDetails);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOutletId = localStorage.getItem("selectedOutletId");
      if (savedOutletId) {
        setSelectedOutletId(savedOutletId);
        const savedOutletName = localStorage.getItem("selectedOutletName");
        if (savedOutletName) {
          setSelectedOutletName(savedOutletName);
        }
      }
      if (outletData.length === 0) {
        fetchOutletData(); // Fetch outlet data if not already fetched
      }
    }
  }, [outletData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedOutletId = localStorage.getItem("selectedOutletId");
      const savedOutletName = localStorage.getItem("selectedOutletName");

      if (savedOutletId && savedOutletName) {
        // Set initial state from localStorage
        setSelectedOutletId(savedOutletId);
        setSelectedOutletName(savedOutletName);

        // Dispatch the outlet id to setOfferfield which I get from the local storage
        dispatch(setOfferfield({ field: "outletId", value: savedOutletId }));
      }
    }
  }, []);
  const fetchOutletData = async () => {
    // const cachedData = localStorage.getItem("outletData");
    // if (cachedData) {
    //   setOutletData(JSON.parse(cachedData));
    // } else {
    try {
      console.log("brand user", brandUser.brand_id);
      // const brandId = brandUser?.brand_id || localStorage.getItem("brandId");
      const brandId = brandUser?.brand_id;
      if (!brandId) {
        router.push("/auth");
      }
      // todo:
      const data = await getOutletDataByBrandId(brandId || "");
      console.log("data:", data);
      setOutletData(data);
      // localStorage.setItem("outletData", JSON.stringify(data)); // Cache data
    } catch (error) {
      return;
      console.error("Error fetching outlet data:", error);
    }
    // }
  };

  // Adjust slides per view based on window size (responsive)
  useEffect(() => {
    // Asynchronous function to fetch brand data
    const fetchBrandData = async () => {
      try {
        const data = await getDetailsByBrandId(brandUser.brand_id);
        dispatch(setBrandData(data));
        console.log("Brand data:", data);
        // setBrandData(data);
      } catch (error) {
        console.error("Error fetching brand data:", error);
      }
    };
    // console.log("brand data:", brandData);
    fetchBrandData(); // Fetch brand data
    if (outletData.length === 0) {
      fetchOutletData(); // Call the function only if outletData is empty
    }

    console.log("Outlet data:>> from state", outletData);
  }, []);

  const handleSave = async () => {
    setLoadingState((prevState) => ({ ...prevState, processed: true }));
    if (selectedOutletId) {
      dispatch(
        setOfferfield({ field: "outletId", value: selectedOutletId.toString() })
      );
    }
    // Define validation rules
    const {
      discountType,
      discountValue,
      minOrderValue,
      discountCode,
      maxDiscountValue,
    } = offerDetail;
    const validations = [
      {
        condition:
          discountType === "Percentage off" && Number(discountValue) > 100,
        message: "Max Discount Value should be less than 100.",
      },
      {
        condition:
          discountType === "Percentage off" &&
          Number(minOrderValue) < Number(maxDiscountValue),
        message: `Min Order Value should be greater than the max discount value.`,
      },
      {
        condition:
          discountType === "Flat off" &&
          Number(minOrderValue) <= Number(discountValue),
        message: `Order value should be greater than the discount value.`,
      },
      {
        condition: !discountCode,
        message: "Please enter discount code.",
      },
    ];

    // Run validations
    for (const { condition, message } of validations) {
      if (condition) {
        toast({ variant: "destructive", title: message });
        setLoadingState((prevState) => ({ ...prevState, processed: false }));
        return;
      }
    }

    handleNext();
    setLoadingState((prevState) => ({ ...prevState, processed: false }));
    console.log("offer details for store:", offerDetail);
  };

  const [subCategoryDiscountType, setSubCategoryDiscountType] =
    useState("Percentage"); // State to track selected value

  const handleToggleBuynGetnDiscountTypeChange = (value: any) => {
    setSubCategoryDiscountType(value);
    dispatch(
      setOfferfield({
        field: "discountType",
        value: offerDetail.discountType + "," + value,
      })
    );
    console.log("Selected Discount Type:", value);
    // Add any additional logic for handling the discount type change
  };

  const handleFreeGiftChange = (
    maxDiscountValue: string,
    minOrderValue: string
  ) => {
    maxDiscountValue = maxDiscountValue.replace(/[^0-9]/g, "");
    minOrderValue = minOrderValue.replace(/[^0-9]/g, "");
    dispatch(
      setOfferfield({ field: "maxDiscountValue", value: maxDiscountValue })
    );
    dispatch(setOfferfield({ field: "minOrderValue", value: minOrderValue }));
  };

  function handleOfferDetailTextChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    let text = offerDetailText + event.target.value;
    setOfferDetailText(text);
    console.log("offerDetailText", offerDetailText);
  }

  const handleDraft = async () => {
    // Generate the offer title
    const offerTitle = generateOfferTitle(offerDetail);
    console.log(offerDetail.maxDiscountValue, offerDetail.minOrderValue);
    // Define validation rules
    const {
      discountType,
      discountValue,
      minOrderValue,
      discountCode,
      maxDiscountValue,
    } = offerDetail;
    const validations = [
      {
        condition:
          discountType === "Percentage off" && Number(discountValue) > 100,
        message: "Max Discount Value should be less than 100.",
      },
      {
        condition:
          discountType === "Percentage off" &&
          Number(minOrderValue) < Number(maxDiscountValue),
        message: `Min Order Value should be greater than the max discount value.`,
      },
      {
        condition:
          discountType === "Flat off" &&
          Number(minOrderValue) <= Number(discountValue),
        message: `Order value should be greater than the discount value.`,
      },
      {
        condition: !discountCode,
        message: "Please enter discount code.",
      },
    ];
    // Run validations
    for (const { condition, message } of validations) {
      if (condition) {
        toast({ variant: "destructive", title: message });
        setLoadingState((prevState) => ({ ...prevState, processed: false }));
        return;
      }
    }

    // Update the Redux state with the title
    dispatch(setOfferfield({ field: "title", value: offerTitle }));

    // Ensure title is used immediately without waiting for Redux update
    const updatedOfferDetail = {
      ...offerDetail,
      title: offerTitle,
    };

    // const brandId = localStorage.getItem("brandId") || brandUser.brand_id;
    const brandId = brandUser.brand_id;
    if (!brandId) {
      router.push("/auth");
    }
    setLoadingState({ ...loadingState, saveDraft: true });
    try {
      const responseCode: any = await saveOfferAsDraft(
        updatedOfferDetail, // Pass the updated details
        selectedOutletId || "",
        brandId
      );

      if (responseCode == 201) {
        toast({
          duration: 5000,
          variant: "success",
          title: "Offer saved as draft",
        });
        setLoadingState({ ...loadingState, saveDraft: false });
        dispatch(resetOfferDetails());
        router.push("/offers");
      }
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response &&
        error.response.status === 401
      ) {
        console.log("Unauthorized: Redirecting to login...");
        router.push("/auth");
      } else {
        console.error("An error occurred", error);
      }
      console.error("Error saving draft:", error);
      setLoadingState({ ...loadingState, saveDraft: false });
      toast({
        duration: 5000,
        variant: "destructive",
        title: "Failed to save offer as draft. Please try again.",
      });
    }
  };
  const [selectedOutletName, setSelectedOutletName] = useState("");

  const handleOutletChange = (value: string) => {
    // Update local state for selected outlet ID
    setSelectedOutletId(value);

    // Find the outlet object based on the selected ID
    const selectedOutlet = outletData.find(
      (outlet: any) => outlet.id === value
    );

    if (selectedOutlet) {
      // Update the Redux store with the new outlet ID
      dispatch(setOfferfield({ field: "outletId", value: selectedOutlet.id }));

      // Update local state for selected outlet name
      setSelectedOutletName(selectedOutlet.name);

      // Save selected outlet details to localStorage
      // localStorage.setItem("selectedOutletId", selectedOutlet.id);
      // localStorage.setItem("selectedOutletName", selectedOutlet.name);

      console.log("Updated Redux with new outletId:", selectedOutlet.id);
    } else {
      console.error("Selected outlet not found in outletData");
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl	font-black">Offer details</h1>
        <p>Curate your offer</p>
      </div>

      {/* form to start creating offer */}
      <div>
        <h1 className="text-xl font-bold mt-6">
          Select Your Outlet <span className="text-red-500">*</span>
        </h1>
        <Select
          onValueChange={handleOutletChange}
          value={selectedOutletId || ""}>
          <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
            <SelectValue placeholder={selectedOutletName || "Select Outlet"} />
          </SelectTrigger>
          <SelectContent>
            {outletData.map((outlet: any) => (
              <SelectItem key={outlet.id} value={outlet.id}>
                {outlet.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <h1 className="text-xl font-bold mt-6">
          Category of your offer <span className="text-red-500">*</span>
        </h1>
        <div className="flex space-x-4">
          <Select
            onValueChange={handleOfferTypeChange}
            value={offerDetail.discountType}>
            <SelectTrigger className="w-[180px] my-2 border border-black mb-6">
              <SelectValue defaultValue={"Flat off"} placeholder="Offer type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flat off">Flat off</SelectItem>
              <SelectItem value="Percentage off">Percentage off</SelectItem>
              {/* <SelectItem value="Buy n Get n">Buy n Get n</SelectItem>
              <SelectItem value="Free gift">Free gift</SelectItem>
              <SelectItem value="Items at set price">
                Items at set price
              </SelectItem> */}
              {/* <SelectItem value="Combo offers">Combo offers</SelectItem> */}
            </SelectContent>
          </Select>

          {/* select your outlet */}

          {offerDetail.discountType === "Buy n Get n" && (
            <div className="space-x-4 border border-black px-2 rounded-md mb-4">
              {/* Toggle Group */}
              <ToggleGroup
                type="single"
                value={subCategoryDiscountType} // Controlled component bound to state
                onValueChange={(value) =>
                  handleToggleBuynGetnDiscountTypeChange(value)
                } // Pass the value from ToggleGroup
                className="space-x-2">
                <ToggleGroupItem
                  value="Percentage"
                  className={`${
                    subCategoryDiscountType === "Percentage"
                      ? " text-blueTilt"
                      : "hover:text-blueTilt"
                  }`}>
                  %
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Rupees"
                  className={`border-x border-black px-2 ${
                    subCategoryDiscountType === "Rupees"
                      ? " text-blueTilt"
                      : "hover:text-blueTilt"
                  }`}>
                  Rs.
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Item"
                  className={`${
                    subCategoryDiscountType === "Item"
                      ? " text-blueTilt"
                      : "hover:text-blueTilt"
                  }`}>
                  Item
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
          )}
        </div>
        {offerDetail.discountType === "Flat off" && (
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-4 md:space-y-0 md:items-center">
            <div className="flex items-center space-x-2">
              <Label className="font-black  text-lg md:text-xl">FLAT Rs.</Label>
              <Input
                type="text"
                placeholder="e.g 150"
                name="discountValue"
                value={offerDetail.discountValue}
                onChange={(e) =>
                  handleFlatOffChange(e.target.value, offerDetail.minOrderValue)
                }
                className="font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Label className="font-black  text-lg md:text-xl">
                OFF above Rs.
              </Label>
              <Input
                type="text"
                name="minOrderValue"
                placeholder="e.g 400"
                value={offerDetail.minOrderValue}
                onChange={(e) =>
                  handleFlatOffChange(offerDetail.discountValue, e.target.value)
                }
                className="font-bold  text-lg w-2/5 md:w-auto px-3 py-2 border text-blueTilt rounded-lg focus:outline-none focus:ring focus:ring-teal-500"
              />
            </div>
          </div>
        )}
        {/* Percentage off */}
        {offerDetail.discountType === "Percentage off" && (
          <div className="flex flex-col space-y-4">
            {/* First Row */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
              <div className="flex space-x-2">
                <Input
                  className="font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 w-2/5 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                  type="text"
                  value={offerDetail.discountValue}
                  name="discountValue"
                  placeholder="e.g 10%"
                  onChange={handlePercentageOffChange}
                />
                <Label className="font-black text-lg md:text-xl">OFF on</Label>
              </div>
              <Input
                className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
                type="text"
                name="price"
                placeholder="Value"
                // Todo: review
                value={"All Items"}
                readOnly
                // onChange={(e) =>
                //   handlePercentageOffChange(
                //     offerDetails.conditions.percentageOff?.percentage || 0,
                //     Number(e.target.value),
                //     offerDetails.conditions.percentageOff?.abovePurchase || 0,
                //     offerDetails.conditions.percentageOff?.uptoDiscount || 0
                //   )
                // }
              />
            </div>

            {/* Second Row */}
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0 md:items-center">
              <div className="flex space-x-2">
                <Label className="font-black text-lg md:text-xl">
                  above Rs.
                </Label>
                <Input
                  className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
                  type="text"
                  name="minOrderValue"
                  placeholder="e.g 1000"
                  value={offerDetail.minOrderValue}
                  onChange={handlePercentageOffChange}
                />
              </div>

              <div className="flex space-x-2">
                <Label className="font-black text-lg md:text-xl">
                  upto Rs.
                </Label>
                <Input
                  className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-2/5"
                  type="text"
                  name="maxDiscountValue"
                  placeholder="e.g 300"
                  value={offerDetail.maxDiscountValue}
                  onChange={handlePercentageOffChange}
                />
              </div>
            </div>
          </div>
        )}

        {offerDetail.discountType === "Buy n Get n" && (
          <>
            {subCategoryDiscountType === "Item" && (
              <div>
                {/* Buy Section */}
                <div className="flex items-center space-x-4">
                  <Label className="font-black text-lg md:text-xl">Buy</Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.buy || 0}
                    onChange={(e) =>
                      handleBuyNGetNChange(
                        e.target.value,
                        offerDetail.maxDiscountValue
                      )
                    }
                  />

                  <Select defaultValue="0">
                    <SelectTrigger className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                      <SelectValue placeholder="Min Order Value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Items</SelectItem>
                      <SelectItem value="1">1 Item</SelectItem>
                      <SelectItem value="2">2 Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Get Section */}
                <div className="flex items-center space-x-4 mt-4">
                  <Label className="font-black text-lg md:text-xl">Get</Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.get || 0}
                    onChange={(e) =>
                      handleBuyNGetNChange(
                        offerDetails.conditions.buyNGetN?.buy || 0,
                        Number(e.target.value)
                      )
                    }
                  />
                  <Select defaultValue="0">
                    <SelectTrigger className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                      <SelectValue placeholder="Min Order Value" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">All Items</SelectItem>
                      <SelectItem value="1">1 Item</SelectItem>
                      <SelectItem value="2">2 Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {subCategoryDiscountType === "Percentage" && (
              <div>
                <div className="flex items-center space-x-4">
                  <Label className="font-black text-lg md:text-xl">Buy</Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt  w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 "
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.buy || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.get || 0,
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.buy || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.get || 0,
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                </div>

                {/* get section */}
                <div className="flex items-center space-x-4 mt-4">
                  <Label className="font-black text-lg md:text-xl">Get</Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-5/12 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-36"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.get || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     offerDetails.conditions.buyNGetN?.buy || 0,
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                  <p className="font-black">OFF</p>
                </div>

                {/* Add additional input or content for percentage discount if needed */}
              </div>
            )}

            {subCategoryDiscountType === "Rupees" && (
              <div>
                <div className="flex items-center space-x-4">
                  <Label className="font-black text-lg md:text-xl">Buy</Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt  w-24 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.buy || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.get || 0,
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.buy || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.get || 0,
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                </div>

                {/* get section */}
                <div className="flex items-center space-x-4 mt-4">
                  <Label className="font-black text-lg md:text-xl">
                    Get Rs.
                  </Label>
                  <Input
                    className="font-black border border-black text-lg md:text-xl text-blueTilt w-full md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-36"
                    type="text"
                    value={offerDetails.conditions.buyNGetN?.get || 0}
                    // onChange={(e) =>
                    //   handleBuyNGetNChange(
                    //     offerDetails.conditions.buyNGetN?.buy || 0,
                    //     Number(e.target.value),
                    //     offerDetails.conditions.buyNGetN?.description || ""
                    //   )
                    // }
                  />
                  <p className="font-black">OFF</p>
                </div>
              </div>
            )}
          </>
        )}

        {offerDetail.discountType === "Free gift" && (
          <div className="flex flex-col space-y-4">
            {/* First Row */}
            <div className="flex flex-row space-x-4 space-y-2 md:space-y-0 items-center">
              <Label className="font-black text-lg md:text-xl">Get</Label>
              <Input
                className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                type="text"
                value={offerDetail.maxDiscountValue}
                onChange={(e) =>
                  handleFreeGiftChange(
                    e.target.value,
                    offerDetail.maxDiscountValue
                  )
                }
              />
              <Input
                className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                type="text"
                name="text"
                placeholder="value"
                defaultValue="All items"
                readOnly
              />
              <Label className="font-black text-lg md:text-xl">Free</Label>
            </div>

            {/* Second Row */}
            <div className="flex flex-row space-x-2  md:space-y-0 items-center">
              <Label className="font-black text-lg md:text-xl">
                on all orders above Rs.
              </Label>
              <Input
                className="font-black border border-black text-lg md:text-xl text-blueTilt w-24 md:w-48 px-3 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                type="text"
                value={offerDetail.minOrderValue}
                onChange={(e) =>
                  handleFreeGiftChange(
                    offerDetail.maxDiscountValue,
                    e.target.value
                  )
                }
              />
            </div>
          </div>
        )}

        {offerDetail.discountType === "Items at set price" && (
          <div className="flex  space-y-4 md:flex-row flex-col md:space-y-0 md:space-x-4  md:items-center">
            <div className="flex items-center space-x-2">
              <Label className="font-black text-lg md:text-xl ">Get</Label>
              <Select
                onValueChange={(value) =>
                  handleItemsAtSetPriceChange(
                    value,
                    offerDetails.conditions.itemsAtSetPrice?.value || 0
                  )
                }
                defaultValue="1" // Use a string to match the `value` types
              >
                <SelectTrigger className="font-black border border-black text-lg md:text-xl text-blueTilt w-40 md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">All items</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Label className="font-black text-lg md:text-xl">at Rs.</Label>
              <Input
                className="font-black border border-black text-lg md:text-xl text-blueTilt  md:w-48 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500 w-24"
                type="number"
                name="value"
                placeholder="value"
                value={offerDetail.maxDiscountValue}
                onChange={(e) =>
                  dispatch(
                    setOfferfield({
                      field: "maxDiscountValue",
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
          </div>
        )}

        {offerDetail.discountType === "Combo offers" && (
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4 items-start md:items-center">
            <Label className="font-medium text-lg md:text-xl">
              Combo Details:
            </Label>
            <Input
              className="border border-black text-lg md:text-xl w-full md:w-96 px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
              type="text"
              placeholder="Enter combo details"
              value={offerDetails.conditions.comboOffer?.comboDetails || ""}
              onChange={(e) => handleComboOfferChange(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Enter offer code */}
      <div className="my-4 space-y-2 mt-8">
        <Label className=" md:text-xl text-sm">
          Offer Code: <span className="text-red-500">*</span>
        </Label>
        <Input
          className="border border-black px-3 py-2 rounded-md text-base md:text-lg focus:outline-none focus:ring focus:ring-blue-500  w-48"
          placeholder="Enter offer code"
          value={offerDetail.discountCode}
          onChange={handleOfferCodeChange}
        />
      </div>
      <div className="flex space-x-2 md:justify-end ">
        <Button
          disabled={loadingState.saveDraft}
          onClick={handleDraft}
          variant={"outline"}
          className="my-5 w-40 "
          size={"thin"}>
          {loadingState.saveDraft ? "Saving..." : "Save as draft"}
        </Button>
        <Button
          disabled={loadingState.processed}
          className="my-5 w-40"
          size={"thin"}
          onClick={handleSave}>
          {loadingState.processed ? "Processing..." : "processed"}
        </Button>
      </div>
    </div>
  );
};

export default OfferDetails;
