import { useEffect, useState } from "react";
import { useAuth } from "../Pages/AuthContext";
import { motion } from "framer-motion";
import { UserCircle, Mail, Phone } from "lucide-react";

const Profile = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formDataState, setFormDataState] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/getProfile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (res.ok) {
          setProfile(data);
          setFormDataState({
            name: data.full_name,
            email: data.email,
            phone: data.phone,
          });
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleFileChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSaveClick = async () => {
    const formData = new FormData();
    formData.append("full_name", formDataState.name);
    formData.append("phone", formDataState.phone);

    if (profileImage) {
      formData.append("profile_picture", profileImage);
    }

    try {
      const res = await fetch("http://localhost:5000/api/updateProfile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`, // Include auth token
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setProfile(data); // Update profile view
        setFormDataState({
          name: data.full_name,
          email: data.email,
          phone: data.phone,
        });
        setIsEditing(false);
      } else {
        console.error("Error updating profile:", data.message);
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  if (loading) return <p className="text-center">Loading profile...</p>;
  if (!profile)
    return <p className="text-center text-red-500">Failed to load profile.</p>;
  return (
    <motion.div
      className="max-w-lg mx-auto bg-gradient-to-r from-blue-100 to-blue-200 p-8 rounded-xl shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">
        My Profile
      </h2>

      {/* Profile Picture */}
      <div className="flex justify-center mb-6">
        {profile.profile_picture ? (
          <img
            src={profile.profile_picture} // Correct image path
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
            <UserCircle size={64} />
          </div>
        )}
      </div>

      {/* Profile Form */}
      <div className="space-y-4">
        {/* Full Name */}
        <div className="flex items-center space-x-3">
          <UserCircle className="text-blue-500" />
          {isEditing ? (
            <input
              type="text"
              value={formDataState.name}
              onChange={(e) =>
                setFormDataState({ ...formDataState, name: e.target.value })
              }
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-xl font-medium">{profile.full_name || "N/A"}</p>
          )}
        </div>

        {/* Email (Not editable) */}
        <div className="flex items-center space-x-3">
          <Mail className="text-blue-500" />
          <p className="text-xl font-medium">{profile.email || "N/A"}</p>
        </div>

        {/* Phone */}
        <div className="flex items-center space-x-3">
          <Phone className="text-blue-500" />
          {isEditing ? (
            <input
              type="text"
              value={formDataState.phone}
              onChange={(e) =>
                setFormDataState({ ...formDataState, phone: e.target.value })
              }
              className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-xl font-medium">{profile.phone || "N/A"}</p>
          )}
        </div>

        {/* Image Upload */}
        {isEditing && (
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="p-2 rounded-md border border-gray-300"
            />
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
