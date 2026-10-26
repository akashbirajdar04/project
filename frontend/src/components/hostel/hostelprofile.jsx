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
    } catch (e) {
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
          .filter(Boolean);
      }

      // If a new image (base64) is present, send it as part of the payload
      if (payload.image && payload.image.startsWith("data:")) {
        payload.avatar = payload.image;
        delete payload.image;
      }

      await api.put(`/hostel/${hostelId}/profile`, payload);
      toast.success("Profile updated successfully");
    } catch (err) {
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
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-4">
        {profile.image ? (
          <img
            src={profile.image}
            alt="Hostel"
            className="w-24 h-24 object-cover rounded"
          />
        ) : (
          <ImageIcon className="w-24 h-24 text-gray-400" />
        )}
        <label className="cursor-pointer bg-primary text-white px-3 py-1 rounded">
          Change Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            <Building2 className="inline-block mr-1" />
            Name
          </label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) =>
              setProfile((p) => ({ ...p, name: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <MapPin className="inline-block mr-1" />
            Address
          </label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) =>
              setProfile((p) => ({ ...p, address: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            <Phone className="inline-block mr-1" />
            Contact
          </label>
          <input
            type="text"
            value={profile.contact}
            onChange={(e) =>
              setProfile((p) => ({ ...p, contact: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={profile.description}
            onChange={(e) =>
              setProfile((p) => ({ ...p, description: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">
            Facilities (comma separated)
          </label>
          <input
            type="text"
            value={profile.facilities}
            onChange={(e) =>
              setProfile((p) => ({ ...p, facilities: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium mb-1">Rules</label>
          <textarea
            value={profile.rules}
            onChange={(e) =>
              setProfile((p) => ({ ...p, rules: e.target.value }))
            }
            className="w-full border rounded px-2 py-1"
            rows={3}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {saving && <Loader2 className="animate-spin h-4 w-4" />}
        <Save className="h-4 w-4" />
        Save Changes
      </button>
    </form>
  );
};