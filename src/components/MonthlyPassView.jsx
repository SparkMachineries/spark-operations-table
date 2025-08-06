// components/MonthlyPassView.jsx
import React, { useState, useEffect } from "react";
import {
  addMonthlyPass,
  updateMonthlyPass,
  fetchCollection,
} from "../firestoreService";

const MonthlyPassView = ({ monthlyPasses, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [parkings, setParkings] = useState([]);
  const [filteredPasses, setFilteredPasses] = useState(monthlyPasses);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Fetch users and parkings for the form
    const fetchData = async () => {
      try {
        const [usersData, parkingsData] = await Promise.all([
          fetchCollection("users"),
          fetchCollection("parkings"),
        ]);
        setUsers(usersData);
        setParkings(parkingsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Check for expired passes and update their status
    const checkExpiredPasses = async () => {
      const now = new Date();
      const expiredPasses = monthlyPasses.filter((pass) => {
        if (pass.status !== "active") return false;
        const endDate = pass.end_date.seconds
          ? new Date(pass.end_date.seconds * 1000)
          : new Date(pass.end_date);
        return endDate < now;
      });

      // Update expired passes
      for (const pass of expiredPasses) {
        try {
          await updateMonthlyPass(pass.id, {
            status: "expired",
            updated_time: new Date(),
          });
        } catch (error) {
          console.error("Error updating expired pass:", error);
        }
      }

      if (expiredPasses.length > 0) {
        onRefresh(); // Refresh data if any passes were updated
      }
    };

    checkExpiredPasses();

    // Filter passes based on status
    if (statusFilter === "all") {
      setFilteredPasses(monthlyPasses);
    } else {
      setFilteredPasses(
        monthlyPasses.filter((pass) => pass.status === statusFilter)
      );
    }
  }, [monthlyPasses, statusFilter, onRefresh]);

  const getStatusColor = (status, endDate) => {
    // Check if pass is actually expired based on date
    if (status === "active" && endDate) {
      const now = new Date();
      const passEndDate = endDate.seconds
        ? new Date(endDate.seconds * 1000)
        : new Date(endDate);
      if (passEndDate < now) {
        return "bg-red-100 text-red-800"; // Show as expired even if status hasn't been updated
      }
    }

    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = timestamp.seconds
      ? new Date(timestamp.seconds * 1000)
      : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const handleStatusUpdate = async (passId, newStatus) => {
    try {
      await updateMonthlyPass(passId, {
        status: newStatus,
        updated_time: new Date(),
      });
      onRefresh();
    } catch (error) {
      console.error("Error updating pass status:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Monthly Passes</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Pass
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2"
        >
          <option value="all">All Passes</option>
          <option value="active">Active</option>
          <option value="expired">Expired</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Passes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPasses.map((pass) => (
          <div key={pass.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-lg">
                {pass.user_name || "Unknown User"}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  pass.status,
                  pass.end_date
                )}`}
              >
                {(() => {
                  // Show actual status based on current date
                  if (pass.status === "active" && pass.end_date) {
                    const now = new Date();
                    const passEndDate = pass.end_date.seconds
                      ? new Date(pass.end_date.seconds * 1000)
                      : new Date(pass.end_date);
                    if (passEndDate < now) {
                      return "expired";
                    }
                  }
                  return pass.status || "unknown";
                })()}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <strong>Phone:</strong> {pass.phone_no}
              </p>
              <p>
                <strong>Vehicle:</strong> {pass.vehicle_number} (
                {pass.vehicle_type})
              </p>
              <p>
                <strong>Parking:</strong> {pass.parking_name}
              </p>
              <p>
                <strong>Amount:</strong> ₹{pass.amount}
              </p>
              <p>
                <strong>Valid From:</strong> {formatDate(pass.start_date)}
              </p>
              <p>
                <strong>Valid Till:</strong> {formatDate(pass.end_date)}
              </p>
              <p>
                <strong>Token:</strong> {pass.token_no}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-2">
              {pass.status === "active" && (
                <button
                  onClick={() => handleStatusUpdate(pass.id, "cancelled")}
                  className="bg-red-500 hover:bg-red-700 text-white text-xs px-3 py-1 rounded"
                >
                  Cancel
                </button>
              )}
              {pass.status === "expired" && (
                <button
                  onClick={() => handleStatusUpdate(pass.id, "active")}
                  className="bg-green-500 hover:bg-green-700 text-white text-xs px-3 py-1 rounded"
                >
                  Renew
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPasses.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No monthly passes found.
        </div>
      )}

      {/* Add Pass Modal */}
      {showAddModal && (
        <AddPassModal
          users={users}
          parkings={parkings}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

// Add Pass Modal Component
const AddPassModal = ({ users, parkings, onClose, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formData, setFormData] = useState({
    userid: "",
    user_name: "",
    phone_no: "",
    vehicle_number: "",
    vehicle_type: "bike", // Default to bike to match your database
    parking_name: "",
    amount: "",
    start_date: "",
    end_date: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Validate dates
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);

      if (endDate <= startDate) {
        setSubmitError("End date must be after start date");
        return;
      }

      const passData = {
        ...formData,
        amount: parseInt(formData.amount), // Ensure amount is a number
        pass_type: "monthly",
        status: "active",
        payment_status: "paid",
        created_time: new Date(),
        updated_time: new Date(),
        token_no: Math.floor(1000 + Math.random() * 9000).toString(), // Generate 4-digit token like your database
        qr_code: `QR_${formData.vehicle_number}_${Date.now()}`, // More meaningful QR code
        machine_name: `${
          formData.vehicle_type.charAt(0).toUpperCase() +
          formData.vehicle_type.slice(1)
        } 1`, // Match your database format
        start_date: startDate,
        end_date: endDate,
      };

      await addMonthlyPass(passData);
      onSuccess();
    } catch (error) {
      console.error("Error adding monthly pass:", error);
      setSubmitError(`Error adding monthly pass: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserSelect = (e) => {
    const selectedUser = users.find((user) => user.uid === e.target.value);
    if (selectedUser) {
      setFormData({
        ...formData,
        userid: selectedUser.uid,
        user_name: selectedUser.display_name,
        phone_no: selectedUser.phone_number,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Add Monthly Pass</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Select User
            </label>
            <select
              onChange={handleUserSelect}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Choose a user</option>
              {users.map((user) => (
                <option key={user.uid} value={user.uid}>
                  {user.display_name} - {user.phone_number}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Number
            </label>
            <input
              type="text"
              value={formData.vehicle_number}
              onChange={(e) =>
                setFormData({ ...formData, vehicle_number: e.target.value })
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vehicle Type
            </label>
            <select
              value={formData.vehicle_type}
              onChange={(e) =>
                setFormData({ ...formData, vehicle_type: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="truck">Truck</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parking Location
            </label>
            <select
              value={formData.parking_name}
              onChange={(e) =>
                setFormData({ ...formData, parking_name: e.target.value })
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">Choose parking</option>
              {parkings.map((parking) => (
                <option key={parking.name} value={parking.name}>
                  {parking.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) =>
                setFormData({ ...formData, start_date: e.target.value })
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={formData.end_date}
              onChange={(e) =>
                setFormData({ ...formData, end_date: e.target.value })
              }
              required
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {submitError}
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 font-bold py-2 px-4 rounded ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-700"
              } text-white`}
            >
              {isSubmitting ? "Adding..." : "Add Pass"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MonthlyPassView;
