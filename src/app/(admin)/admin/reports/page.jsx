"use client";

import React, { useState, useEffect } from "react";
import { API } from "@/utils/api";

export default function ReportsPage() {
  const [reportType, setReportType] = useState("sale"); // "sale" or "purchase"
  const [filterType, setFilterType] = useState("item"); // "item", "date", "vendor", "area"
  
  const [reportData, setReportData] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Filter states
  const [itemFilter, setItemFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [vendorFilter, setVendorFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  // Fetch all vendors for the dropdown selection
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/reports/vendors`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (result.statusCode === 200) {
          setVendors(result.data || []);
        }
      } catch (err) {
        console.error("Error fetching vendors:", err);
      }
    };
    fetchVendors();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      
      // Build query string based on the active filters
      let query = `?type=${reportType}`;
      
      if (filterType === "item" && itemFilter) {
        query += `&item=${encodeURIComponent(itemFilter)}`;
      } else if (filterType === "date") {
        if (dateFrom) query += `&startDate=${encodeURIComponent(dateFrom)}`;
        if (dateTo) query += `&endDate=${encodeURIComponent(dateTo)}`;
      } else if (filterType === "vendor" && vendorFilter) {
        query += `&vendor=${encodeURIComponent(vendorFilter)}`;
      } else if (filterType === "area" && areaFilter) {
        query += `&area=${encodeURIComponent(areaFilter)}`;
      }

      const res = await fetch(`${API}/reports${query}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch report data from server");
      }

      const result = await res.json();
      if (result.statusCode === 200) {
        setReportData(result.data || []);
      } else {
        setError(result.message || "Failed to fetch reports");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong while loading reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear other filters when switching filter types
    setItemFilter("");
    setDateFrom("");
    setDateTo("");
    setVendorFilter("");
    setAreaFilter("");
    
    fetchReports();
  }, [reportType, filterType]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-[#6b3430] mb-2">Reports & Analytics</h2>
      <div className="h-1 w-24 bg-[#6b3430] mb-8 rounded-full"></div>

      {/* Main Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setReportType("sale")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            reportType === "sale" ? "bg-[#6b3430] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Sales Report
        </button>
        <button
          onClick={() => setReportType("purchase")}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            reportType === "purchase" ? "bg-[#6b3430] text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Purchases Report
        </button>
      </div>

      {/* Filter Options */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter By</h3>
        <div className="flex flex-wrap gap-4 mb-6">
          {["item", "date", "vendor", "area"].map((f) => (
            <label key={f} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="filterType"
                checked={filterType === f}
                onChange={() => setFilterType(f)}
                className="w-4 h-4 text-[#6b3430] focus:ring-[#6b3430]"
              />
              <span className="capitalize text-gray-700">{f} Wise</span>
            </label>
          ))}
        </div>

        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          {filterType === "item" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Item Name</label>
              <input
                type="text"
                placeholder="Search product/item title..."
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6b3430] focus:border-[#6b3430]"
              />
            </div>
          )}

          {filterType === "date" && (
            <>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm text-gray-600 mb-1">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6b3430] focus:border-[#6b3430]"
                />
              </div>
              <div className="flex-1 min-w-[150px]">
                <label className="block text-sm text-gray-600 mb-1">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6b3430] focus:border-[#6b3430]"
                />
              </div>
            </>
          )}

          {filterType === "vendor" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Vendor Name</label>
              <select
                value={vendorFilter}
                onChange={(e) => setVendorFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6b3430] focus:border-[#6b3430]"
              >
                <option value="">All Vendors</option>
                {vendors.map((v) => (
                  <option key={v._id} value={v._id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {filterType === "area" && (
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm text-gray-600 mb-1">Area / City / State</label>
              <input
                type="text"
                placeholder="Search area..."
                value={areaFilter}
                onChange={(e) => setAreaFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-[#6b3430] focus:border-[#6b3430]"
              />
            </div>
          )}

          <button
            type="submit"
            className="bg-[#6b3430] text-white px-6 py-2 rounded-md hover:bg-[#5a2a26] transition-colors"
          >
            Apply Filter
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data from server...</div>
        ) : reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="p-4 font-semibold text-gray-700">Date</th>
                  <th className="p-4 font-semibold text-gray-700">Item</th>
                  <th className="p-4 font-semibold text-gray-700">Vendor / Brand</th>
                  <th className="p-4 font-semibold text-gray-700">Area / Location</th>
                  <th className="p-4 font-semibold text-gray-700">Quantity</th>
                  <th className="p-4 font-semibold text-gray-700">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4 text-gray-600">{row.date}</td>
                    <td className="p-4 text-gray-800 font-medium">{row.itemName}</td>
                    <td className="p-4 text-gray-600">{row.vendor}</td>
                    <td className="p-4 text-gray-600">{row.area}</td>
                    <td className="p-4 text-gray-600">{row.quantity}</td>
                    <td className="p-4 text-gray-800 font-medium">₹{row.amount.toLocaleString()}</td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="4" className="p-4 text-right text-gray-800">Total:</td>
                  <td className="p-4 text-gray-800">
                    {reportData.reduce((acc, curr) => acc + curr.quantity, 0)}
                  </td>
                  <td className="p-4 text-[#6b3430]">
                    ₹{reportData.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">No data found for the selected criteria.</div>
        )}
      </div>
    </div>
  );
}
