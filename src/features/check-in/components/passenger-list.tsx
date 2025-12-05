"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { type Passenger, calculateAge, getPassengerTypeFromBirthDate } from "../types";
import { Plus, Trash2, Loader2, X } from "lucide-react";
import { createPassenger, deletePassenger } from "../actions/manage-passengers";

interface PassengerListProps {
  passengers: Passenger[];
  onSelect: (passenger: Passenger) => void;
}

export function PassengerList({ passengers: initialPassengers, onSelect }: PassengerListProps) {
  const router = useRouter();
  const [passengers, setPassengers] = useState(initialPassengers);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    fullName: "",
    birthDate: "",
  });

  // Preview the passenger type based on entered birth date
  const previewType = formData.birthDate.length === 10 
    ? getPassengerTypeFromBirthDate(formData.birthDate)
    : null;

  const handleDelete = useCallback(async (e: React.MouseEvent, passenger: Passenger) => {
    e.stopPropagation();
    
    // Optimistic update
    setDeletingId(passenger.id);
    setPassengers((prev) => prev.filter((p) => p.id !== passenger.id));

    await deletePassenger(passenger.id);
    setDeletingId(null);
    router.refresh();
  }, [router]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.fullName || !formData.birthDate) return;

    setIsSubmitting(true);

    // Get type from birth date
    const { type, displayType } = getPassengerTypeFromBirthDate(formData.birthDate);

    // Create optimistic passenger
    const optimisticPassenger: Passenger = {
      id: `temp-${Date.now()}`,
      name: formData.name,
      fullName: formData.fullName,
      birthDate: formData.birthDate,
      type: displayType,
      travelClass: "Standard",
    };

    // Optimistic update
    setPassengers((prev) => [...prev, optimisticPassenger]);
    setShowForm(false);

    // Save to database
    await createPassenger({
      name: formData.name,
      fullName: formData.fullName,
      birthDate: formData.birthDate,
      type: type,
      travelClass: "standard",
    });

    // Reset form
    setFormData({ name: "", fullName: "", birthDate: "" });
    setIsSubmitting(false);
    router.refresh();
  }, [formData, router]);

  const handleInputChange = useCallback((field: string, value: string) => {
    // Auto-format birth date (add dots: DD.MM.YYYY)
    if (field === "birthDate") {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "");
      
      // Format with dots
      let formatted = "";
      if (digits.length > 0) formatted += digits.slice(0, 2);
      if (digits.length > 2) formatted += "." + digits.slice(2, 4);
      if (digits.length > 4) formatted += "." + digits.slice(4, 8);
      
      setFormData((prev) => ({ ...prev, birthDate: formatted }));
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate name from fullName
    if (field === "fullName" && value) {
      const firstName = value.split(" ")[0];
      setFormData((prev) => ({ ...prev, name: firstName }));
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] text-black">Who are you?</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-medium text-[#1734D8] bg-blue-50 rounded-full hover:bg-blue-100 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* Add passenger form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900">New passenger</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Full name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Date of birth</label>
            <input
              type="text"
              value={formData.birthDate}
              onChange={(e) => handleInputChange("birthDate", e.target.value)}
              placeholder="DD.MM.YYYY"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {/* Show auto-detected type */}
            {previewType && (
              <p className="mt-1.5 text-sm text-gray-500">
                Type: <span className="font-medium text-[#1734D8]">{previewType.displayType}</span>
                {" "}({calculateAge(formData.birthDate)} years)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !formData.fullName || !formData.birthDate || formData.birthDate.length < 10}
            className="w-full py-2.5 bg-[#1734D8] text-white rounded-lg font-medium text-[15px] hover:bg-[#1228a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Adding...
              </>
            ) : (
              "Add passenger"
            )}
          </button>
        </form>
      )}

      {/* Passenger list */}
      {passengers.length === 0 && !showForm ? (
        <p className="text-gray-500 text-center py-8">
          No passengers added yet
        </p>
      ) : (
        <div className="space-y-3">
          {passengers.map((passenger) => {
            const isDeleting = deletingId === passenger.id;

            return (
              <div
                key={passenger.id}
                className={`flex items-center bg-white rounded-xl border border-[#E5E5E5] transition-all ${
                  isDeleting ? "opacity-50" : ""
                }`}
              >
                <button
                  onClick={() => onSelect(passenger)}
                  className="flex-1 p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left"
        >
          {/* Avatar circle */}
          <div className="w-12 h-12 rounded-full bg-[#E8F4FD] flex items-center justify-center flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#1734D8" strokeWidth="2"/>
              <path d="M4 21V19C4 16.7909 6.23858 15 9 15H15C17.7614 15 20 16.7909 20 19V21" stroke="#1734D8" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
                  <div>
            <p className="font-semibold text-black text-[17px]">{passenger.fullName}</p>
            <p className="text-[#666666] text-[14px]">
                      {passenger.type} · {calculateAge(passenger.birthDate)} years
            </p>
          </div>
        </button>

                {/* Delete button */}
                <button
                  onClick={(e) => handleDelete(e, passenger)}
                  disabled={isDeleting}
                  className="p-3 mr-2 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  title="Remove passenger"
                >
                  {isDeleting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
