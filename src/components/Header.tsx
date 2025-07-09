
import React, { useState } from "react";
import { Search, Calendar, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SearchResults from "./SearchResults";
import UserMenu from "./UserMenu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { data: categories } = useCategories();
  const { searchResults, isLoading, isSearching, performSearch, clearSearch } = useSearch();
  const { user, signOut } = useAuth();

  // Check if user has admin or editor role
  const [userRole, setUserRole] = useState<string | null>(null);

  // Fetch user role when user changes
  React.useEffect(() => {
    const fetchUserRole = async () => {
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setUserRole(profile?.role || null);
      } else {
        setUserRole(null);
      }
    };

    fetchUserRole();
  }, [user]);

  const canAccessDashboard = userRole === 'admin' || userRole === 'editor';

  const handleLogout = async () => {
    await signOut();
  };

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return today.toLocaleDateString('bn-BD', options);
  };

  // Define category order and mapping with updated categories
  const categoryOrder = [
    'বিশেষ', 'রাজনীতি', 'অর্থ-বাণিজ্য', 'বাংলাদেশ', 'নারায়ণগঞ্জ', 
    'বিশ্ব', 'ধর্ম', 'শিক্ষা', 'আদালত', 'স্বাস্থ্য', 'প্রযুক্তি', 
    'সংস্কৃতি', 'বিনোদন'
  ];
  
  const getOrderedCategories = () => {
    if (!categories) return [];
    
    const categoriesMap = new Map();
    categories.forEach(cat => {
      categoriesMap.set(cat.name, cat);
    });
    
    return categoryOrder
      .map(name => categoriesMap.get(name))
      .filter(Boolean);
  };

  const navigationCategories = getOrderedCategories();

  // Mock subcategories for নারায়ণগঞ্জ (you can fetch these from database later)
  const narayanganjSubcategories = [
    { name: 'সিটি কর্পোরেশন', slug: 'narayanganj-city-corporation' },
    { name: 'শিল্প-কারখানা', slug: 'narayanganj-industry' },
    { name: 'শিক্ষা প্রতিষ্ঠান', slug: 'narayanganj-education' },
    { name: 'স্বাস্থ্য সেবা', slug: 'narayanganj-health' },
    { name: 'অপরাধ', slug: 'narayanganj-crime' },
    { name: 'রাজনীতি', slug: 'narayanganj-politics' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      performSearch(searchInput.trim());
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    
    if (value.trim()) {
      performSearch(value.trim());
    } else {
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    clearSearch();
  };

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Top Date Bar */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{getCurrentDate()}</span>
            </div>
            <div className="flex gap-4">
              {user ? (
                <>
                  {canAccessDashboard && (
                    <Link to="/admin" className="hover:text-black transition-colors">ড্যাশবোর্ড</Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="hover:text-black transition-colors"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-black transition-colors">লগইন</Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo with Slogan */}
          <Link to="/" className="flex flex-col items-start">
            <img src="/logo.svg" alt="NewsViewBD" className="h-12 md:h-16" />
            <span className="text-sm text-gray-600 mt-1 font-medium text-right w-full">জাগতে আর জাগাতে</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {navigationCategories.map((category) => (
                  <NavigationMenuItem key={category.id}>
                    {category.name === 'নারায়ণগঞ্জ' ? (
                      <>
                        <NavigationMenuTrigger className="text-gray-700 hover:text-black transition-colors text-sm bg-transparent hover:bg-gray-100 data-[state=open]:bg-gray-100">
                          {category.name}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <div className="w-64 p-4 bg-white border border-gray-200 shadow-lg rounded-md">
                            <div className="grid gap-2">
                              <Link 
                                to={`/category/${category.slug}`}
                                className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                              >
                                সব খবর
                              </Link>
                              {narayanganjSubcategories.map((subcategory) => (
                                <Link 
                                  key={subcategory.slug}
                                  to={`/category/narayanganj/${subcategory.slug}`}
                                  className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  {subcategory.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink asChild>
                        <Link 
                          to={`/category/${category.slug}`} 
                          className="text-gray-700 hover:text-black transition-colors text-sm px-3 py-2 rounded-md hover:bg-gray-100"
                        >
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </nav>

          {/* Search Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <form onSubmit={handleSearchSubmit}>
                <input
                  type="text"
                  placeholder="খুঁজুন..."
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </form>
              
              {isSearching && (
                <SearchResults
                  results={searchResults}
                  isLoading={isLoading}
                  onClose={clearSearch}
                  query={searchInput}
                />
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 my-1 transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block w-5 h-0.5 bg-gray-600 transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navigationCategories.map((category) => (
                <div key={category.id}>
                  {category.name === 'নারায়ণগঞ্জ' ? (
                    <div>
                      <Link 
                        to={`/category/${category.slug}`} 
                        className="text-gray-700 hover:text-black transition-colors block py-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {category.name}
                      </Link>
                      <div className="ml-4 mt-2 space-y-2">
                        {narayanganjSubcategories.map((subcategory) => (
                          <Link 
                            key={subcategory.slug}
                            to={`/category/narayanganj/${subcategory.slug}`}
                            className="text-gray-600 hover:text-black transition-colors block py-1 text-sm"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            • {subcategory.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link 
                      to={`/category/${category.slug}`} 
                      className="text-gray-700 hover:text-black transition-colors block py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  )}
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-200 relative">
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="খুঁজুন..."
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>
                
                {isSearching && (
                  <SearchResults
                    results={searchResults}
                    isLoading={isLoading}
                    onClose={clearSearch}
                    query={searchInput}
                  />
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
