import clsx from "clsx";

const EUR_TO_BGN_RATE = 1.95583; // Exchange rate: 1 EUR = 1.95583 BGN

const Price = ({
  amount,
  className,
  currencyCode = "EUR",
  currencyCodeClassName,
  showBgn = true,
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
  showBgn?: boolean;
} & React.ComponentProps<"p">) => {
  const eurAmount = parseFloat(amount);
  const bgnAmount = eurAmount * EUR_TO_BGN_RATE;
  
  const formattedEur = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: currencyCode,
    currencyDisplay: "narrowSymbol",
  }).format(eurAmount);
  
  const formattedBgn = new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "BGN",
    currencyDisplay: "narrowSymbol",
  }).format(bgnAmount);

  return (
    <p suppressHydrationWarning={true} className={clsx("whitespace-nowrap", className)}>
      <span>
        {formattedEur}
        <span className={clsx("ml-1 inline", currencyCodeClassName)}>
          {currencyCode}
        </span>
      </span>
      {showBgn && (
        <span className="ml-1.5 text-[0.65em] opacity-70">
          ({formattedBgn})
        </span>
      )}
    </p>
  );
};

export default Price;
