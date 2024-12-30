import { Loader } from "lucide-react";
import React from "react";

const loading = () => {
  return (
    <div className="h-screen flex items-center justify-center">
      <Loader className="animate-spin h-10 w-10 mr-2" />
    </div>
  );
};

export default loading;
