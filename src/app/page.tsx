"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { generateParticles } from "@/utils/hydration-safe";

export default function Home() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    setIsVisible(true);
    // Generate particles client-side to avoid hydration mismatch
    setParticles(generateParticles(15));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.animationDuration}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className={`max-w-2xl w-full text-center transform transition-all duration-1000 ease-out ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}>
          
          {/* Main Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
            
            {/* Logo/Icon */}
            <div className="relative mx-auto w-24 h-24 mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-30 animate-pulse"></div>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Calley Calling
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Panel
              </span>
            </h1>
            
            <p className="text-gray-300 text-lg mb-10 leading-relaxed">
              Manage your calling campaigns with ease. Upload lists, map columns, and track your progress.
            </p>

            {/* Navigation Buttons */}
            <div className="grid gap-4 md:grid-cols-2">
              <button 
                onClick={() => router.push('/upload-list')}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload List
                </div>
              </button>
              
              <button 
                onClick={() => router.push('/list-report')}
                className="group relative bg-white/10 text-white py-4 px-6 rounded-2xl border border-white/20 hover:bg-white/20 transform hover:scale-105 transition-all duration-300 font-semibold"
              >
                <div className="flex items-center justify-center gap-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Reports
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="mt-10 grid gap-4 md:grid-cols-3 text-sm">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-400">📁</span>
                </div>
                <p className="text-gray-400">Upload CSV/Excel files</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-400">🗂️</span>
                </div>
                <p className="text-gray-400">Map data columns</p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-400">📊</span>
                </div>
                <p className="text-gray-400">Track progress</p>
              </div>
            </div>
          </div>

          {/* Bottom indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.7; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
