import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  );
}

function CouponCardSkeleton() {
  return <Skeleton className="w-[280px] h-[120px]  mt-2" />;
}

export { Skeleton, CouponCardSkeleton };
