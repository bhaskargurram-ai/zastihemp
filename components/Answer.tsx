import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";

export default function Answer({ answer }: { answer: string }) {
  const formattedAnswer = answer
    .split("\n")  // Split answer by lines for easy formatting
    .map((line, index) => {
      if (line.startsWith("*")) {
        // For bullet points
        return (
          <li key={index} className="mb-1 list-disc pl-5">
            {line.slice(1).trim()} {/* Remove the asterisk and trim */}
          </li>
        );
      } else if (line.endsWith(":")) {
        // For headings
        return (
          <h4 key={index} className="mt-3 font-bold text-black">
            {line}
          </h4>
        );
      } else {
        // For regular paragraphs
        return (
          <p key={index} className="mt-2 text-base font-light leading-7 text-black">
            {line}
          </p>
        );
      }
    });

  return (
    <div className="container flex h-auto w-full shrink-0 gap-4 rounded-lg border border-solid border-[#C2C2C2] bg-white p-5 lg:p-10">
      <div className="hidden lg:block">
        <Image
          unoptimized
          src="/img/Info.svg"
          alt="footer"
          width={24}
          height={24}
        />
      </div>
      <div className="w-full">
        <div className="flex items-center justify-between pb-3">
          <div className="flex gap-4">
            <Image
              unoptimized
              src="/img/Info.svg"
              alt="footer"
              width={24}
              height={24}
              className="block lg:hidden"
            />
            <h3 className="text-base font-bold uppercase text-black">
              Answer:{" "}
            </h3>
          </div>
          {answer && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(answer.trim());
                  toast("Answer copied to clipboard", {
                    icon: "✂️",
                  });
                }}
              >
                <Image
                  unoptimized
                  src="/img/copy.svg"
                  alt="footer"
                  width={20}
                  height={20}
                  className="cursor-pointer"
                />
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap content-center items-center gap-[15px]">
          <div className="w-full whitespace-pre-wrap text-base font-light leading-[152.5%] text-black">
            {answer ? (
              <div>{formattedAnswer}</div>
            ) : (
              <div className="flex w-full flex-col gap-2">
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
                <div className="h-6 w-full animate-pulse rounded-md bg-gray-300" />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{ duration: 2000 }}
      />
    </div>
  );
}
