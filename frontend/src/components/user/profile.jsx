import { useEffect, useState } from "react";
import { toast } from 'sonner';
import { User, BookOpen, DollarSign, Users, Home, HeartPulse, AlertTriangle, Save, Loader2 } from "lucide-react";
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
      formData.append("isLookingForRoommate", data.isLookingForRoommate);
      if (file) formData.append("avatar", file);

      const res = await api.post("/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        toast.success("Profile saved successfully");
        load();
      } else {
        toast.error(res.data?.message || "Failed to save profile");
      }
    } catch (e) {
      console.error(e);
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [section, field] = name.split(".");
      setData((prev) => ({
        ...prev,
        [section]: { ...prev[section], [field]: type === "checkbox" ? checked : value },
      }));
    } else {
      setData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <User className="mr-2" /> Student Profile
      </h2>
      <form onSubmit={save} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          {preview && <img src={preview} alt="Avatar" className="w-20 h-20 rounded-full object-cover" />}
          <label className="cursor-pointer bg-gray-100 p-2 rounded">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="flex items-center text-sm text-gray-600">
              <Loader2 className="mr-1 animate-spin" size={16} /> Change Avatar
            </span>
          </label>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course</label>
            <input
              type="text"
              name="course"
              value={data.course}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year</label>
            <input
              type="text"
              name="year"
              value={data.year}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <BookOpen className="mr-2" /> Preferences
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input
                type="text"
                name="preferences.budget"
                value={data.preferences.budget}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                name="preferences.gender"
                value={data.preferences.gender}
                onChange={handleChange}
                className="w-full border rounded p-2"
              >
                <option value="any">Any</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lifestyle</label>
              <input
                type="text"
                name="preferences.lifestyle"
                value={data.preferences.lifestyle}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Guardian */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <Users className="mr-2" /> Guardian Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="guardian.name"
                value={data.guardian.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="guardian.phone"
                value={data.guardian.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Health */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <HeartPulse className="mr-2" /> Health
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Diet</label>
              <input
                type="text"
                name="health.diet"
                value={data.health.diet}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                name="health.notes"
                value={data.health.notes}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Allergies */}
        <div>
          <label className="block text-sm font-medium mb-1">Allergies</label>
          <input
            type="text"
            name="allergies"
            value={data.allergies}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Emergency */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2 flex items-center">
            <AlertTriangle className="mr-2" /> Emergency Contact
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="emergency.name"
                value={data.emergency.name}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="text"
                name="emergency.phone"
                value={data.emergency.phone}
                onChange={handleChange}
                className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">Contact</label>
          <input
            type="text"
            name="contact"
            value={data.contact}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Looking for roommate */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isLookingForRoommate"
            checked={data.isLookingForRoommate}
            onChange={handleChange}
            className="mr-2"
          />
          <label className="text-sm">Looking for a roommate</label>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={saving