import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

export interface Patient {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export const getPatients = async (): Promise<Patient[]> => {
  const response = await API.get("patients/");
  return response.data;
};
