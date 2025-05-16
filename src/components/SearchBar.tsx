
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = () => {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Open Google search in a new tab
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mb-8 animate-fade-in">
      <form onSubmit={handleSearch} className="relative">
        <Input
          type="text"
          placeholder="Search with Google..."
          className="pr-12 glass-input border-muted-foreground/20 focus:border-primary"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <Button 
          type="submit" 
          size="icon" 
          variant="ghost" 
          className="absolute right-1 top-1/2 -translate-y-1/2"
        >
          <Search className="h-5 w-5" />
        </Button>
      </form>
    </div>
  );
};

export default SearchBar;
