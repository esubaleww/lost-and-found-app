import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ViewReports = () => {
  const navigate = useNavigate();
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Fetch Found Items
    fetch("https://server-production-82bb.up.railway.app/api/items/found_items/all")
      .then((res) => res.json())
      .then((data) => setFoundItems(data))
      .catch((err) => console.error("Error fetching found items:", err));

    // Fetch Lost Items
    fetch("https://server-production-82bb.up.railway.app/api/items/lost_items/all")
      .then((res) => res.json())
      .then((data) => setLostItems(data))
      .catch((err) => console.error("Error fetching lost items:", err));
  }, []);

  const filterItems = (items, type) =>
    items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const filteredFound = filterItems(foundItems);
  const filteredLost = filterItems(lostItems);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🔎 All Items
          </h1>
          <p className="text-gray-600 mb-4">
            Search through all reported lost and found items.
          </p>

          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search items by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none"
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

          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate("/report-lost-item")}
              className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition"
            >
              ➕ Report Lost Item
            </button>
            <button
              onClick={() => navigate("/report-found-item")}
              className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
            >
              ➕ Report Found Item
            </button>
          </div>
        </div>

        {/* Lost Items */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold text-red-600 mb-4">
            🔍 Lost Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLost.length === 0 ? (
              <p className="text-gray-500">No matching lost items.</p>
            ) : (
              filteredLost.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border shadow p-4 flex flex-col"
                >
                  <a href={`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}>
                  <img
                    src={`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
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
                  <p className="text-sm text-gray-700 mt-2">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Found Items */}
        <div>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            📦 Found Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFound.length === 0 ? (
              <p className="text-gray-500">No matching found items.</p>
            ) : (
              filteredFound.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border shadow p-4 flex flex-col"
                >
                  <a href={`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}>
                  <img
                    src={`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}
                    alt={item.name}
                    className="w-full h-48 object-cover rounded-xl mb-4"
                  />
                  </a>
                  <h3 className="text-xl font-semibold text-green-700">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    📍 {item.location}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    📅 Found on:{" "}
                    {new Date(item.date_found).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-700 mt-2">
                    {item.description}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReports;
