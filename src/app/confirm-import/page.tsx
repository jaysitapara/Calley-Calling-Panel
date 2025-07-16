"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { generateParticles } from "@/utils/hydration-safe";

export default function ConfirmImportPage() {
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
    setParticles(generateParticles(20, 24680));
  }, []);

  const handleOk = () => {
    router.push("/list-report");
  };

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
        <div className={`max-w-2xl w-full transform transition-all duration-1000 ease-out ${
          isVisible ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-8'
        }`}>
          
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/map-columns')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Mapping
            </button>
          </div>
          
          {/* Main Success Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 text-center shadow-2xl">
            
            {/* Animated Success Icon */}
            <div className="relative mb-8">
              <div className="relative mx-auto w-32 h-32">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-green-400 border-r-green-400 rounded-full animate-spin"></div>
                {/* Inner success circle */}
                <div className="absolute inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-xl">
                  <svg 
                    className="w-12 h-12 text-white animate-scale-in" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {/* Pulsing glow effect */}
                <div className="absolute inset-2 bg-green-400/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Import
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent block">
                Successful!
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed max-w-lg mx-auto">
              Your calling list has been processed and optimized. Ready to start your campaign!
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Contacts Processed */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">1,247</div>
                <div className="text-sm text-gray-400">Contacts Processed</div>
              </div>

              {/* Duplicates Removed */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">183</div>
                <div className="text-sm text-gray-400">Duplicates Removed</div>
              </div>

              {/* Ready to Call */}
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">1,064</div>
                <div className="text-sm text-gray-400">Ready to Call</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOk}
                className="group relative bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Start Calling</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => router.push('/upload-list')}
                className="group bg-white/10 backdrop-blur-sm border border-white/20 text-white py-4 px-8 rounded-2xl hover:bg-white/20 transition-all duration-300 font-semibold text-lg"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>View Report</span>
                </span>
              </button>
            </div>

            {/* Bottom indicator */}
            {/* <div className="mt-8 flex justify-center"> */}
              {/* <div className="flex space-x-2"> */}
                {/* <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div> */}
              {/* </div> */}
            {/* </div> */}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.7; }
        }
        @keyframes scale-in {
          0% { transform: scale(0); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-scale-in {
          animation: scale-in 0.6s ease-out 0.5s both;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
