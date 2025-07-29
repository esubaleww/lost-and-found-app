import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ClaimRequestForm = ({ itemId, requesterId }) => {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [canClaim, setCanClaim] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkExistingClaim = async () => {
      try {
        const res = await fetch(
          `https://server-production-82bb.up.railway.app/api/claims/${itemId}`
        );
        const data = await res.json();

        if (Array.isArray(data)) {
          const myClaim = data.find(
            (claim) =>
              claim.requester_id === requesterId && claim.status === "approved"
          );

          if (myClaim) {
            navigate(`/chat/${itemId}`);
          } else {
            setCanClaim(true);
          }
        } else {
          setCanClaim(true); // no claims found
        }
      } catch (err) {
        console.error("Error checking claim status:", err);
        setCanClaim(true); // fallback to allow form
      } finally {
        setLoading(false);
      }
    };

    checkExistingClaim();
  }, [itemId, requesterId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        "https://server-production-82bb.up.railway.app/api/claims",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            item_id: itemId,
            requester_id: requesterId,
            message,
          }),
        }
      );

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Claim submitted successfully!");
        setMessage("");
      } else {
        setStatus("❌ Failed to submit claim.");
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("❌ Server error.");
    }
  };

  if (loading) return <p>Checking claim status...</p>;
  if (!canClaim) return null;

  return (
    <div className="bg-white shadow-md rounded-xl p-4 mt-4">
      <h2 className="text-lg font-semibold mb-2">Claim This Item</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full border p-2 rounded mb-2"
          rows={4}
          placeholder="Enter your message to the item owner..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Claim
        </button>
      </form>
      {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
    </div>
  );
};

export default ClaimRequestForm;
