import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  User,
  BookOpen,
  DollarSign,
  Users,
  Home,
  HeartPulse,
  AlertTriangle,
  Save,
  Loader2,
} from "lucide-react";
import api from "../../lib/api";

const StudentProfile = () => {
  const userId = localStorage.getItem("Id");
  const [data, setData] = useState({
    course: "",
    year: "",
    preferences: { budget: "", gender: "any", lifestyle: "" },
    guardian: { name: "", phone: "" },
    health: { diet: "", notes: "" },
    allergies: "",
    emergency: { name: "", phone: "" },
    avatar: { url: "" },
    contact: "",
    isLookingForRoommate: false,
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [_loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/profile", { params: { userId } });
      if (res.data?.data) {
        setData((d) => ({ ...d, ...res.data.data }));
        if (res.data.data.avatar?.url) setPreview(res.data.data.avatar.url);
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("course", data.course);
      formData.append("year", data.year);
      formData.append("preferences", JSON.stringify(data.preferences));
      formData.append("guardian", JSON.stringify(data.guardian));
      formData.append("health", JSON.stringify(data.health));
      formData.append("allergies", data.allergies);
      formData.append("emergency", JSON.stringify(data.emergency));
      formData.append("contact", data.contact);
      formData.append(
        "isLookingForRoommate",
        data.isLookingForRoommate ? "true" : "false"
      );
      if (file) {
        formData.append("avatar", file);
      }

      await api.post("/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (_loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <User size={24} />
        Student Profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        {preview && (
          <img
            src={preview}
            alt="Avatar preview"
            className="w-20 h-20 rounded-full object-cover"
          />
        )}
        <label className="flex items-center gap-2 cursor-pointer">
          <Home size={20} />
          <span>Change Avatar</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Course</label>
          <input
            type="text"
            value={data.course}
            onChange={(e) => setData({ ...data, course: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium">Year</label>
          <input
            type="text"
            value={data.year}
            onChange={(e) => setData({ ...data, year: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen size={20} />
          Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium">Budget</label>
            <input
              type="text"
              value={data.preferences.budget}
              onChange={(e) =>
                setData({
                  ...data,
                  preferences: { ...data.preferences, budget: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Gender</label>
            <select
              value={data.preferences.gender}
              onChange={(e) =>
                setData({
                  ...data,
                  preferences: { ...data.preferences, gender: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            >
              <option value="any">Any</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="block font-medium">Lifestyle</label>
            <input
              type="text"
              value={data.preferences.lifestyle}
              onChange={(e) =>
                setData({
                  ...data,
                  preferences: {
                    ...data.preferences,
                    lifestyle: e.target.value,
                  },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Guardian */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users size={20} />
          Guardian
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={data.guardian.name}
              onChange={(e) =>
                setData({
                  ...data,
                  guardian: { ...data.guardian, name: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={data.guardian.phone}
              onChange={(e) =>
                setData({
                  ...data,
                  guardian: { ...data.guardian, phone: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Health */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <HeartPulse size={20} />
          Health
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Diet</label>
            <input
              type="text"
              value={data.health.diet}
              onChange={(e) =>
                setData({
                  ...data,
                  health: { ...data.health, diet: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Notes</label>
            <textarea
              value={data.health.notes}
              onChange={(e) =>
                setData({
                  ...data,
                  health: { ...data.health, notes: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Allergies */}
      <div>
        <label className="block font-medium">Allergies</label>
        <input
          type="text"
          value={data.allergies}
          onChange={(e) => setData({ ...data, allergies: e.target.value })}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Emergency */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle size={20} />
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium">Name</label>
            <input
              type="text"
              value={data.emergency.name}
              onChange={(e) =>
                setData({
                  ...data,
                  emergency: { ...data.emergency, name: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block font-medium">Phone</label>
            <input
              type="text"
              value={data.emergency.phone}
              onChange={(e) =>
                setData({
                  ...data,
                  emergency: { ...data.emergency, phone: e.target.value },
                })
              }
              className="w-full border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Contact & Roommate */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-medium">Contact</label>
          <input
            type="text"
            value={data.contact}
            onChange={(e) => setData({ ...data, contact: e.target.value })}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="flex items-center mt-6">
          <input
            type="checkbox"
            checked={data.isLookingForRoommate}
            onChange={(e) =>
              setData({ ...data, isLookingForRoommate: e.target.checked })
            }
            className="mr-2"
            id="roommate"
          />
          <label htmlFor="roommate" className="font-medium">
            Looking for a roommate
          </label>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark disabled:opacity-50"
      >
        <Save size={20} />
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
};

export default StudentProfile;