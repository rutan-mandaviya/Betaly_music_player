// src/components/Loader.jsx
import React from "react";

export const Loader = () => (
  <div className="w-full h-screen flex justify-center items-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-lime-500 border-t-4 border-gray-200"></div>
  </div>
);
