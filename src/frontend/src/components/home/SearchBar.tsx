import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import type React from "react";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: { location: query, category: undefined },
    });
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex gap-2 w-full max-w-2xl mx-auto"
    >
      <div className="relative flex-1">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by city or pincode..."
          className="pl-10 h-12 rounded-xl bg-white/90 dark:bg-card/90 border-border text-base"
        />
      </div>
      <Button
        type="submit"
        className="btn-gold h-12 px-6 rounded-xl gap-2 text-base font-semibold"
      >
        <Search className="w-4 h-4" />
        Search
      </Button>
    </form>
  );
}
