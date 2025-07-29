import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Pages/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notifications = () => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [autoMarkRead, setAutoMarkRead] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !token) return;

    Promise.all([
      fetch(`https://server-production-82bb.up.railway.app/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json()),
      fetch(`https://server-production-82bb.up.railway.app/api/notifications/count`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json())
    ])
      .then(([notificationsData, unreadCountData]) => {
        if (!Array.isArray(notificationsData)) {
          throw new Error('Invalid notifications response');
        }

        setNotifications(notificationsData);
        setUnreadCount(unreadCountData.count);

        notificationsData
          .filter(n => !n.is_read)
          .forEach(n => toast.info(n.message, { toastId: n.id }));

        if (autoMarkRead) {
          notificationsData
            .filter(n => !n.is_read)
            .forEach(n => handleMarkAsRead(n.id, false));
        }
      })
      .catch(err => {
        console.error('Failed to fetch notifications:', err);
        toast.error('Failed to load notifications');
      })
      .finally(() => setLoading(false));
  }, [user?.id, token, autoMarkRead]);

  const handleMarkAsRead = (id, updateCount = true) => {
    fetch(`https://server-production-82bb.up.railway.app/api/notifications/read/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      if (updateCount) {
        setUnreadCount(prev => Math.max(prev - 1, 0));
      }
    }).catch(err => {
      console.error('Error marking as read:', err);
      toast.error('Failed to mark notification as read');
    });
  };

  const formatTimestamp = (timestamp) => {
    const now = Date.now();
    const diffInSeconds = Math.floor((now - new Date(timestamp)) / 1000);
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
    if (diffInSeconds < 3600) return rtf.format(Math.floor(-diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(Math.floor(-diffInSeconds / 3600), 'hour');
    if (diffInSeconds < 2592000) return rtf.format(Math.floor(-diffInSeconds / 86400), 'day');
    if (diffInSeconds < 31536000) return rtf.format(Math.floor(-diffInSeconds / 2592000), 'month');
    return rtf.format(Math.floor(-diffInSeconds / 31536000), 'year');
  };

  return (
    <div className="bg-gradient-to-r from-violet-300 to-green-200  min-h-screen">
    <div className="max-w-3xl mx-auto p-6 bg-slate-400 rounded-xl">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-white">
          Notifications ({unreadCount} unread)
        </h2>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={autoMarkRead}
            onChange={() => setAutoMarkRead(!autoMarkRead)}
          />
          <span className="text-sm">Auto-mark as read</span>
        </label>
      </div>

      {loading ? (
        <div>Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <p>No notifications found.</p>
      ) : (
        notifications.map(n => {
          return (
            <div
              key={n.id}
              className={`p-4 mb-3 rounded shadow ${n.is_read ? 'bg-gray-100' : 'bg-yellow-100'}`}
            >
              <p className="mb-1">{n.message}</p>
              <p className="text-xs text-gray-500 mb-2">
                {formatTimestamp(n.created_at)}
              </p>

              {/* Claim request received (user is finder) */}
              {n.type === "claim" && n.item_id && (
                <Link
                  to={`/claims/${n.item_id}`}
                  className="inline-block mt-1 text-blue-600 underline text-sm"
                >
                  View Claims
                </Link>
              )}

              {/* Claim approved - Go to chat */}
              {n.type === "claim_approved" && n.claim_id && typeof n.claim_id === "number" && (
                <Link
                  to={`/chat/${n.claim_id}`}
                  className="inline-block mt-1 text-blue-600 underline text-sm"
                >
                  Go to Chat
                </Link>
              )}

              {!n.is_read && (
                <button
                  className="text-blue-600 underline text-sm ml-4"
                  onClick={() => handleMarkAsRead(n.id)}
                >
                  Mark as read
                </button>
              )}
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};

export default Notifications;
