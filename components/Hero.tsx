import Image from "next/image";
import { FC } from "react";
import InputArea from "./InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full">
      {/* Semi-transparent green overlay to improve text visibility */}
      <div className="absolute inset-0 bg-green-900 opacity-90"></div>

      <h2 className="relative pb-7 pt-2 text-center text-white font-semibold leading-[normal] lg:text-[35px] text-shadow-lg">
        Ask me anything about Industrial Hemp!
      </h2>

      {/* Input section */}
      <div className="relative z-10 w-full max-w-[708px] pb-6">
        <InputArea
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleDisplayResult={handleDisplayResult}
        />
      </div>

      {/* Powered by Atom AI section moved below the input box */}
      <a
        className="relative z-10 mt-4 inline-flex h-7 items-center gap-[9px] rounded-[50px] border-[0.5px] border-solid border-[#E6E6E6] bg-white px-3 py-4 shadow-[0px_1px_1px_0px_rgba(0,0,0,0.25)]"
        href="https://www.Zasti.ai/"
        target="_blank"
        rel="noopener noreferrer" // Security best practice for external links
      >
        <Image
          unoptimized
          src="/img/atom-TM-blue.svg"
          alt="hero"
          width={18}
          height={18}
        />
        <span className="text-center text-base font-light leading-[normal] text-[#1B1B16]">
          Powered by Atom AI
        </span>
      </a>

      {/* Suggestions section */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2.5 pb-[30px] lg:flex-nowrap lg:justify-normal">
        {suggestions.map((item) => (
          <div
            className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded border border-solid border-[#C1C1C1] bg-[#EDEDEA] px-2.5 py-2"
            onClick={() => handleClickSuggestion(item?.name)}
            key={item.id}
          >
            <Image
              unoptimized
              src={item.icon}
              alt={item.name}
              width={18}
              height={16}
              className="w-[18px]"
            />
            <span className="text-sm font-light leading-[normal] text-[#1B1B16]">
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  // Add suggestion objects here
];

export default Hero;
