import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-8">
              Rent or Buy Anything, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Anytime.</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              The smartest way to access the things you need. Borrow for a day, or keep it forever. Join the leading circular economy marketplace today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/listings">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 flex items-center justify-center gap-2">
                  Browse Listings <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/listings/create">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Post a Listing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How Rentora Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-indigo prose-lg">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">How Rentora Works</h1>
          <p className="text-xl text-gray-600 text-center mb-16">
            Rentora makes renting and buying simple, transparent, and convenient. Whether you want to find something you need or list something you own, everything can be managed from one platform.
          </p>

          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Create Your Account</h2>
              <p className="text-gray-600">Sign up for a Rentora account using your basic information. Once registered, you can browse listings, contact sellers, rent products, make purchases, and manage your activities from your dashboard.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Browse Listings</h2>
              <p className="text-gray-600">Explore products and properties available for <strong className="font-semibold text-gray-900">rent or permanent purchase</strong>. Use categories and listing details to find exactly what you are looking for.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">3. Choose What You Need</h2>
              <p className="text-gray-600">Open a listing to view its photos, description, price, availability, and other important information. Compare your options and select the one that fits your needs.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Rent or Buy</h2>
              <p className="text-gray-600">Choose whether you want to <strong className="font-semibold text-gray-900">rent an item for a specific period</strong> or <strong className="font-semibold text-gray-900">purchase it permanently</strong>. For rentals, select your required dates and review the calculated rental price before confirming.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Manage Everything From Your Dashboard</h2>
              <p className="text-gray-600">Your personal dashboard keeps your activities organized. You can view your rentals, purchases, listings, and complaints in one place.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. List Your Own Products</h2>
              <p className="text-gray-600">Have something to rent or sell? Create your own listing, upload images, add the price and details, and make it available to other Rentora users.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Get Support</h2>
              <p className="text-gray-600">If you face a problem or have a complaint, submit it through the complaint system. Our admin team can review and manage complaints to help maintain a reliable marketplace.</p>
            </div>
          </div>

          <div className="mt-16 pt-10 border-t border-gray-200 text-center">
            <h3 className="text-2xl font-bold text-indigo-600">Rent. Buy. List. Manage.</h3>
            <p className="mt-4 text-gray-600 text-lg">Everything you need for a smarter rental and purchase experience — in one platform.</p>
          </div>
        </div>
      </section>

      {/* Categories Section - Static for homepage preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
              <p className="mt-2 text-gray-600">Find exactly what you're looking for.</p>
            </div>
            <Link href="/listings" className="text-indigo-600 hover:text-indigo-800 font-medium hidden sm:block">
              View All Categories &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Electronics', 'Vehicles', 'Real Estate', 'Furniture', 'Tools', 'Sports'].map(cat => (
              <Link key={cat} href={`/listings?category=${cat}`} className="bg-white p-6 rounded-xl border border-gray-200 text-center hover:border-indigo-500 hover:shadow-md transition-all group">
                <h3 className="font-semibold text-gray-800 group-hover:text-indigo-600">{cat}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6">Ready to declutter and earn?</h2>
          <p className="text-xl text-indigo-100 mb-10">List your idle items today and start making money while helping others in your community.</p>
          <Link href="/listings/create">
            <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 shadow-lg px-10">
              Start Listing Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
