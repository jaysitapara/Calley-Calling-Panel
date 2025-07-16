"use client";

import { useEffect, useState } from "react";
import { generateParticles, safeGoBack } from "@/utils/hydration-safe";
import { useUploadStore } from "@/app/store/uploadStore";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function ListReportPage() {
  const { listName, parsedData } = useUploadStore();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    top: number;
    animationDelay: number;
    animationDuration: number;
  }>>([]);

  useEffect(() => {
    // Generate particles client-side to avoid hydration mismatch
    setParticles(generateParticles(15, 13579));
  }, []);

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
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl opacity-30 animate-pulse"></div>
                </div>
              </div>

              {/* Message */}
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                No Data
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent block">
                  Available
                </span>
              </h2>
              
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Upload and import a list first to view your calling report.
              </p>

              {/* Action Button */}
              <button 
                onClick={safeGoBack}
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-semibold text-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span>Go Back</span>
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

  // Filter data based on search term
  const filteredData = parsedData.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = String(a[sortField]).toLowerCase();
    const bValue = String(b[sortField]).toLowerCase();
    if (sortDirection === "asc") {
      return aValue.localeCompare(bValue);
    }
    return bValue.localeCompare(aValue);
  });

  const totalPages = Math.ceil(sortedData.length / ITEMS_PER_PAGE);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === "asc" ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
      </svg>
    );
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
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => router.push('/confirm-import')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all duration-200 group"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Import
              </button>
            </div>
            
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Calling List Report
              </h1>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-400/30">
                {listName}
              </span>
              <span className="text-sm">•</span>
              <span className="text-sm">{filteredData.length} total records</span>
            </div>
          </div>

          {/* Search and Controls */}
          <div className="mb-6 bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search records..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-200"
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span>Showing {paginatedData.length} of {filteredData.length} records</span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/20 border-b border-white/20">
                  <tr>
                    {Object.keys(paginatedData[0] || {}).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-4 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-white/30 transition-colors"
                        onClick={() => handleSort(key)}
                      >
                        <div className="flex items-center gap-2">
                          <span>{key}</span>
                          {getSortIcon(key)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {paginatedData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      className="hover:bg-white/10 transition-colors"
                    >
                      {Object.keys(row).map((key, i) => (
                        <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {String(row[key])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white/10 px-6 py-4 border-t border-white/20">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-300">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(1)}
                      className="px-3 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      First
                    </button>
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className="px-3 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className="px-3 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(totalPages)}
                      className="px-3 py-2 text-sm font-medium text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Last
                    </button>
                  </div>
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
