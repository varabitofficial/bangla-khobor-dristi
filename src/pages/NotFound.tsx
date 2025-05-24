
import { useLocation, Navigate } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Redirect /login to /auth since that's our auth page
  if (location.pathname === '/login') {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-bangla">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">৪০৪</h1>
        <p className="text-xl text-gray-600 mb-4">দুঃখিত! পেজটি খুঁজে পাওয়া যায়নি</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          হোমে ফিরে যান
        </a>
      </div>
    </div>
  );
};

export default NotFound;
