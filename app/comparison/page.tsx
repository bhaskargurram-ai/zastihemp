"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ComparisonPage = () => {
  const router = useRouter();
  const [comparisonData, setComparisonData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const product = new URLSearchParams(window.location.search).get("product");
        if (product) {
          const response = await fetch("/api/getComparison", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ product }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch comparison data.");
          }

          const result = await response.json();
          setComparisonData(result.comparisonData);
        }
      } catch (error) {
        console.error(error);
        setComparisonData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!comparisonData) {
    return <div>Failed to load comparison data.</div>;
  }

  return (
    <div className="comparison-page">
      <h1>Comparison</h1>
      <pre>{comparisonData}</pre>
    </div>
  );
};

export default ComparisonPage;
