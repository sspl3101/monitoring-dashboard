import React from 'react';
import { configureLED } from '../../utils/statusUtils';

export const StatusCell = ({ value, onClick = null }) => {
  const config = configureLED('', value);
  
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center justify-center">
      <span
        role="button"
        className={`
          inline-block
          w-4 h-4 
          rounded-full 
          shadow-inner 
          ${onClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''} 
          ${config.color} 
          ${config.animation}
        `}
        onClick={handleClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && onClick) {
            handleClick(e);
          }
        }}
        tabIndex={onClick ? 0 : -1}
      />
    </div>
  );
};