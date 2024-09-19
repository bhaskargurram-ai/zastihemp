import Image from "next/image";

const SimilarTopics = ({
  similarQuestions,
  handleDisplayResult,
  reset,
  category,
}: {
  similarQuestions: {
    marketResearch: string[];
    sales: string[];
    production: string[];
  };
  handleDisplayResult: (item: string) => void;
  reset: () => void;
  category: string;
}) => {
  // Normalize category for consistent comparison
  const normalizeCategory = (cat: string) =>
    cat.toLowerCase().replace(/\s+/g, "");

  // Map backend category to front-end category names
  const categoryMap: { [key: string]: string } = {
    "hemp seed": "sales",
    "hemp fiber": "market research",
    "hemp foods": "production",
    "hemp cbd": "sales",
    "hemp industrial products": "production",
  };

  // Determine which container should be highlighted
  const getCategoryClass = (currentCategory: string) => {
    const normalizedCategory = normalizeCategory(
      categoryMap[category.toLowerCase()] || category
    );
    return normalizeCategory(currentCategory) === normalizedCategory
      ? "bg-blue-100 border-blue-500" // Highlighted style
      : "bg-white";
  };

  return (
    <div className="flex justify-center gap-6 px-6"> {/* Increased gap and padding */}
      <div
        className={`flex flex-col h-auto w-1/4 shrink-0 gap-4 rounded-lg border border-solid ${getCategoryClass(
          "market research"
        )} p-5 lg:p-8`}
      >
        <div className="flex gap-4 pb-3">
          <Image
            unoptimized
            src="/img/similarTopics.svg"
            alt="footer"
            width={24}
            height={24}
          />
          <h3 className="text-base font-bold uppercase text-black">
            Market Research
          </h3>
        </div>

        <div className="max-w-[290px] space-y-[15px] divide-y divide-[#E5E5E5]">
          {similarQuestions.marketResearch.length > 0 ? (
            similarQuestions.marketResearch.map((item) => (
              <button
                className="flex cursor-pointer items-center gap-4 pt-3.5"
                key={item}
                onClick={() => {
                  reset();
                  handleDisplayResult(item);
                }}
              >
                <div className="flex items-center">
                  <Image
                    unoptimized
                    src="/img/arrow-circle-up-right.svg"
                    alt="footer"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-sm font-light leading-[normal] text-[#1B1B16] [leading-trim:both] [text-edge:cap]">
                  {item}
                </p>
              </button>
            ))
          ) : (
            <>
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
            </>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col h-auto w-1/4 shrink-0 gap-4 rounded-lg border border-solid ${getCategoryClass(
          "sales"
        )} p-5 lg:p-8`}
      >
        <div className="flex gap-4 pb-3">
          <Image
            unoptimized
            src="/img/similarTopics.svg"
            alt="footer"
            width={24}
            height={24}
          />
          <h3 className="text-base font-bold uppercase text-black">Sales</h3>
        </div>

        <div className="max-w-[290px] space-y-[15px] divide-y divide-[#E5E5E5]">
          {similarQuestions.sales.length > 0 ? (
            similarQuestions.sales.map((item) => (
              <button
                className="flex cursor-pointer items-center gap-4 pt-3.5"
                key={item}
                onClick={() => {
                  reset();
                  handleDisplayResult(item);
                }}
              >
                <div className="flex items-center">
                  <Image
                    unoptimized
                    src="/img/arrow-circle-up-right.svg"
                    alt="footer"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-sm font-light leading-[normal] text-[#1B1B16] [leading-trim:both] [text-edge:cap]">
                  {item}
                </p>
              </button>
            ))
          ) : (
            <>
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
            </>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col h-auto w-1/4 shrink-0 gap-4 rounded-lg border border-solid ${getCategoryClass(
          "production"
        )} p-5 lg:p-8`}
      >
        <div className="flex gap-4 pb-3">
          <Image
            unoptimized
            src="/img/similarTopics.svg"
            alt="footer"
            width={24}
            height={24}
          />
          <h3 className="text-base font-bold uppercase text-black">
            Production
          </h3>
        </div>

        <div className="max-w-[290px] space-y-[15px] divide-y divide-[#E5E5E5]">
          {similarQuestions.production.length > 0 ? (
            similarQuestions.production.map((item) => (
              <button
                className="flex cursor-pointer items-center gap-4 pt-3.5"
                key={item}
                onClick={() => {
                  reset();
                  handleDisplayResult(item);
                }}
              >
                <div className="flex items-center">
                  <Image
                    unoptimized
                    src="/img/arrow-circle-up-right.svg"
                    alt="footer"
                    width={24}
                    height={24}
                  />
                </div>
                <p className="text-sm font-light leading-[normal] text-[#1B1B16] [leading-trim:both] [text-edge:cap]">
                  {item}
                </p>
              </button>
            ))
          ) : (
            <>
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
              <div className="h-10 w-full animate-pulse rounded-md bg-gray-300" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SimilarTopics;
