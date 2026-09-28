export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <span className="text-2xl font-bold text-indigo-600">Rentora</span>
            <p className="text-gray-500 text-sm mt-2 max-w-sm">
              The premier marketplace for renting and buying quality items in your area.
            </p>
          </div>
          <div className="flex space-x-6 text-sm text-gray-500">
            <a href="#" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Rentora Inc. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
