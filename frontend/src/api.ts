import axios from "axios";

const API = axios.create({
  baseURL: "https://websitedrapaula-v2.onrender.com/api/",
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
