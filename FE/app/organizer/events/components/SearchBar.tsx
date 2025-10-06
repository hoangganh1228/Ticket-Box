import { Input, Button } from "antd";

interface SearchBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
}

export default function SearchBar({ searchValue, onSearchChange, onSearch }: SearchBarProps) {
  return (
    <div className="flex w-full sm:w-96 items-center">
      <Input 
        placeholder="Tìm kiếm sự kiện" 
        className="rounded-l-lg text"
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onPressEnter={onSearch}
      />
      <Button 
        type="primary" 
        className="rounded-r-lg text-white ml-1 bg-primary hover:primaryHover"
        onClick={onSearch}
      >
        Tìm kiếm
      </Button>
    </div>
  );
}
