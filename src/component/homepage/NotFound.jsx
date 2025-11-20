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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">🤔</div>

          <h1 className="text-5xl font-bold mb-4 text-foreground">404</h1>

          <p className="text-xl text-muted-foreground mb-6">
            Oops! Page not found
          </p>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <Link
            to="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full hover:shadow-lg transition-shadow"
          >
            Return to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
