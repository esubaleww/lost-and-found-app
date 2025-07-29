import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './Pages/AuthContext';
import {
  Menu, X, FilePlus, FileText, Shield, UserCircle, LogIn, UserPlus, Bell
} from 'lucide-react';
import './index.css';

const Homepage = () => {
  const [foundItems, setFoundItems] = useState([]);
  const [lostItems, setLostItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, token } = useAuth();
  const [foundSearchTerm, setFoundSearchTerm] = useState("");
  const [lostSearchTerm, setLostSearchTerm] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    fetch('https://server-production-82bb.up.railway.app/api/items/found_items/latest')
      .then(res => res.json())
      .then(data => setFoundItems(data))
      .catch(err => console.error('Failed to load found items:', err));

    fetch('https://server-production-82bb.up.railway.app/api/items/lost_items/latest')
      .then(res => res.json())
      .then(data => setLostItems(data))
      .catch(err => console.error('Failed to load lost items:', err));

    if (user && token) {
      fetch("https://server-production-82bb.up.railway.app/api/getProfile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProfileImage(data.profile_picture))
        .catch(err => console.error('Failed to fetch profile image:', err));

      fetch('https://server-production-82bb.up.railway.app/api/notifications/count', {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUnreadCount(data.count))
        .catch(err => console.error('Failed to fetch unread count:', err));
    }
  }, [user, token]);

  const filteredFoundItems = foundItems.filter(item =>
    item.name.toLowerCase().includes(foundSearchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(foundSearchTerm.toLowerCase())
  );

  const filteredLostItems = lostItems.filter(item =>
    item.name.toLowerCase().includes(lostSearchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(lostSearchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-400 via-white to-green-300 font-sans">
      {/* Header */}
      <header className="flex flex-row bg-slate-700 text-white p-4 justify-between items-center shadow-md relative">
        <div className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <img
            src="https://server-production-82bb.up.railway.app/uploads/logo.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border object-cover"
          />
          Lost & Found Portal
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden mr-4"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="w-7 h-7 text-white" /> : <Menu className="w-7 h-7 text-white" />}
        </button>

        {/* Desktop Nav */}
        <nav className="space-x-4 hidden md:flex items-center">
          <Link to="/" className="hover:underline transition-colors duration-300">Home</Link>
          <Link to="/lost-items" className="hover:underline transition-colors duration-300">Lost Items</Link>
          <Link to="/found-items" className="hover:underline transition-colors duration-300">Found Items</Link>

          <div className="relative group inline-block">
            <Link to="/profile">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-12 h-12 rounded-full border object-cover" />
              ) : user?.image ? (
                <img src={`https://server-production-82bb.up.railway.app/${user.image}?${Date.now()}`} alt="Profile" className="w-12 h-12 rounded-full border object-cover" />
              ) : (
                <UserCircle className="w-10 h-10 text-white" />
              )}
            </Link>
            <span className="absolute top-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
              View Profile
            </span>
          </div>

          {user ? (
            <>
              <Link to="/notifications">
                <div className="relative group">
                  <Bell className="w-7 h-7 text-white cursor-pointer" />
                  <span className="absolute top-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </Link>
              <Link to="/logout" className="hover:underline transition-colors duration-300">Logout</Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button className="flex items-center gap-1 bg-white text-blue-700 px-4 py-2 rounded hover:bg-gray-200 transition-colors duration-300 shadow">
                  <LogIn className="w-4 h-4" /> Login
                </button>
              </Link>
              <Link to="/register">
                <button className="ml-2 flex items-center gap-1 bg-yellow-400 text-white px-4 py-2 rounded hover:bg-yellow-500 transition-colors duration-300 shadow">
                  <UserPlus className="w-4 h-4" /> Register
                </button>
              </Link>
            </>
          )}
        </nav>

        {/* ✅ Mobile dropdown nav */}
        {isSidebarOpen && (
          <div className="md:hidden bg-white text-blue-800 shadow-md absolute top-[70px] right-0 w-64 z-50 rounded-bl-lg overflow-hidden border border-blue-200">
            <ul className="flex flex-col divide-y divide-blue-100">
              <li><Link to="/" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Home</Link></li>
              <li><Link to="/lost-items" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Lost Items</Link></li>
              <li><Link to="/found-items" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Found Items</Link></li>
              {user && (
                <>
                  <li><Link to="/profile" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Profile</Link></li>
                  <li>
                    <Link to="/notifications" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">
                      Notifications
                      {unreadCount > 0 && (
                        <span className="ml-2 inline-block bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  <li><Link to="/logout" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Logout</Link></li>
                </>
              )}
              {!user && (
                <>
                  <li><Link to="/login" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Login</Link></li>
                  <li><Link to="/register" onClick={() => setIsSidebarOpen(false)} className="block px-4 py-3 hover:bg-blue-100">Register</Link></li>
                </>
              )}
            </ul>
          </div>
        )}
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Mobile & Desktop) */}
          <aside
            className={`fixed top-[70px] left-0 w-64 h-full bg-white p-6 z-40 transition-transform duration-300 md:static md:translate-x-0 border-r
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:block`}
          >
            <h2 className="text-xl font-semibold mb-6">Quick Links</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/report-lost-item" className="flex items-center p-2 gap-2 rounded-lg hover:bg-yellow-50 transition-all">
                  <FilePlus className="w-5 h-5 text-yellow-600" /> Report Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found-item" className="flex items-center p-2 gap-2 rounded-lg hover:bg-green-50 transition-all">
                  <FilePlus className="w-5 h-5 text-green-600" /> Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/view-reports" className="flex items-center p-2 gap-2 rounded-lg hover:bg-purple-50 transition-all">
                  <FileText className="w-5 h-5 text-purple-600" /> View Reports
                </Link>
              </li>
              <li>
                <Link to="/admin" className="flex items-center p-2 gap-2 rounded-lg hover:bg-red-50 transition-all">
                  <Shield className="w-5 h-5 text-red-600" /> Admin Panel
                </Link>
              </li>
            </ul>
          </aside>


        {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto p-6 md:p-10 overflow-hidden">
          <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-blue-800 text-center">
            Welcome to BDU Lost & Found Portal
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col p-6 bg-blue-50 border border-blue-200 rounded-2xl shadow-md h-[500px]">
           <h2 className="text-2xl font-semibold mb-2 text-blue-700 group-hover:text-blue-800 transition-colors">
            Latest Lost Items
           </h2>
           <p className="text-gray-600 mb-4">Browse through recently reported lost items by students and staff.</p>

  {/* Search Input with Icon */}
      <div className="relative mb-3">
        <input
          type="text"
          placeholder="Search lost items..."
          value={lostSearchTerm}
          onChange={(e) => setLostSearchTerm(e.target.value)}
          className="w-full px-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-400"
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
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.5a7.5 7.5 0 010 9.15z" />
        </svg>
      </div>

  {/* Scrollable Item List */}
  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
    {filteredLostItems.length === 0 ? (
      <p className="text-sm text-gray-500">No lost items found for your search.</p>
    ) : (
      filteredLostItems.map(item => (
        <div key={item.id} className="border-b pb-4 flex gap-4">
          <a href= {`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}><img
            src={`https://server-production-82bb.up.railway.app/${item.image_url}`}
            alt={item.name}
            className="w-30 h-28 object-cover rounded-xl border shadow-sm"
          /></a>
          <div className="flex flex-col justify-between">
            <p className="font-semibold text-lg text-gray-900">{item.name}</p>
            <p className="text-sm text-gray-600">Location: {item.location}</p>
            <p className="text-sm text-gray-600">Lost by: {item.lost_by}</p>
            <p className="text-sm text-gray-700">Description: {item.description}</p>
            <p className="text-sm text-gray-500">
              Lost on: {new Date(item.date_lost).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))
    )}
  </div>
        
  {/* View All Button */}
  <Link to="/lost-items" className="mt-4">
    <button className="w-full px-4 py-2 rounded bg-gradient-to-r from-blue-500 to-blue-800 text-white font-medium shadow hover:scale-105 transform transition duration-300">
      View All Lost Items
    </button>
  </Link>
</section>

<section className="group transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl flex flex-col p-6 bg-green-50 border border-green-200 rounded-2xl shadow-md h-[500px]">
  <h2 className="text-2xl font-semibold mb-4 text-green-700 group-hover:text-green-800 transition-colors">Latest Found Items</h2>
  <p className="text-gray-600 mb-4">Browse recently reported found items on campus.</p>

  {/* 🔍 Search Input */}
  <div className="relative w-full mb-4">
  <svg
    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="20"
    height="20"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 7.5a7.5 7.5 0 010 9.15z" />
  </svg>
  <input
    type="text"
    placeholder="Search found items..."
    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    value={foundSearchTerm}
    onChange={(e) => setFoundSearchTerm(e.target.value)}
  />
</div>

  <div className="flex-1 overflow-y-auto space-y-3 pr-1">
    {filteredFoundItems.length === 0 ? (
      <p className="text-sm text-gray-500">No found items match your search.</p>
    ) : (
      filteredFoundItems.map(item => (
        <div key={item.id} className="border-b pb-4 flex gap-3">
          <a href= {`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}><img
            src={`https://server-production-82bb.up.railway.app/uploads/${item.image_url}`}
            alt={item.name}
            className="w-30 h-28 object-cover rounded-xl border shadow-sm"
            /></a>
            <div className="flex flex-col justify-between">
              <p className="font-semibold text-lg text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">Location: {item.location}</p>
              <p className="text-sm text-gray-600">Found by: {item.found_by}</p>
              <p className="text-sm text-gray-700">Description: {item.description}</p>
              <p className="text-sm text-gray-500">
                Found on: {new Date(item.date_found).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  
    <Link to="/found-items" className="mt-4">
      <button className="w-full px-4 py-2 rounded bg-gradient-to-r from-green-600 to-green-800 text-white font-medium shadow hover:scale-105 transform transition duration-300">
        View All Found Items
      </button>
    </Link>
  </section>
 </div>
  </main>
      </div>
      {/* Footer */}
      <footer className="bg-blue-900 text-white py-2 mt-auto shadow-inner">
            <div className="max-w-5xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
              <div>&copy; {new Date().getFullYear()} Lost&Found. All rights reserved.</div>
               <div className="space-x-4">
                <a href="mailto:esuwo2024@gmail.com" className="hover:underline">esuwo2024@gmail.com</a>
                <span>|</span>
                <a href="tel:+251933839525" className="hover:underline">+251 933 839 525</a>
                <span>|</span>
                <a href="https://www.linkedin.com/in/esubalew-worku-189591363" target="_blank" rel="noopener noreferrer" className="hover:underline">
                  LinkedIn
                </a>
             </div>
           </div>
        </footer>
    </div>
  );
};

export default Homepage;
