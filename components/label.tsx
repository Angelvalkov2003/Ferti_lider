import clsx from "clsx";
import Price from "./price";

const Label = ({
  title,
  amount,
  compareAtAmount,
  currencyCode,
  position = "bottom",
}: {
  title: string;
  amount: string;
  compareAtAmount?: string;
  currencyCode: string;
  position?: "bottom" | "center";
}) => {
  const hasComparePrice = compareAtAmount && parseFloat(compareAtAmount) > parseFloat(amount);
  
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <div className="flex-none rounded-full bg-stone-200 dark:bg-stone-700 p-2 text-stone-900 dark:text-stone-100">
          {hasComparePrice ? (
            <div className="flex items-center gap-1.5">
              <span className="text-red-600 dark:text-red-400 line-through text-[10px]">
                <Price
                  amount={compareAtAmount}
                  currencyCode={currencyCode}
                  currencyCodeClassName="hidden"
                  showBgn={false}
                />
              </span>
              <Price
                amount={amount}
                currencyCode={currencyCode}
                currencyCodeClassName="hidden @[275px]/label:inline"
                showBgn={false}
              />
            </div>
          ) : (
            <Price
              amount={amount}
              currencyCode={currencyCode}
              currencyCodeClassName="hidden @[275px]/label:inline"
              showBgn={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Label;
