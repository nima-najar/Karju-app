'use client';

import Link from 'next/link';
import { Briefcase, Users, Clock, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Karju - Shift-based Work Marketplace
            </h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              The first Iranian online marketplace connecting businesses with skilled workers for flexible shift opportunities.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Get Started
              </Link>
              <Link href="/shifts" className="bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 transition-colors border border-white">
                Browse Shifts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Karju?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card text-center">
              <Briefcase className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Flexible Work</h3>
              <p className="text-gray-600">
                Choose shifts that fit your schedule. Work when you want, where you want.
              </p>
            </div>

            <div className="card text-center">
              <Users className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Workers</h3>
              <p className="text-gray-600">
                All workers are verified through our 3-step verification process.
              </p>
            </div>

            <div className="card text-center">
              <Clock className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Matching</h3>
              <p className="text-gray-600">
                Find qualified workers instantly or get matched to perfect shifts.
              </p>
            </div>

            <div className="card text-center">
              <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Transparent pricing with secure payment processing through Iranian gateways.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">For Workers</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Sign Up & Verify</h4>
                    <p className="text-gray-600">Complete our simple 3-step verification (ID, CV, work permit)</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Browse & Apply</h4>
                    <p className="text-gray-600">Explore available shifts and apply to the ones that match your skills</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Work & Earn</h4>
                    <p className="text-gray-600">Complete shifts and get paid monthly through secure payment processing</p>
                  </div>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6">For Businesses</h3>
              <ol className="space-y-4">
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">1</span>
                  <div>
                    <h4 className="font-semibold">Register & Verify</h4>
                    <p className="text-gray-600">Sign up your business and complete verification</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">2</span>
                  <div>
                    <h4 className="font-semibold">Post Shifts</h4>
                    <p className="text-gray-600">Create shift posts with details, requirements, and pay rate</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mr-4 flex-shrink-0">3</span>
                  <div>
                    <h4 className="font-semibold">Review & Hire</h4>
                    <p className="text-gray-600">Review applications, select workers, and manage your workforce</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8">
            Join thousands of workers and businesses already using Karju
          </p>
          <Link
            href="/register"
            className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Create Your Account
          </Link>
        </div>
      </section>
    </div>
  );
}



