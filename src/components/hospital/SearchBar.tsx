
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchType: 'name' | 'city' | 'specialty';
  setSearchType: (type: 'name' | 'city' | 'specialty') => void;
  handleSearch: () => void;
  clearSearch: () => void;
}

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  searchType,
  setSearchType,
  handleSearch,
  clearSearch
}: SearchBarProps) => {
  return (
    <Card className="glass-morphism">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Tabs 
              defaultValue={searchType} 
              className="w-full md:w-auto"
              onValueChange={(value) => setSearchType(value as 'name' | 'city' | 'specialty')}
            >
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="name">Name</TabsTrigger>
                <TabsTrigger value="city">City</TabsTrigger>
                <TabsTrigger value="specialty">Specialty</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            
            {searchTerm && (
              <Button variant="ghost" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchBar;
