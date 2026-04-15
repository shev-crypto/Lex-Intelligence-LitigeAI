import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <div className="text-center space-y-6">
        <div className="text-8xl font-heading text-gold">404</div>
        <h1 className="text-2xl font-heading text-white">Page Not Found</h1>
        <p className="text-white/50 max-w-md mx-auto font-body">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/">
            <Button className="bg-gold text-ink hover:bg-gold/90 font-semibold gap-2">
              <Home className="h-4 w-4" /> Go Home
            </Button>
          </Link>
          <Button variant="outline" className="border-white/20 text-white hover:bg-white/5" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
