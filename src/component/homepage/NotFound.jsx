import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Layout from "../ui/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-3 sm:px-4 md:px-6">
        <div className="text-center max-w-xs sm:max-w-sm md:max-w-lg">
          {/* Emoji - RESPONSIVE */}
          <div className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl mb-4 sm:mb-5 md:mb-6">🤔</div>

          {/* Error Code - RESPONSIVE */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 text-foreground">
            404
          </h1>

          {/* Main Message - RESPONSIVE */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-4 sm:mb-5 md:mb-6">
            Oops! Page not found
          </p>

          {/* Description - RESPONSIVE */}
          <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-7 md:mb-8 px-2">
            The page you're looking for doesn't exist or has been moved.
          </p>

          {/* Home Button - RESPONSIVE */}
          <Link
            to="/"
            className="inline-block px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-lg transition-shadow text-sm sm:text-base md:text-lg"
          >
            Return to Home
          </Link>

          {/* Optional: Show the invalid path for debugging (can be hidden in production) */}
          <div className="mt-6 sm:mt-8 md:mt-10 p-3 sm:p-4 bg-secondary/30 rounded-lg">
            <p className="text-xs sm:text-sm text-muted-foreground mb-1">
              Attempted to access:
            </p>
            <code className="text-xs sm:text-sm font-mono text-foreground/70 break-all">
              {location.pathname}
            </code>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
