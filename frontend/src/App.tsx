import Navbar from "./components/Navigation";
import Banner from "./components/Banner";
import Courses from "./components/Courses";

import Mentorship from "./components/pages/Mentorship";
import Books from "./components/pages/Books";
import About from "./components/pages/About";
import Imersoes from "./components/pages/Imersoes";

import Lancamentos from "./components/pages/Lancamentos";  // ✅ Import the new section
import "./styles/global.css";

function App() {
  return (
    <div>
      <Navbar />
      <Banner />
      <Courses />
      <Mentorship />
      <Books />
      <About />
      <Imersoes />
      <Lancamentos />  {/* ✅ Add the Lançamentos section below Imersões */}
    </div>
  );
}

export default App;
