"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface SidebarProps {
  category: string;
  subcategory: string;
  products: Record<string, any>;
  highlightProduct?: string; // New prop to indicate which product to highlight
}

const Sidebar: React.FC<SidebarProps> = ({ category, subcategory, products, highlightProduct }) => {
  const router = useRouter();
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openSubCategory, setOpenSubCategory] = useState<string | null>(null);

  useEffect(() => {
    if (category) {
      const formattedCategory = category.toLowerCase().replace(/\s+/g, "");
      setOpenCategory(formattedCategory);

      if (subcategory && products[category] && products[category][subcategory]) {
        setOpenSubCategory(subcategory);
      } else {
        setOpenSubCategory(null);
      }
    }
  }, [category, subcategory, products]);

  const toggleCategory = (cat: string) => {
    setOpenCategory(openCategory === cat ? null : cat);
    setOpenSubCategory(null);
  };

  const toggleSubCategory = (subCat: string) => {
    setOpenSubCategory(openSubCategory === subCat ? null : subCat);
  };

  const navigateToComparison = (product: string) => {
    const queryParams = new URLSearchParams();
    queryParams.append("product", product); // Only append the clicked product

    router.push(`/ProductComparison?${queryParams.toString()}`);
  };

  return (
    <div className="sidebar bg-green-900 text-white p-4 h-full w-64">
      <h2 className="text-lg font-bold mb-4">Related Products</h2>
      <ul>
        {Object.keys(products).map((prodCategory) => {
          const formattedCategory = prodCategory.toLowerCase().replace(/\s+/g, "");
          return (
            <li key={prodCategory} className="mb-2">
              <button
                className={`w-full text-left p-2 rounded ${
                  openCategory === formattedCategory
                    ? "bg-yellow-500 text-black"
                    : "bg-green-600 text-white"
                }`}
                onClick={() => toggleCategory(formattedCategory)}
              >
                {prodCategory}
              </button>
              {openCategory === formattedCategory && (
                <ul className="mt-2">
                  {Object.entries(products[prodCategory]).map(([subCategory, items]) => (
                    <li key={subCategory} className="mb-2">
                      {Array.isArray(items) && items.length > 0 ? (
                        items.map((product: string) => (
                          <li key={product}>
                            <button
                              onClick={() => navigateToComparison(product)}
                              className={`block text-sm p-2 hover:bg-yellow-400 hover:text-black w-full text-left ${
                                highlightProduct === product ? "bg-red-500 text-white" : ""
                              }`} // Apply highlight style if product matches
                            >
                              {product}
                            </button>
                          </li>
                        ))
                      ) : typeof items === 'object' && Object.keys(items).length > 0 ? (
                        <>
                          <button
                            className={`w-full text-left p-2 rounded ${
                              openSubCategory === subCategory
                                ? "bg-yellow-400 text-black"
                                : "bg-green-500 text-white"
                            }`}
                            onClick={() => toggleSubCategory(subCategory)}
                          >
                            {subCategory}
                          </button>
                          {openSubCategory === subCategory && (
                            <ul className="ml-4 mt-2">
                              {Object.entries(items).map(([innerSubCategory, innerItems]) => (
                                <li key={innerSubCategory} className="mb-2">
                                  {Array.isArray(innerItems) && innerItems.length > 0 ? (
                                    innerItems.map((innerProduct: string) => (
                                      <li key={innerProduct}>
                                        <button
                                          onClick={() =>
                                            navigateToComparison(innerProduct)
                                          }
                                          className={`block text-sm p-2 hover:bg-yellow-400 hover:text-black w-full text-left ${
                                            highlightProduct === innerProduct ? "bg-red-500 text-white" : ""
                                          }`} // Apply highlight style if product matches
                                        >
                                          {innerProduct}
                                        </button>
                                      </li>
                                    ))
                                  ) : (
                                    <button
                                      className={`w-full text-left p-2 rounded ${
                                        openSubCategory === innerSubCategory
                                          ? "bg-yellow-400 text-black"
                                          : "bg-green-500 text-white"
                                      }`}
                                      onClick={() => toggleSubCategory(innerSubCategory)}
                                    >
                                      {innerSubCategory}
                                    </button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
