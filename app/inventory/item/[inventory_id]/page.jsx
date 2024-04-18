import React from "react";

export default function IndividualItemPage({ params }) {
  return (
    <div>
      <h1>This page is for item number {params.inventory_id}</h1>
    </div>
  );
}
