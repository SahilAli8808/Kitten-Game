// src/App.jsx
import React from "react";
import LeftPanel from "./components/LeftPanel/LeftPanel";
import RightPanel from "./components/RightPanel/RightPanel";
import {Toaster} from "react-hot-toast"

function App() {
  
  return (
    <div className="flex h-screen ">
      {/* Left Panel - Game Details */}
      <div className="w-3/4 flex items-center justify-center">
        <LeftPanel />
      </div>
      {/* Right Panel - Leaderboard */}
      <div className="w-1/3 mt-16 ml-20">
        <RightPanel />
      </div>
      <div className="w-1/5">
        {/* <RightPanel /> */}
      </div>
      <Toaster/>
    </div>
  );
}

export default App;
