// src/components/ComplaintCard.jsx

import React from "react";

const ComplaintCard = ({ item, children }) => {
  return (
    <div className="bg-neutral-800 p-4 rounded-lg mb-3 border border-neutral-700">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <p className="text-sm text-gray-400">Comp-No: {item.id}</p>
          <p className="font-semibold text-white mt-1">Issue: {item.type}</p>
          <p className="text-sm text-gray-300 mt-1">{item.issue}</p>
          <p className="text-xs text-gray-500 mt-2">
            Status: <span className={item.status === "Closed" ? "text-red-400" : "text-green-400"}>
              {item.status}
            </span>
          </p>
          {item.remarks && (
            <p className="text-xs text-gray-400 mt-1">Remarks: {item.remarks}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Created: {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      {children}
    </div>
  );
};

export default ComplaintCard;