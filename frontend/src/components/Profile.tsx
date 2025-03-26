import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import "../styles/Profile.css";

interface ProfileData {
  full_name: string;
  age: number;
  gender: string;
  phone: string;
  birth_date: string;
  country: string;
  email: string;
  user?: {
    email: string;
  };
}

const Profile = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await axios.get("https://websitedrapaula.onrender.com/api/user/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfileData(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login");
        } else {
          console.error("Error fetching profile:", error);
          setProfileData(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading your profile...</div>;
  }

  if (!profileData) {
    return (
      <div className="error-message">
        Failed to load profile. Please try again later.
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1 className="profile-title">Perfil</h1>
      </div>
      <div className="profile-grid">
        <div className="profile-item">
          <span className="profile-label">Nome</span>
          <div className="profile-value">{profileData.full_name || "N/A"}</div>
        </div>
        <div className="profile-item">
          <span className="profile-label">Idade</span>
          <div className="profile-value">{profileData.age || "N/A"}</div>
        </div>
        <div className="profile-item">
          <span className="profile-label">Genero</span>
          <div className="profile-value">{profileData.gender || "N/A"}</div>
        </div>
        <div className="profile-item">
          <span className="profile-label">Telefone</span>
          <div className="profile-value">{profileData.phone || "N/A"}</div>
        </div>
        <div className="profile-item">
          <span className="profile-label">Data de Nascimento</span>
          <div className="profile-value">
            {profileData.birth_date
              ? format(new Date(profileData.birth_date), "MMMM d, yyyy")
              : "N/A"}
          </div>
        </div>
        <div className="profile-item">
          <span className="profile-label">País</span>
          <div className="profile-value">{profileData.country || "N/A"}</div>
        </div>

        <div className="profile-item">
          <span className="profile-label">Email</span>
          <div className="profile-value">
            {profileData.user?.email || profileData.email || "N/A"}
          </div>
        </div>

        <div className="profile-item">
          <span className="profile-label">Conta</span>
          <div className="profile-value">
            {profileData.user?.email || profileData.email || "Pessoal"}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
