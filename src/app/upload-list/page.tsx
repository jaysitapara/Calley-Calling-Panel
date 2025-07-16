"use client";

import { useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import { useUploadStore } from "@/app/store/uploadStore";
import { generateParticles } from "@/utils/hydration-safe";

export default function UploadListPage() {
  const [listName, setListName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  const router = useRouter();
  const setUploadData = useUploadStore((state) => state.setUploadData);

  useEffect(() => {
    // Generate particles client-side to avoid hydration mismatch
    setParticles(generateParticles(20, 54321));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!listName || !file) {
      showPopup("Please enter list name and select a file.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showPopup("File too large. Max allowed size is 5MB.", "error");
      return;
    }

    const extension = file.name.split(".").pop()?.toLowerCase();

    try {
      setLoading(true);
      let parsedData: any[] = [];

      if (extension === "csv") {
        const text = await file.text();
        const results = Papa.parse(text, { header: true });
        parsedData = results.data;
      } else if (["xls", "xlsx"].includes(extension || "")) {
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        parsedData = XLSX.utils.sheet_to_json(sheet);
      } else {
        showPopup("Unsupported file format.", "error");
        return;
      }

      showPopup("File uploaded successfully!", "success");
      setUploadData(listName, parsedData);
      setTimeout(() => {
        router.push("/map-columns");
      }, 1000);
    } catch (err) {
      console.error("Parsing error:", err);
      showPopup("Failed to parse file.", "error");
    } finally {
      setLoading(false);
    }
  };

  const showPopup = (message: string, type: "success" | "error" = "success") => {
    const popup = document.createElement("div");
    popup.innerHTML = `
      <div class="flex items-center space-x-3">
        <div class="flex-shrink-0">
          ${type === "success" 
            ? '<svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>'
          }
        </div>
        <span class="font-medium">${message}</span>
      </div>
    `;
    popup.style.position = "fixed";
    popup.style.top = "20px";
    popup.style.left = "50%";
    popup.style.transform = "translateX(-50%)";
    popup.style.background = type === "success" ? "rgba(16, 185, 129, 0.9)" : "rgba(239, 68, 68, 0.9)";
    popup.style.color = "white";
    popup.style.padding = "16px 24px";
    popup.style.borderRadius = "12px";
    popup.style.backdropFilter = "blur(8px)";
    popup.style.boxShadow = "0 10px 25px rgba(0,0,0,0.2)";
    popup.style.zIndex = "9999";
    popup.style.fontSize = "14px";
    document.body.appendChild(popup);
    setTimeout(() => {
      document.body.removeChild(popup);
    }, 4000);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-lg w-full">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Home
            </button>
          </div>

          {/* Main Upload Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative mx-auto w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-30 animate-pulse"></div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Upload Your
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                  Calling List
                </span>
              </h1>
              
              <p className="text-gray-300 text-lg">
                Import your contacts and start your campaign
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* List Name Input */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.99 1.99 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  List Name
                </label>
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  placeholder="Enter a name for your calling list"
                  className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all duration-200"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Upload File
                  <span className="text-gray-400 text-sm font-normal">(CSV, XLS, XLSX)</span>
                </label>
                
                <div
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-blue-400 bg-blue-500/10' 
                      : file 
                      ? 'border-green-400 bg-green-500/10' 
                      : 'border-white/30 bg-white/5 hover:border-white/50 hover:bg-white/10'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".csv, .xls, .xlsx"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  
                  {file ? (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">{file.name}</p>
                        <p className="text-gray-400 text-sm">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFile(null)}
                        className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors"
                      >
                        Remove file
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-semibold">Drag & drop your file here</p>
                        <p className="text-gray-400 text-sm">or click to browse</p>
                      </div>
                      <p className="text-gray-500 text-xs">Supports CSV, XLS, XLSX files up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !listName || !file}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-3 ${
                  loading || !listName || !file
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transform'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Upload & Continue</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </form>
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
