// components/PrintableShowDetails.js
import React from "react";

// Helper function to format numbers
const formatNumber = (num) => {
  const parsed = parseFloat(num);
  return isNaN(parsed) ? "0.00" : parsed.toFixed(2);
};

const PrintableShowDetails = ({ show, showSummary, showInventoryDetails }) => {
  if (!show || !showSummary) {
    return null; // or return a loading/error message
  }
  return (
    <div className="print-only p-8">
      <h1 className="text-2xl font-bold mb-4">Show Details</h1>
      <p>Show Name: {show.name}</p>
      <p>Show Date: {new Date(show.date_of_show).toLocaleDateString()}</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Budget Summary</h2>
      <p>Budget: ${formatNumber(showSummary.budget)}</p>
      <p>Total Cost: ${formatNumber(showSummary.total_cost)}</p>
      <p>Total Weight: {formatNumber(showSummary.total_weight)} lbs</p>

      <h2 className="text-xl font-semibold mt-6 mb-2">Fireworks</h2>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Firework Name</th>
            <th className="border border-gray-300 p-2">Connex Location</th>
            <th className="border border-gray-300 p-2">Quantity</th>
            <th className="border border-gray-300 p-2">Price</th>
            <th className="border border-gray-300 p-2">Weight of Products</th>
          </tr>
        </thead>
        <tbody>
          {showInventoryDetails.map((item) => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">
                {item.firework_name}
              </td>
              <td className="border border-gray-300 p-2">{item.container}</td>
              <td className="border border-gray-300 p-2">{item.quantity}</td>
              <td className="border border-gray-300 p-2">
                ${formatNumber(item.total_price)}
              </td>
              <td className="border border-gray-300 p-2">
                {formatNumber(item.total_weight)} lbs
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableShowDetails;
