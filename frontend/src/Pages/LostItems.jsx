import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ClaimRequestForm from "../components/ClaimRequestForm"; // Update path as needed
import { useAuth } from "./AuthContext";

const LostItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/items/lost_items/all")
      .then((res) => res.json())
      .then((data) => setLostItems(data))
      .catch((err) => console.error("Error fetching lost items:", err));
  }, []);

  const filteredItems = lostItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            🔍 Lost Items
          </h1>
          <p className="text-gray-600 mb-4">
            Search the list below to see if someone has reported your lost item.
            If not, report it to help others help you!
          </p>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search lost items by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-red-300 focus:outline-none"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.5a7.5 7.5 0 010 9.15z"
              />
            </svg>
          </div>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/report-lost-item")}
            className="bg-red-600 text-white px-5 py-2 rounded-xl hover:bg-red-700 transition"
          >
            ➕ Report Lost Item
          </button>
        </div>

        <div className="overflow-y-auto max-h-[600px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <p className="text-gray-500">No matching lost items.</p>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border shadow p-4 flex flex-col"
              >
                <img
                  src={`http://localhost:5000/uploads/${item.image_url}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <a
                  href={`http://localhost:5000/uploads/${item.image_url}`}
                  download
                  className="text-blue-500 hover:underline"
                >
                  See Full Image
                </a>
                <h3 className="text-xl font-semibold text-red-600">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📍 Last seen: {item.location}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  📅 Lost on: {new Date(item.date_lost).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-700 mt-2">{item.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default LostItems;
