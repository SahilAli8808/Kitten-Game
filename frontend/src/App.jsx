// src/App.jsx
import React from "react";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header"; // Import the Header
import { Separator } from "@radix-ui/themes";

function App() {
  return (
    <div className="flex flex-col">
      {/* Header Component */}
      <Header />

      {/* Main Content Area (below the header) */}
      <div className="flex flex-grow pt-16"> {/* Added pt-16 to offset the fixed header */}
        {/* Left Panel - Game Details */}
        <div className="w-3/4 flex items-center justify-center">
          <LeftPanel />
        </div>

        {/* Separator */}
        <Separator
          orientation="vertical"
          size="3"
          style={{
            height: "80%",
            width: "2px",
            // backgroundColor: "#e5e7eb", // Light gray color for better visibility
            margin: "auto",
          }}
        />

        {/* Right Panel - Leaderboard */}
        <div className="w-1/3 mt-16 ml-8">
          <RightPanel />
        </div>

        {/* Optional Empty Div (adjust if needed) */}
        <div className="w-1/5"></div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
