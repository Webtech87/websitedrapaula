import { useState, useEffect } from "react";
import { getPatients } from "./api";

function App() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    getPatients().then((data) => setPatients(data));
  }, []);

  return (
    <div>
      <h1>Website Dra.Paula</h1>
      <ul>
        {patients.map((patient) => (
          <li key={patient.id}>{patient.name} - {patient.email}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
