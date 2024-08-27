"use client";

import Answer from "@/components/Answer";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import InputArea from "@/components/InputArea";
import SimilarTopics from "@/components/SimilarTopics";
import Sources from "@/components/Sources";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { useRef, useState } from "react";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export default function Home() {
  const [promptValue, setPromptValue] = useState("");
  const [question, setQuestion] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [answer, setAnswer] = useState("");
  const [similarQuestions, setSimilarQuestions] = useState<{
    marketResearch: string[];
    sales: string[];
    production: string[];
  }>({ marketResearch: [], sales: [], production: [] });
  const [category, setCategory] = useState<string>("");
  const [subcategory, setSubcategory] = useState<string>("");  // State for subcategory
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Define hemp product categories and subcategories
  const products = {
    "Hemp Seed": {
      "Hemp Oil": {
        Foods: [
          "*Hemp Seed Oil",
          "Margarine",
          "Food Supplements"
        ],
        "Technical Products": [
          "Oil Paints",
          "Varnishes",
          "Printing Inks",
          "Fuel",
          "Solvents",
          "Lubricants",
          "Putty",
          "Coatings",
          "Biofuel"
        ],
        "Personal Hygiene": [
          "Soap",
          "Shampoo",
          "Bath Gels",
          "Cosmetics"
        ]
      },
      "Hulled Seeds": [],
      "Shelled Hemp Seed": {
        Food: [
          "*Hemp Hearth",
          "*Hemp Meal (animal feed)",
          "*Hemp Seed Oil (animal feed)",
          "*Protein Milled Hemp Powder",
          "Protein Flour",
          "Beer Brewing"
        ]
      },
      "Seed Cake": {
        Food: [
          "*Hemp Meal (animal feed)",
          "*Hemp Seed Oil (animal feed)",
          "*Protein Milled Hemp Powder",
          "Protein Flour",
          "Beer Brewing"
        ]
      },
      "Seed for Sowing": {
        Seeds: [
          "*Hempnut Seed"
        ]
      }
    },
    "Hemp Fiber": {
      "Bast Fiber": {
        "Textiles (plain weave)": [
          "Apparel",
          "Diapers",
          "Fabrics",
          "Handbags",
          "Working Clothes",
          "Denim",
          "Socks",
          "Shoes",
          "Fine Textiles (from cottonized fibers)",
          "Underwear"
        ],
        "Technical Textiles": [
          "Twine",
          "Rope",
          "Hempwool",
          "Canvas Bag",
          "Carpets",
          "Geotextiles (erosion control mats)",
          "Tarps",
          "Fiber",
          "Nets"
        ],
        "Industrial Products": [
          "Agro Fiber Composites",
          "Compression Moulded Parts",
          "Brake/Clutch Linings",
          "Caulking",
          "Automotive (BioPlastics)"
        ],
        "Paper": [
          "Printing Paper",
          "Fine Paper",
          "Technical Filter Paper",
          "Newsprint",
          "Cardboard and Packaging"
        ]
      },
      "Hurds (shives)": {
        "*Hurd": [],
        "Paper": [
          "Printing Paper",
          "Fine Paper",
          "Technical Filter Paper",
          "Newsprint",
          "Cardboard and Packaging"
        ]
      },
      "Building Materials": [
        "Fiberboard",
        "Fiberglass Substitute",
        "Hempbrick",
        "Stucco and Mortar",
        "Hempcrete"
      ],
      "Animal": [
        "Animal Bedding",
        "Mulch"
      ]
    }
  };

  const handleDisplayResult = async (newQuestion?: string) => {
    newQuestion = newQuestion || promptValue;

    setShowResult(true);
    setLoading(true);
    setQuestion(newQuestion);
    setPromptValue("");

    await Promise.all([
      handleSourcesAndAnswer(newQuestion),
      handleSimilarQuestions(newQuestion),
    ]);

    setLoading(false);
  };

  async function handleSourcesAndAnswer(question: string) {
    setIsLoadingSources(true);
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    if (sourcesResponse.ok) {
      let sources = await sourcesResponse.json();

      setSources(sources);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const response = await fetch("/api/getAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question, sources }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 202) {
      const fullAnswer = await response.text();
      setAnswer(fullAnswer);
      return;
    }

    const data = response.body;
    if (!data) {
      return;
    }

    const onParse = (event: ParsedEvent | ReconnectInterval) => {
      if (event.type === "event") {
        const data = event.data;
        try {
          const text = JSON.parse(data).text ?? "";
          setAnswer((prev) => prev + text);
        } catch (e) {
          console.error(e);
        }
      }
    };

    const reader = data.getReader();
    const decoder = new TextDecoder();
    const parser = createParser(onParse);
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      parser.feed(chunkValue);
    }
  }

  async function handleSimilarQuestions(question: string) {
    let res = await fetch("/api/getSimilarQuestions", {
      method: "POST",
      body: JSON.stringify({ question }),
    });

    if (res.ok) {
      let data = await res.json();
      setSimilarQuestions({
        marketResearch: data.marketResearch || [],
        sales: data.sales || [],
        production: data.production || [],
      });

      // Log category and subcategory for debugging
      console.log("Category from backend:", data.category);
      console.log("Subcategory from backend:", data.subcategory);

      // Set the category and subcategory
      setCategory(data.category || "");
      setSubcategory(data.subcategory || ""); // Assuming the backend provides subcategory info
    }
  }

  const reset = () => {
    setShowResult(false);
    setPromptValue("");
    setQuestion("");
    setAnswer("");
    setSources([]);
    setSimilarQuestions({
      marketResearch: [],
      sales: [],
      production: [],
    });
    setCategory("");
    setSubcategory("");
  };

  return (
    <>
      <Header />
      {/* Full page background image container */}
      <div
        className="min-h-screen bg-green-800 bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('/img/Firefly Illustrated hemp field 69783.jpg')",
        }}
      >
        <main className="flex h-full">
          {/* Conditionally render Sidebar */}
          {question && <Sidebar category={category} subcategory={subcategory} products={products} />}
          <div className="flex-1 px-4 pb-4 flex flex-col">
            {!showResult && (
              <Hero
                promptValue={promptValue}
                setPromptValue={setPromptValue}
                handleDisplayResult={handleDisplayResult}
              />
            )}

            {showResult && (
              <div className="flex flex-col h-full justify-between">
                <div className="container w-full space-y-2">
                  <div className="container space-y-2">
                    <div className="container flex w-full items-start gap-3 px-5 pt-2 lg:px-10">
                      <div className="flex w-fit items-center gap-4">
                        <Image
                          unoptimized
                          src={"/img/message-question-circle.svg"}
                          alt="message"
                          width={30}
                          height={30}
                          className="size-[24px]"
                        />
                        <p className="pr-5 font-bold uppercase leading-[152%] text-black">
                          Question:
                        </p>
                      </div>
                      <div className="grow">&quot;{question}&quot;</div>
                    </div>
                    <>
                      {sources.length > 0 && (
                        <div className="bg-green-900 text-white p-4 rounded-lg mb-4 flex gap-2">
                          <Sources sources={sources} isLoading={isLoadingSources} />
                        </div>
                      )}
                      <Answer answer={answer} />
                      <SimilarTopics
                        similarQuestions={similarQuestions}
                        handleDisplayResult={handleDisplayResult}
                        reset={reset}
                        category={category}
                      />
                    </>
                  </div>

                  <div className="pt-1 sm:pt-2" ref={chatContainerRef}></div>
                </div>
                <div className="container px-4 lg:px-0">
                  <InputArea
                    promptValue={promptValue}
                    setPromptValue={setPromptValue}
                    handleDisplayResult={handleDisplayResult}
                    disabled={loading}
                    reset={reset}
                  />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

