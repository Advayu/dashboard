// components/OfferRow.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OfferRowProps {
  label?: string;
  value: string | number;
  className?: string;
}

const OfferRow: React.FC<OfferRowProps> = ({
  label,
  value,
  className = "",
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {label && (
        <Label className="font-black text-lg md:text-xl">{label}</Label>
      )}
      <Input
        readOnly
        value={value}
        className="bg-inputDisable border-none font-black border border-black text-lg md:text-xl text-blueTilt w-auto px-3 py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
      />
    </div>
  );
};

export default OfferRow;
