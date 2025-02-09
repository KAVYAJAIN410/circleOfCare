"use client";
import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
 
 
export default function UserDetail() {
 
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    number: "",
    gender: ""
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.age.trim()) newErrors.age = "Age is required";
    if (!formData.number.trim()) newErrors.number = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(formData.number.trim()))
      newErrors.number = "Invalid phone number format";
    if (!formData.gender) newErrors.gender = "Gender is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("/api/userDetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.email}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Unknown error"}`);
        setLoading(false);
        return;
      }

      toast.success("Form submitted successfully!");
      setFormData({ name: "", age: "", number: "", gender: "" });
      setLoading(false);
      router.push("/Team");
    } catch {
      setLoading(false);
      toast.error("Form submission failed: Network error");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-2xl">Submitting...</div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">User Details</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-md" />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Age</label>
            <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full p-2 border rounded-md" />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input type="tel" name="number" value={formData.number} onChange={handleChange} className="w-full p-2 border rounded-md" />
            {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
          </div>
          <div>
            <label className="block text-gray-600 mb-1">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded-md">
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="others">Others</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit</button>
        </form>
      </div>
      <Toaster />
    </div>
  );
}
