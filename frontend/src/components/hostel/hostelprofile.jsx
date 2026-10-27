import React, { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";

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

        if (Array.isArray(data.facilities)) {
          data.facilities = data.facilities.join(", ");
        }

        if (data.avatar && data.avatar.url) {
          data.image = data.avatar.url;
        }

        setProfile(data);
      }
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

      if (payload.facilities && typeof payload.facilities === "string") {
        payload.facilities = payload.facilities
          .split(",")
          .map((f) => f.trim())
          .filter((f) => f);
      }

      const res = await api.put(`/hostel/${hostelId}/profile`, payload);
      if (res.data?.success) {
        toast.success("Profile updated successfully");
        load();
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
          {profile.image ? (
            <img src={profile.image} alt="Hostel" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mt-6" />
          )}
        </div>
        <label className="cursor-pointer">
          <span className="text-sm text-blue-600 underline">Change Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={profile.name}
          onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Address</label>
        <input
          type="text"
          value={profile.address}
          onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Contact</label>
        <input
          type="text"
          value={profile.contact}
          onChange={(e) => setProfile((p) => ({ ...p, contact: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={profile.description}
          onChange={(e) => setProfile((p) => ({ ...p, description: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Facilities (comma separated)</label>
        <input
          type="text"
          value={profile.facilities}
          onChange={(e) => setProfile((p) => ({ ...p, facilities: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Rules</label>
        <textarea
          value={profile.rules}
          onChange={(e) => setProfile((p) => ({ ...p, rules: e.target.value }))}
          className="mt-1 block w-full border rounded p-2"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center justify-center w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
        Save Changes
      </button>
    </form>
  );
};