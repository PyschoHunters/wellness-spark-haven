
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-fitness-gray-light">
      <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-sm animate-fade-up">
        <div className="w-20 h-20 mx-auto mb-6 bg-fitness-gray-light rounded-full flex items-center justify-center">
          <span className="text-4xl">🤔</span>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-fitness-dark">Page Not Found</h1>
        <p className="text-fitness-gray mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-fitness-primary text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:shadow-md"
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
