import { useNavigate } from "@tanstack/react-router";
import React from "react";
import { useApp } from "../../contexts/AppContext";

const categories = [
  {
    name: "Men",
    image: "/assets/generated/category-men.dim_400x300.jpg",
    label: "men",
  },
  {
    name: "Women",
    image: "/assets/generated/category-women.dim_400x300.jpg",
    label: "women",
  },
  {
    name: "Kids",
    image: "/assets/generated/category-kids.dim_400x300.jpg",
    label: "kids",
  },
  {
    name: "Unisex",
    image: "/assets/generated/category-unisex.dim_400x300.jpg",
    label: "unisex",
  },
];

export function CategoryTiles() {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="grid grid-cols-4 gap-3 md:gap-4">
      {categories.map((cat) => (
        <button
          type="button"
          key={cat.name}
          onClick={() =>
            navigate({
              to: "/search",
              search: { category: cat.name, location: undefined },
            })
          }
          className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:border-gold-400 hover:shadow-gold transition-all duration-300 hover:-translate-y-1 active:scale-95"
        >
          <div className="w-14 h-14 md:w-20 md:h-20 rounded-xl overflow-hidden bg-charcoal-700">
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
          <span className="text-xs md:text-sm font-semibold text-foreground group-hover:text-gold-500 transition-colors">
            {t(cat.label)}
          </span>
        </button>
      ))}
    </div>
  );
}
