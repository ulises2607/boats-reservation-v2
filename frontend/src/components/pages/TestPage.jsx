import React, { useEffect, useState } from "react";
import axios from "axios";

const TestPage = () => {
  const [boats, setBoats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoats = async () => {
      try {
        console.log("Testing API connection...");
        const response = await axios.get("http://localhost:3001/api/v1/boats");
        console.log("API Response:", response.data);
        setBoats(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBoats();
  }, []);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-bold text-red-600">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        API Test - Found {boats.length} boats
      </h1>
      <div className="grid gap-4">
        {boats.slice(0, 3).map((boat) => (
          <div key={boat.id} className="border p-4 rounded">
            <h3 className="font-bold">{boat.name}</h3>
            <p>{boat.description}</p>
            <p>Price: ${boat.rent_price}/day</p>
            <p>Type: {boat.boat_type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestPage;
