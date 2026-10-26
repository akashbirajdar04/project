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
        JSON.stringify(data.isLookingForRoommate)
      );
      if (file) {
        formData.append("avatar", file);
      }

      await api.post("/student/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Profile saved successfully");
      load(); // refresh data after save
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
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={save} className="max-w-2xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <User className="h-6 w-6" />
        Student Profile
      </h2>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <img
          src={preview || "/default-avatar.png"}
          alt="Avatar"
          className="h-20 w-20 rounded-full object-cover border"
        />
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {/* Course & Year */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            <BookOpen className="inline-block mr-1" />
            Course
          </label>
          <input
            type="text"
            value={data.course}
            onChange={(e) => setData({ ...data, course: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            <Home className="inline-block mr-1" />
            Year
          </label>
          <input
            type="text"
            value={data.year}
            onChange={(e) => setData({ ...data, year: e.target.value })}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-1">
          <DollarSign />
          Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Budget"
            value={data.preferences.budget}
            onChange={(e) =>
              setData({
                ...data,
                preferences: { ...data.preferences, budget: e.target.value },
              })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Gender"
            value={data.preferences.gender}
            onChange={(e) =>
              setData({
                ...data,
                preferences: { ...data.preferences, gender: e.target.value },
              })
            }
            className="border rounded px-3 py-2"
          />
          <input
            type="text"
            placeholder="Lifestyle"
            value={data.preferences.lifestyle}
            onChange={(e) =>
              setData({
                ...data,
                preferences: { ...data.preferences, lifestyle: e.target.value },
              })
            }
            className="border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Guardian */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-1">
          <Users />
          Guardian
        </h3>
        <input
          type="text"
          placeholder="Guardian Name"
          value={data.guardian.name}
          onChange={(e) =>
            setData({
              ...data,
              guardian: { ...data.guardian, name: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Guardian Phone"
          value={data.guardian.phone}
          onChange={(e) =>
            setData({
              ...data,
              guardian: { ...data.guardian, phone: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Health */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-1">
          <HeartPulse />
          Health
        </h3>
        <input
          type="text"
          placeholder="Diet"
          value={data.health.diet}
          onChange={(e) =>
            setData({
              ...data,
              health: { ...data.health, diet: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Health Notes"
          value={data.health.notes}
          onChange={(e) =>
            setData({
              ...data,
              health: { ...data.health, notes: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      {/* Allergies */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          <AlertTriangle className="inline-block mr-1" />
          Allergies
        </label>
        <input
          type="text"
          value={data.allergies}
          onChange={(e) => setData({ ...data, allergies: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Emergency Contact */}
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-1">
          <AlertTriangle />
          Emergency Contact
        </h3>
        <input
          type="text"
          placeholder="Name"
          value={data.emergency.name}
          onChange={(e) =>
            setData({
              ...data,
              emergency: { ...data.emergency, name: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder="Phone"
          value={data.emergency.phone}
          onChange={(e) =>
            setData({
              ...data,
              emergency: { ...data.emergency, phone: e.target.value },
            })
          }
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Contact */}
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          <PhoneIcon className="inline-block mr-1" />
          Contact
        </label>
        <input
          type="text"
          value={data.contact}
          onChange={(e) => setData({ ...data, contact: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Looking for roommate */}
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={data.isLookingForRoommate}
          onChange={(e) =>
            setData({ ...data, isLookingForRoommate: e.target.checked })
          }
          id="roommate"
        />
        <label htmlFor="roommate" className="text-sm">
          Looking for a roommate
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? (
          <Loader2 className="animate-spin h-4 w-4" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save
      </button>
    </form>
  );
};

export default StudentProfile;