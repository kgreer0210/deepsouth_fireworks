// components/PrintableShowDetails.js
import { Button } from "@/components/ui/button";
import React from "react";

const PrintableShowDetails = ({ show, showSummary, showInventoryDetails }) => {
  return (
    <div className="print-only">
      <h1>{show.name} - Show Details</h1>
      <p>
        <strong>Show Date:</strong>{" "}
        {new Date(show.date_of_show).toLocaleDateString()}
      </p>

      <h2>Budget Summary</h2>
      <p>
        <strong>Budget:</strong> ${showSummary.budget}
      </p>
      <p>
        <strong>Total Cost:</strong> ${showSummary.total_cost}
      </p>
      <p>
        <strong>Total Weight:</strong> {showSummary.total_weight} lbs
      </p>

      <h2>Fireworks</h2>
      <table>
        <thead>
          <tr>
            <th>Firework Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Weight of Products</th>
          </tr>
        </thead>
        <tbody>
          {showInventoryDetails.map((item) => (
            <tr key={item.id}>
              <td>{item.firework_name}</td>
              <td>{item.quantity}</td>
              <td>${item.total_price}</td>
              <td>{item.total_weight} lbs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintableShowDetails;
