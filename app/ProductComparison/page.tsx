"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

const ProductComparison = () => {
  const searchParams = useSearchParams();
  const product = searchParams.get('product'); 
  const [comparisonData, setComparisonData] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (product) {
      fetchComparisonData(product);
    }
  }, [product]);

  const fetchComparisonData = async (product: string) => {
    try {
      const response = await fetch("/api/compareProduct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch comparison data");
      }

      const data = await response.json();
      
      // Log the received data for debugging
      console.log("Comparison data received from API:", data);

      setComparisonData(data.answer);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching comparison data:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {product ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Product Comparison for {product}</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: comparisonData }} />
          )}
        </>
      ) : (
        <p>Loading product...</p>
      )}
    </div>
  );
};

export default ProductComparison;