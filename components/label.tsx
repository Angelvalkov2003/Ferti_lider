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
        <h3 className="mr-2 line-clamp-2 grow pl-2 leading-none tracking-tight min-w-0">
          {title}
        </h3>
        <div className="flex-none rounded-full bg-stone-200 dark:bg-stone-700 px-1.5 py-0.5 text-stone-900 dark:text-stone-100 text-[10px]">
          {hasComparePrice ? (
            <div className="flex items-center gap-0.5 flex-wrap">
              <span className="text-red-600 dark:text-red-400 line-through text-[9px] whitespace-nowrap">
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
                showBgn={true}
              />
            </div>
          ) : (
            <Price
              amount={amount}
              currencyCode={currencyCode}
              currencyCodeClassName="hidden @[275px]/label:inline"
              showBgn={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Label;
