import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import ClaimRequestForm from '../components/ClaimRequestForm';

const FoundItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [foundItems, setFoundItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeClaimItemId, setActiveClaimItemId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/items/found_items/all')
      .then(res => res.json())
      .then(data => setFoundItems(data))
      .catch(err => console.error('Error fetching found items:', err));
  }, []);

  const handleChatAccess = async (itemId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/claims/accepted?userId=${user.id}&itemId=${itemId}`);
      const data = await res.json();
      if (data.hasAccess) {
        navigate(`/chat/${data.claimId}`);
      } else {
        setActiveClaimItemId(itemId);
      }
    } catch (err) {
      console.error('Error checking claim access:', err);
    }
  };

  const filteredItems = foundItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-green-700 mb-2">🔎 Found Items</h1>
          <p className="text-gray-600 mb-4">
            Browse items others have found. If you’ve found something not listed, help someone out by submitting a report.
          </p>

          {/* Search Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search found items by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
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

          {/* Report Button */}
          <div className="flex justify-end">
            <button
              onClick={() => navigate('/report-found-item')}
              className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition"
            >
              ➕ Report Found Item
            </button>
          </div>
        </div>

        {/* Found Items List */}
        <div className="overflow-y-auto max-h-[600px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.length === 0 ? (
            <p className="text-gray-500">No matching found items.</p>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border shadow p-4 flex flex-col">
                <img
                  src={`http://localhost:5000/uploads/${item.image_url}`}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h3 className="text-xl font-semibold text-green-700">{item.name}</h3>
                <p className="text-sm text-gray-600 mt-1">📍 {item.location}</p>
                <p className="text-sm text-gray-600 mt-1">📅 Found on: {new Date(item.date_found).toLocaleDateString()}</p>
                <p className="text-sm text-gray-700 mt-2">{item.description}</p>

                {/* Show claim option if logged-in user is not the one who reported it */}
                {user?.id && user.id !== item.user_id && (
                  <div className="mt-4">
                    {activeClaimItemId === item.id ? (
                      <div className="space-y-2">
                        <ClaimRequestForm
                          itemId={item.id}
                          requesterId={user.id}
                          onCancel={() => setActiveClaimItemId(null)}
                        />
                        <button
                          onClick={() => setActiveClaimItemId(null)}
                          className="px-4 py-1 border border-gray-400 text-gray-600 rounded-xl hover:bg-gray-100 transition"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleChatAccess(item.id)}
                        className="mt-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                      >
                        📨 Claim or Chat
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoundItems;
