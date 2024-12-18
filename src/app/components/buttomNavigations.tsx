import { House, Search, Bell, Telescope } from 'lucide-react';

export const BottomNavigations = () => {
  return (
    <div
      id="webcrumbs"
      className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
    >
      <div className="bg-black rounded-full shadow-lg flex items-center justify-around p-3">
        {/* Home Button */}
        <button className="flex flex-col items-center text-neutral-50 hover:text-white transition">
          <House size={24} />
          <span className="text-xs font-medium mt-1">Home</span>
        </button>

        {/* Explore Button */}
        <button className="flex flex-col items-center text-neutral-50 hover:text-white transition">
          <Telescope size={24} />
          <span className="text-xs font-medium mt-1">Explore</span>
        </button>

        {/* Search Button */}
        <button className="flex flex-col items-center text-neutral-50 hover:text-white transition">
          <Search size={24} />
          <span className="text-xs font-medium mt-1">Search</span>
        </button>

        {/* Notification Button */}
        <button className="flex flex-col items-center text-neutral-50 hover:text-white transition">
          <Bell size={24} />
          <span className="text-xs font-medium mt-1">Alerts</span>
        </button>
      </div>
    </div>
  );
};
