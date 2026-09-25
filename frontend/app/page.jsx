import Link from 'next/link';
import Button from '@/components/ui/Button';
import { ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white pt-16 pb-32">
        <div className="absolute inset-y-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-5"></div>
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

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600">Three simple steps to start earning or saving.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">1. Browse & Choose</h3>
              <p className="text-gray-600">Search thousands of items to rent or buy from trusted members of your community.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">2. Quick Request</h3>
              <p className="text-gray-600">Send a rental request or buy instantly with our secure payment system.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">3. Safe Exchange</h3>
              <p className="text-gray-600">Meet up or get it delivered. Every transaction is backed by our safety guarantee.</p>
            </div>
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
