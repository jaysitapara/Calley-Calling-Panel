"use client";

import { useEffect, useState } from "react";
import { useUploadStore } from "@/app/store/uploadStore";
import { useRouter } from "next/navigation";
import { generateParticles } from "@/utils/hydration-safe";

const defaultSystemFields = [
  { value: "FirstName", label: "First Name", icon: "👤" },
  { value: "LastName", label: "Last Name", icon: "👤" },
  { value: "Phone", label: "Phone Number", icon: "📞" },
  { value: "Email", label: "Email Address", icon: "📧" },
  { value: "Company", label: "Company", icon: "🏢" },
  { value: "JobTitle", label: "Job Title", icon: "💼" },
  { value: "Address", label: "Address", icon: "📍" },
  { value: "Notes", label: "Notes", icon: "📝" },
  { value: "Skip", label: "Skip this Column", icon: "⏭️" },
];

export default function MapColumnsPage() {
  const { listName, parsedData } = useUploadStore();
  const [columnMappings, setColumnMappings] = useState<Record<string, string>>(
    {}
  );
  const [previewExpanded, setPreviewExpanded] = useState<Record<string, boolean>>({});
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  const router = useRouter();

  useEffect(() => {
    // Generate particles client-side to avoid hydration mismatch
    setParticles(generateParticles(15, 98765));
    
    if (parsedData.length > 0) {
      const headers = Object.keys(parsedData[0]);
      const initialMapping: Record<string, string> = {};
      headers.forEach((header) => {
        initialMapping[header] = "";
      });
      setColumnMappings(initialMapping);
    }
  }, [parsedData]);

  const handleChange = (column: string, value: string) => {
    setColumnMappings((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const togglePreview = (column: string) => {
    setPreviewExpanded(prev => ({
      ...prev,
      [column]: !prev[column]
    }));
  };

  const getFieldIcon = (fieldValue: string) => {
    const field = defaultSystemFields.find(f => f.value === fieldValue);
    return field?.icon || "📊";
  };

  const getMappedCount = () => {
    return Object.values(columnMappings).filter(value => value && value !== "Skip").length;
  };

  const getSkippedCount = () => {
    return Object.values(columnMappings).filter(value => value === "Skip").length;
  };

  const handleSubmit = () => {
    console.log("List Name:", listName);
    console.log("Mapped Fields:", columnMappings);
    console.log("Data:", parsedData.slice(0, 3));
    router.push("/confirm-import");
  };

  if (!parsedData.length) {
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
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 text-center shadow-2xl">
              
              {/* No Data Icon */}
              <div className="relative mb-8">
                <div className="relative mx-auto w-24 h-24">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-2xl opacity-30 animate-pulse"></div>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                No Data
                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent block">
                  Available
                </span>
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Upload your contact list first to start mapping columns for your campaign.
              </p>

              {/* Action Button */}
              <button 
                onClick={() => router.push('/upload-list')}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload Your List</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
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

  const totalColumns = Object.keys(parsedData[0]).length;
  const mappedColumns = getMappedCount();
  const skippedColumns = getSkippedCount();
  const unmappedColumns = totalColumns - mappedColumns - skippedColumns;

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

      {/* Header Section */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <button
              onClick={() => router.push('/upload-list')}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
            >
              <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Upload
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🗂️</span>
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Map Your Columns
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Transform your data for{" "}
                    <span className="font-bold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-lg">
                      {listName}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-sm">
              <div className="text-center">
                <div className="text-sm font-medium text-gray-300 mb-2">Import Progress</div>
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {mappedColumns}<span className="text-gray-500">/{totalColumns}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">columns mapped</div>
              </div>
            </div>
          </div>
          
          {/* Enhanced Progress Section */}
          <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-emerald-400">Mapped</span>
                  <span className="bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-lg text-sm font-bold">
                    {mappedColumns}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-amber-400">Skipped</span>
                  <span className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded-lg text-sm font-bold">
                    {skippedColumns}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full shadow-sm"></div>
                  <span className="font-semibold text-gray-400">Pending</span>
                  <span className="bg-gray-500/20 text-gray-300 px-2 py-1 rounded-lg text-sm font-bold">
                    {unmappedColumns}
                  </span>
                </div>
              </div>
              <div className="text-sm font-medium text-gray-400">
                {Math.round((mappedColumns / totalColumns) * 100)}% complete
              </div>
            </div>
            
            <div className="relative w-full bg-white/20 rounded-full h-3 overflow-hidden shadow-inner">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${(mappedColumns / totalColumns) * 100}%` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {Object.keys(parsedData[0]).map((col, index) => {
            const isExpanded = previewExpanded[col];
            const selectedField = columnMappings[col];
            const selectedFieldObj = defaultSystemFields.find(f => f.value === selectedField);
            
            return (
              <div
                key={col}
                className={`group relative bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  selectedField 
                    ? selectedField === "Skip" 
                      ? "border-amber-400/50 bg-amber-500/10 shadow-amber-500/20" 
                      : "border-emerald-400/50 bg-emerald-500/10 shadow-emerald-500/20"
                    : "hover:border-white/40 hover:bg-white/20"
                }`}
              >
                {/* Status Indicator */}
                {selectedField && (
                  <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                    selectedField === "Skip" ? "bg-amber-500" : "bg-emerald-500"
                  }`}>
                    {selectedField === "Skip" ? "⏭" : "✓"}
                  </div>
                )}

                {/* Card Header */}
                <div className={`p-6 border-b border-white/20`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md transition-colors ${
                        selectedField 
                          ? selectedField === "Skip"
                            ? "bg-amber-500/20 border-2 border-amber-400/30"
                            : "bg-emerald-500/20 border-2 border-emerald-400/30"
                          : "bg-white/10 border-2 border-white/20 group-hover:bg-white/20 group-hover:border-white/40"
                      }`}>
                        {selectedField ? getFieldIcon(selectedField) : "📊"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-lg">
                            Column {index + 1}
                          </h3>
                          <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full font-mono">
                            #{index + 1}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 font-mono bg-white/10 px-3 py-2 rounded-lg mt-2 border border-white/20">
                          {col}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedFieldObj && (
                    <div className="mt-4">
                      <div className={`inline-flex items-center gap-2 text-sm px-3 py-2 rounded-full font-semibold ${
                        selectedField === "Skip" 
                          ? "bg-amber-500/20 text-amber-300" 
                          : "bg-emerald-500/20 text-emerald-300"
                      }`}>
                        <span>{selectedFieldObj.icon}</span>
                        {selectedFieldObj.label}
                      </div>
                    </div>
                  )}
                </div>

                {/* Data Preview */}
                <div className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                        Sample Data
                      </span>
                      <button
                        onClick={() => togglePreview(col)}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold hover:bg-white/10 px-2 py-1 rounded-lg transition-colors"
                      >
                        {isExpanded ? "Show Less ↑" : "Show More ↓"}
                      </button>
                    </div>
                    <div className="space-y-2">
                      {parsedData.slice(0, isExpanded ? 5 : 3).map((row, i) => (
                        <div key={i} className="text-sm text-gray-300 bg-white/10 px-3 py-2 rounded-lg border border-white/20 hover:bg-white/20 transition-colors">
                          {row[col] as string || <span className="text-gray-500 italic">empty</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Field Mapping */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      Map to System Field
                    </label>
                    <select
                      className={`w-full p-4 border-2 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-400/20 focus:border-blue-400 text-white font-medium ${
                        selectedField 
                          ? selectedField === "Skip"
                            ? "border-amber-400/30 bg-amber-500/10 focus:bg-amber-500/20"
                            : "border-emerald-400/30 bg-emerald-500/10 focus:bg-emerald-500/20"
                          : "border-white/20 bg-white/10 hover:border-white/30"
                      }`}
                      value={columnMappings[col] || ""}
                      onChange={(e) => handleChange(col, e.target.value)}
                    >
                      <option value="" className="text-gray-800">Choose a field...</option>
                      {defaultSystemFields.map((field) => (
                        <option key={field.value} value={field.value} className="text-gray-800">
                          {field.icon} {field.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Section */}
        <div className="mt-16 relative">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-10"></div>
          
          <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🚀</span>
                  </div>
                  <h3 className="text-2xl font-black text-white">Ready to Launch?</h3>
                </div>
                <div className="space-y-2">
                  {mappedColumns > 0 ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2 text-gray-300">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="font-semibold">{mappedColumns} columns ready</span>
                      </div>
                      {unmappedColumns > 0 && (
                        <>
                          <span className="hidden sm:block text-gray-500">•</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            <span>{unmappedColumns} pending</span>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-300 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amber-400 rounded-full"></span>
                      Map at least one column to continue
                    </p>
                  )}
                  <div className="text-sm text-gray-400">
                    Your data will be imported and ready for calling campaigns
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.back()}
                  className="group px-8 py-4 border-2 border-white/20 text-white rounded-2xl hover:bg-white/10 hover:border-white/40 transition-all duration-200 font-semibold flex items-center gap-2"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={mappedColumns === 0}
                  className={`group px-10 py-4 rounded-2xl font-bold transition-all duration-200 flex items-center gap-3 ${
                    mappedColumns > 0
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105 transform"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Continue to Import</span>
                  <span className={`transition-transform ${mappedColumns > 0 ? "group-hover:translate-x-1" : ""}`}>
                    →
                  </span>
                </button>
              </div>
            </div>
            
            {/* Additional progress indicator */}
            {mappedColumns > 0 && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>Import readiness</span>
                  <span className="font-semibold">
                    {Math.round((mappedColumns / totalColumns) * 100)}% configured
                  </span>
                </div>
                <div className="mt-2 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${(mappedColumns / totalColumns) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
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
