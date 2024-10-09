// src/App.jsx
import React from "react";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import { Toaster } from "react-hot-toast";
import Header from "./components/Header"; // Import the Header
import { Separator } from "@radix-ui/themes";

function App() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header Component */}
      <Header />

      {/* Main Content Area (below the header) */}
      <div className="flex flex-grow pt-16 overflow-hidden flex-col md:flex-row"> {/* Use flex-col for mobile and md:flex-row for larger screens */}
        
        {/* Left Panel - Game Details */}
        <div className="flex-grow flex items-center justify-center px-4 md:px-8"> {/* Use flex-grow for responsiveness */}
          <LeftPanel />
        </div>
   {/* Separator */}
   {/* <Separator
          orientation="vertical"
          size="3"
          style={{
            height: "80%",
            width: "2px",
            margin: "auto",
          }}
        /> */}
        {/* Right Panel - Leaderboard */}
        <div className="flex flex-col w-full md:w-1/3 mt-4 md:mt-16 md:mr-20 px-4"> {/* Change to w-full for mobile and md:w-1/3 for larger screens */}
          <RightPanel />
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
