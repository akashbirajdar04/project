import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import {
  Building2,
  MapPin,
  Phone,
  Save,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

export const Hostelprofile = () => {
  const hostelId = localStorage.getItem("Id");

  const [profile, setProfile] = useState({
    name: "",
    address: "",
    contact: "",
    description: "",
    facilities: "",
    rules: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hostel/${hostelId}/profile`);
      if (res.data?.data) {
        const data = { ...res.data.data };

        // Ensure facilities is a string for the input field
        if (Array.isArray(data.facilities)) {
          data.facilities = data.facilities.join(", ");
        }

        // Map avatar.url to image for frontend display
        if (data.avatar && data.avatar.url) {
          data.image = data.avatar.url;
        }

        setProfile(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload = { ...profile };

      // Convert facilities back to array if needed
      if (payload.facilities) {
        payload.facilities = payload.facilities
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
      }

      // If image is a base64 string, send it as avatar
      if (payload.image && payload.image.startsWith("data:")) {
        payload.avatar = payload.image;
        delete payload.image;
      }

      await api.put(`/hostel/${hostelId}/profile`, payload);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {profile.image ? (
            <img
              src={profile.image}
              alt="Hostel"
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-gray-500" />
            </div>
          )}
          <label className="absolute bottom-0 right-0 bg-white rounded-full p-1 cursor-pointer shadow">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <Save className="h-4 w-4 text-primary" />
          </label>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold">{profile.name || "Hostel Name"}</h2>
          <p className="text-gray-600">{profile.address}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact</label>
          <div className="mt-1 flex items-center space-x-2">
            <Phone className="h-5 w-5 text-gray-400" />
            <input
              type="tel"
              value={profile.contact}
              onChange={(e) => setProfile((p) => ({ ...p, contact: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <div className="mt-1 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={profile.address}
              onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
              className="flex-1 rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            rows={3}
            value={profile.description}
            onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Facilities (comma separated)</label>
          <input
            type="text"
            value={profile.facilities}
            onChange={(e) => setProfile((p) => ({ ...p, facilities: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Rules</label>
          <textarea
            rows={3}
            value={profile.rules}
            onChange={(e) => setProfile((p) => ({ ...p, rules: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm bg-primary text-white hover:bg-primary-dark focus:outline-none disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
          ) : (
            <Save className="h-5 w-5 mr-2" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default Hostelprofile;