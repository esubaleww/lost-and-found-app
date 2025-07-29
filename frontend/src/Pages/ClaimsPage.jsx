import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ClaimsPage = () => {
  const { itemId } = useParams(); // Get item ID from route
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const {user, token} = useAuth();

  const fetchClaims = async () => {
    try {
      const res = await fetch(`https://server-production-82bb.up.railway.app/api/claims/${itemId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Error fetching claims");
        return;
      }

      setClaims(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load claims.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [itemId]);

  const handleDecision = async (claimId, decision) => {
    try {
      const res = await fetch(`https://server-production-82bb.up.railway.app/api/claims/${claimId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: decision }),
      });

      const data = await res.json();

      if (res.ok) {
        setClaims((prev) =>
          prev.map((claim) =>
            claim.id === claimId ? { ...claim, status: decision } : claim
          )
        );
      } else {
        alert(data.message || "Failed to update claim.");
      }
    } catch (err) {
      console.error("Decision error:", err);
    }
  };

  if (loading) return <p>Loading claims...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (claims.length === 0) return <p>No claims found for this item.</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Claim Requests</h2>
      {claims.map((claim) => (
        <div key={claim.id} className="bg-white p-4 mb-3 rounded shadow">
          <p><strong>From:</strong> {claim.full_name}</p>
          <p><strong>Message:</strong> {claim.message}</p>
          <p><strong>Status:</strong> <span className="font-medium">{claim.status}</span></p>

          {claim.status === "pending" && (
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleDecision(claim.id, "approved")}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Accept
              </button>
              <button
                onClick={() => handleDecision(claim.id, "rejected")}
                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClaimsPage;
