import React from "react";
import Navbar from "./components/Navigation";
import Banner from "./components/Banner";
import Courses from "./components/Courses";
import "./styles/global.css"; // ✅ Update this if your styles are in a different folder


function App() {
  return (
    <div>
      <Navbar />
      <Banner /> {/* ✅ Now the Banner will be visible */}
      <Courses /> 
      <main style={{ paddingTop: "80px" }}>
        
      </main>
    </div>
  );
}

export default App;
