import React from "react";
import Signup from "./components/Signup";
import UserCard from "./components/User";
import Navigation from "./routes/Navigation";

function App() {

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Navigation />
    </div>
  );
}

export default App;
