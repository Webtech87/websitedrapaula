import Navbar from "./components/Navigation";

function App() {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>
        <h1>Welcome to MedSnap</h1>
        <p>This is a test page for the responsive navbar.</p>
      </main>
    </div>
  );
}

export default App;
