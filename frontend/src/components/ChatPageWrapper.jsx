import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ChatPage from '../Pages/ChatPage';
import { useAuth } from '../Pages/AuthContext';

const ChatPageWrapper = () => {
  const { claimId } = useParams();
  const { user, token } = useAuth();
  const [chatInfo, setChatInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/claim/${claimId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch chat info');
        setChatInfo(data);
      } catch (err) {
        console.error('Failed to fetch chat info:', err);
        setChatInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchChatInfo();
  }, [claimId, token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-600 text-lg">Loading chat...</div>
      </div>
    );
  }

  if (!chatInfo) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-600 text-lg">Chat not found.</div>
      </div>
    );
  }

  const { requester_id, reporter_id } = chatInfo;
  const receiverId = user.id === requester_id ? reporter_id : requester_id;

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="mx-auto w-full max-w-7xl">
        <ChatPage receiverId={receiverId} claimId={claimId} />
      </div>
    </div>
  );
};

export default ChatPageWrapper;
