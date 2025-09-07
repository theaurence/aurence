"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-black text-white">
      {/* Hero Section - Full Screen */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-semibold mb-4 tracking-wide">Aurence</h1>
        <p className="text-xl md:text-3xl mb-6 text-gray-300 font-medium">
          Connect creators with brands in seconds
        </p>
        <p className="text-lg md:text-xl mb-12 text-gray-400 max-w-2xl">
          The marketplace where authentic collaborations happen. 
          Brands find the perfect creators, creators discover meaningful partnerships.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/signup?role=BRAND"
            className="rounded-2xl bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition text-lg"
          >
            Sign up as Brand
          </Link>
          <Link
            href="/signup?role=CREATOR"
            className="rounded-2xl border-2 border-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition text-lg"
          >
            Sign up as Creator
          </Link>
        </div>
      </section>

      {/* Benefits Section - Full Screen */}
      <section className="min-h-screen flex flex-col items-center justify-center py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center mb-16">
            Why Choose Aurence?
          </h2>
          <div className="grid md:grid-cols-2 gap-16">
            {/* For Creators */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">For Creators</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Discover authentic brand partnerships</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Get paid for your creative work</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Build long-term brand relationships</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Access exclusive campaign opportunities</span>
                </div>
              </div>
            </div>

            {/* For Brands */}
            <div className="text-center">
              <h3 className="text-2xl font-semibold mb-6">For Brands</h3>
              <div className="space-y-4 text-gray-300">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Find creators who align with your values</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Launch campaigns in minutes</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Track performance and ROI</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Scale your influencer marketing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Full Screen */}
      <section className="min-h-screen flex flex-col items-center justify-center py-20 px-6 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to start collaborating?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of creators and brands already using Aurence
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="rounded-2xl border-2 border-white px-8 py-4 font-semibold hover:bg-white hover:text-black transition text-lg"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-2xl bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition text-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
