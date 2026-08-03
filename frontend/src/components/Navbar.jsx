import React from 'react';

const Navbar = () => {
  const handlelogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-8 py-3 sm:py-4 min-h-[4rem]">
        
       
        <div className="logo font-bold text-xl sm:text-2xl flex items-center space-x-1">
          <span className="text-green-500">&lt;</span>
          <span>Pass</span>
          <span className="text-green-500">OP/&gt;</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/skkhan456/PassLock-Manager"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base rounded-full transition-all duration-200 shadow-sm"
          >
            <img src="/icons/github.svg" alt="GitHub" className="invert w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
            <span className="font-medium">GitHub</span>
          </a>

          <button
            onClick={handlelogout}
            className="bg-green-500 hover:bg-green-600 px-3 sm:px-5 py-1.5 sm:py-2 text-sm sm:text-base rounded-full text-white font-medium transition-all duration-200 shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
