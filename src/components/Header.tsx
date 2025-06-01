import React, { useState } from "react";
import { Search, Calendar, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useSearch } from "@/hooks/useSearch";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import SearchResults from "./SearchResults";
import UserMenu from "./UserMenu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const { data: categories } = useCategories();
  const { searchResults, isLoading, isSearching, performSearch, clearSearch } = useSearch();
  const { user } = useAuth();

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

  // Get the first few categories to display in navigation, including politics
  const getNavigationCategories = () => {
    if (!categories) return [];
    
    // Always include politics if it exists
    const politicsCategory = categories.find(cat => cat.slug === 'politics' || cat.name === 'রাজনীতি');
    const otherCategories = categories.filter(cat => cat.slug !== 'politics' && cat.name !== 'রাজনীতি').slice(0, 5);
    
    const navCategories = politicsCategory ? [politicsCategory, ...otherCategories] : otherCategories.slice(0, 6);
    return navCategories;
  };

  const navigationCategories = getNavigationCategories();

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
              {canAccessDashboard && (
                <Link to="/admin" className="hover:text-black transition-colors">ড্যাশবোর্ড</Link>
              )}
              <Link to="/login" className="hover:text-black transition-colors">লগইন</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-black">নিউজ ভিউ বাংলাদেশ</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-black transition-colors">হোম</Link>
            {navigationCategories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.slug}`} 
                className="text-gray-700 hover:text-black transition-colors"
              >
                {category.name}
              </Link>
            ))}
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
              <Link to="/" className="text-gray-700 hover:text-black transition-colors">হোম</Link>
              {navigationCategories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/category/${category.slug}`} 
                  className="text-gray-700 hover:text-black transition-colors"
                >
                  {category.name}
                </Link>
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
