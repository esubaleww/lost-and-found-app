import React, { useEffect, useState } from 'react';

const AdminPanel = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = () => {
    fetch('http://localhost:5000/api/items/found_items/latest')
      .then(res => res.json())
      .then(data => setFoundItems(data))
      .catch(err => console.error('Failed to load found items:', err));

    fetch('http://localhost:5000/api/items/lost_items/latest')
      .then(res => res.json())
      .then(data => setLostItems(data))
      .catch(err => console.error('Failed to load lost items:', err));
  };

  const updateFoundStatus = (id, status) => {
    fetch(`http://localhost:5000/api/items/found_items/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(loadItems);
  };

  const updateLostStatus = (id, status) => {
    fetch(`http://localhost:5000/api/items/lost_items/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).then(loadItems);
  };

  const deleteItem = (type, id) => {
    const endpoint = `http://localhost:5000/api/items/${type}_items/${id}`;
    fetch(endpoint, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error('Delete failed');
        loadItems();
      })
      .catch(err => {
        console.error(`Failed to delete ${type} item:`, err);
        alert(`Failed to delete ${type} item. Check the backend.`);
      });
  };  

  const statusStyle = (status) =>
    status === 'claimed' || status === 'resolved'
      ? 'text-green-600 font-semibold'
      : 'text-red-600 font-semibold';

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">🔐 Admin Panel</h1>

      <div className="flex gap-6 mb-12">
        {/* Found Items */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-green-700 mb-4">📦 Found Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
            {foundItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow border flex gap-4 relative">
                <img
                  src={`http://localhost:5000/uploads/${item.image_url}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Location: {item.location}</p>
                  <p className="text-sm text-gray-500">Date Found: {new Date(item.date_found).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm">
                    Status: <span className={statusStyle(item.status)}>{item.status}</span>
                  </p>
                  <select
                    value={item.status}
                    onChange={e => updateFoundStatus(item.id, e.target.value)}
                    className="mt-2 w-full px-3 py-1 border rounded bg-gray-100"
                  >
                    <option value="unclaimed">Unclaimed</option>
                    <option value="claimed">Claimed</option>
                  </select>
                  <button
                    onClick={() => deleteItem('found', item.id)}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lost Items */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-red-700 mb-4">🧳 Lost Items</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
            {lostItems.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-lg shadow border flex gap-4 relative">
                <img
                  src={`http://localhost:5000/uploads/${item.image_url}`}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded border"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Location: {item.location}</p>
                  <p className="text-sm text-gray-500">Date Lost: {new Date(item.date_lost).toLocaleDateString()}</p>
                  <p className="mt-2 text-sm">
                    Status: <span className={statusStyle(item.status)}>{item.status}</span>
                  </p>
                  <select
                    value={item.status}
                    onChange={e => updateLostStatus(item.id, e.target.value)}
                    className="mt-2 w-full px-3 py-1 border rounded bg-gray-100"
                  >
                    <option value="unresolved">Unresolved</option>
                    <option value="resolved">Resolved</option>
                  </select>
                  <button
                    onClick={() => deleteItem('lost', item.id)}
                    className="mt-3 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
