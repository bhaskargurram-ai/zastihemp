// components/Sidebar.js

"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = ({ category, products }) => {
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState(null);

  useEffect(() => {
    if (category) {
      setOpenCategory(category.toLowerCase().replace(/\s+/g, ""));
    }
  }, [category]);

  const toggleCategory = (cat) => {
    setOpenCategory(openCategory === cat ? null : cat);
  };

  const navigateToComparison = (product) => {
    router.push(`/comparison?product=${encodeURIComponent(product)}`);
  };

  return (
    <div className="sidebar bg-green-700 text-white p-4 h-full w-64">
      <h2 className="text-lg font-bold mb-4">Related Products</h2>
      <ul>
        {Object.keys(products).map((prodCategory) => (
          <li key={prodCategory} className="mb-2">
            <button
              className={`w-full text-left p-2 rounded ${
                openCategory === prodCategory.toLowerCase().replace(/\s+/g, "")
                  ? "bg-green-500"
                  : "bg-green-600"
              }`}
              onClick={() => toggleCategory(prodCategory)}
            >
              {prodCategory}
            </button>
            {openCategory === prodCategory.toLowerCase().replace(/\s+/g, "") && (
              <ul className="mt-2">
                {products[prodCategory].map((product) => (
                  <li key={product}>
                    <button
                      onClick={() => navigateToComparison(product)}
                      className="block text-sm p-2 hover:bg-green-500 w-full text-left"
                    >
                      {product}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
