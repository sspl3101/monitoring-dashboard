import React from 'react';

const Logo = () => (
    <div className="flex items-center gap-3 mb-6">
       <img 
         src="/ve-logo-tm.svg"  // References /public/logo.svg
         alt="Company Logo" 
         className="w-15 h-15"
       />
       <div className="text-xl font-bold text-gray-800">Router DashBoard</div>
     </div>
);

export default Logo;
