
import React from 'react';

const EmptyBoardState = () => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500 text-center z-10">
      <p className="text-lg mb-2">No widgets on this board yet</p>
      <p className="text-sm">Click the + button to add your first widget</p>
    </div>
  );
};

export default EmptyBoardState;
