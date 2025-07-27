import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../Pages/AuthContext';
import { Send, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Picker from 'emoji-picker-react';
import socket from '../components/socket';

const ChatPage = ({ receiverId, claimId }) => {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [receiverOnline, setReceiverOnline] = useState(false);
  

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [tick, setTick] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setTick((prev) => prev + 1);
  }, 30000); 
  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    if (!token || !claimId) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/messages/${claimId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch messages');
        setMessages(data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Unable to load messages. Please try again later.');
      }
    };

    fetchMessages();
    const handleConnect = () => {
    console.log("🔁 Socket reconnected");
    socket.emit("user_connected", user.id); 
  };
     if (!socket.connected) socket.connect();
    socket.emit('join_room', claimId, user.id);

    socket.on("connect", handleConnect);

     const handleStatusChange = ({ userId, status }) => {
    if (userId === receiverId) {
      setReceiverOnline(status === "online");
    }
  };

    socket.on('user_status_change', handleStatusChange);

    socket.on('receive_message', (message) => {
      if (message.claim_id !== Number(claimId)) return;
      setMessages(prev => {
        const exists = prev.some(m => m.tempId === message.tempId);
        if (exists) {
          return prev.map(m => 
            m.tempId === message.tempId ? { ...message, status: 'sent' } : m
          );
        } else {
          return [...prev, { ...message, status: 'sent' }];
        }
      });

      socket.emit('ack_delivered', {
        tempId: message.tempId,
        senderSocketId: message.senderSocketId,
      });
    });

    socket.on('message_delivered', ({ tempId }) => {
      setMessages(prev =>
        prev.map(m => 
          m.tempId === tempId ? { ...m, status: 'delivered' } : m
        )
      );
    });

    socket.on('typing', () => {
      setTyping(true);
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => setTyping(false), 1500);
    });

    return () => {
      socket.emit('leave_room', claimId);
      socket.off('receive_message');
      socket.off('message_delivered');
      socket.off('typing');
      socket.off('user_status_change');
       socket.off("connect", handleConnect);
    };
  }, [claimId, token, receiverId, user.id]);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'auto' }); // or 'smooth' if you prefer
}, [messages]);


 let typingTimeout;
const handleTyping = (e) => {
  setContent(e.target.value);
  clearTimeout(typingTimeout);
  typingTimeout = setTimeout(() => {
    socket.emit('typing', claimId);
  }, 500); // emit only after 500ms pause
};


  const sendMessage = async () => {
  if (!content.trim()) return;

  const tempId = Date.now();
  const message = {
    sender_id: user.id,
    receiver_id: receiverId,
    claim_id: claimId,
    content,
    tempId,
  };

  // Optimistically add the message with "sending" status
  setMessages(prev => [...prev, { ...message, status: 'sending' }]);
  setContent('');
  setSending(true);

  try {
    const res = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(message),
    });

    const data = await res.json();
    console.log("sent", data);

    if (!res.ok) throw new Error(data.error || 'Failed to send message');

    // Server sends enriched message with profile + name
    setMessages(prev =>
      prev.map(m =>
        m.tempId === tempId ? { ...data, status: 'sent' } : m
      )
    );

    setError(null);
  } catch (err) {
    console.error('Send message error:', err);
    setError('Message failed to send.');
  } finally {
    setSending(false);
  }
};

  const handleDeleteMessage = async (messageId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/messages/${messageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete message');
      }

      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (err) {
      console.error('Delete message error:', err);
      setError('Failed to delete message.');
    }
  };

  const onEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji);
    setShowEmoji(false);
  };

function formatTime(timestamp) {
  if (!timestamp) return 'Invalid time';

  const time = new Date(timestamp);
  if (isNaN(time)) return 'Invalid time';

  const now = new Date();
  const diffInSeconds = Math.floor((now - time) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  return formatDistanceToNow(time, { addSuffix: true });
}


  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-500">
       <div className="w-full max-w-3xl h-[80vh] bg-white shadow-xl rounded-xl border flex flex-col p-4">
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar"
        >
          {messages.map((msg) => {
            const isSender = msg.sender_id === user.id;
            return (
              <div
                key={msg.tempId || msg.id}
                className={`flex items-end ${isSender ? 'justify-end' : 'justify-start'} gap-2`}
              >

                <div className="relative">
                  <img
                    src={`http://localhost:5000/uploads/${msg.profile_picture || 'default.jpg'}`}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border shadow"
                  />
                  <small className='relative top-0'>{receiverOnline ? '🟢' : '⚪'}</small>
                </div>
                <div className="relative max-w-[70%] group">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm shadow border
                    ${isSender
                      ? 'bg-blue-200 text-white rounded-tr-none border-blue-100'
                      : 'bg-gray-100 text-gray-900 rounded-tl-none border-gray-300'}`}
                  >
                    <div>{msg.content}</div>
                    <div className="text-xs mt-1 opacity-60">
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                  </div>

                  {isSender && (
                    <div className="absolute bottom-1 right-1 text-xs opacity-70">
                      {msg.status === 'sending' && '⏳'}
                      {msg.status === 'sent' && '✅'}
                      {msg.status === 'delivered' && '✅✅'}
                    </div>
                  )}

                  {isSender && (
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute -top-2 -right-2 p-1 bg-white border rounded-full shadow hover:bg-red-100 group-hover:block hidden"
                    >
                      <Trash2 size={14} className="text-red-600" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {typing && (
            <div className="text-sm text-gray-500 ml-12 mb-2">User is typing...</div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && <div className="text-red-600 mt-2">{error}</div>}

        <div className="relative mt-4 flex items-center gap-2">
          <button
            onClick={() => setShowEmoji(!showEmoji)}
            className="px-2 py-1 rounded-full border text-xl"
          >
            😊
          </button>

          {showEmoji && (
            <div className="absolute bottom-14 left-0 z-10">
              <Picker onEmojiClick={onEmojiClick} />
            </div>
          )}

          <input
            value={content}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !sending && content.trim()) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            disabled={!content.trim() || sending}
            className={`p-2 rounded-full text-white transition
              ${content.trim() && !sending ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
