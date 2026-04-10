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
  const [loading, setLoading] = useState(true);
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

      if (res.data?.data) {
        setData((d) => ({ ...d, ...res.data.data }));
        if (res.data.data.avatar?.url) {
          setPreview(res.data.data.avatar.url);
        }
      }

      toast.success("Profile updated successfully");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  // Non-blocking render to allow immediate LCP placeholder display
  // if (loading) return ...

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Profile</h1>
          <p className="mt-1 text-slate-500">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>

      <form id="profile-form" onSubmit={save} className="space-y-6">
        <Section title="Profile Photo" icon={User}>
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-200">
                {/* STATIC PLACEHOLDER — SAFE */}
                <img
                  src="/hero.webp"
                  alt="Profile placeholder"
                  width="96"
                  height="96"
                  fetchPriority="high"
                  loading="eager"
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* REAL AVATAR — LOADS LATER */}
                {preview && preview !== "/hero.webp" && (
                  <img
                    src={preview}
                    alt="Profile"
                    width="96"
                    height="96"
                    className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
                  />
                )}

                {/* Fallback Icon only if NO preview and NO hero (unlikely) */}
                {!preview && (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-400 bg-white/0">
                    {/* Transparent */}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Upload New Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    setFile(f);
                    setPreview(URL.createObjectURL(f));
                  }
                }}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-slate-500">JPG, PNG or GIF. Max 5MB.</p>
            </div>
          </div>
        </Section>

        <Section title="Roommate Preferences" icon={Users}>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <input
                type="checkbox"
                id="looking"
                checked={data.isLookingForRoommate}
                onChange={(e) => setData({ ...data, isLookingForRoommate: e.target.checked })}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="looking" className="font-medium text-slate-800 cursor-pointer">
                I am interested in finding a roommate
              </label>
            </div>
            {data.isLookingForRoommate && (
              <InputField
                label="My Contact Number (Visible to others)"
                icon={Users}
                value={data.contact}
                onChange={(e) => setData({ ...data, contact: e.target.value })}
                placeholder="e.g., +91 9876543210"
              />
            )}
          </div>
        </Section>

        <Section title="Academic Information" icon={BookOpen}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Course"
                icon={BookOpen}
                value={data.course}
                onChange={(e) => setData({ ...data, course: e.target.value })}
                placeholder="e.g., Computer Science"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                label="Year of Study"
                icon={BookOpen}
                type="number"
                min="1"
                max="5"
                value={data.year}
                onChange={(e) => setData({ ...data, year: e.target.value })}
                placeholder="e.g., 3"
                required
              />
            </div>
          </div>
        </Section>

        <Section title="Housing Preferences" icon={Home}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Budget (per month)</label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  value={data.preferences.budget}
                  onChange={(e) => setData({ ...data, preferences: { ...data.preferences, budget: e.target.value } })}
                  placeholder="e.g., 5000"
                  className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 py-2.5 border transition-colors"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Preferred Gender</label>
              <select
                value={data.preferences.gender}
                onChange={(e) => setData({ ...data, preferences: { ...data.preferences, gender: e.target.value } })}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border transition-colors"
              >
                <option value="any">No preference</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <InputField
                label="Lifestyle"
                icon={Users}
                value={data.preferences.lifestyle}
                onChange={(e) => setData({ ...data, preferences: { ...data.preferences, lifestyle: e.target.value } })}
                placeholder="e.g., Quiet, Social"
              />
            </div>
          </div>
        </Section>

        <Section title="Guardian Information" icon={User}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Guardian Name"
                icon={User}
                value={data.guardian.name}
                onChange={(e) => setData({ ...data, guardian: { ...data.guardian, name: e.target.value } })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                label="Guardian Phone"
                icon={Users}
                type="tel"
                value={data.guardian.phone}
                onChange={(e) => setData({ ...data, guardian: { ...data.guardian, phone: e.target.value } })}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
        </Section>

        <Section title="Health Information" icon={HeartPulse}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <InputField
                label="Dietary Preference"
                icon={HeartPulse}
                value={data.health.diet}
                onChange={(e) => setData({ ...data, health: { ...data.health, diet: e.target.value } })}
                placeholder="e.g., Vegetarian"
              />
            </div>
            <div className="sm:col-span-4">
              <InputField
                label="Allergies"
                icon={AlertTriangle}
                value={data.allergies}
                onChange={(e) => setData({ ...data, allergies: e.target.value })}
                placeholder="List any allergies"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-slate-700 mb-1">Health Notes</label>
              <textarea
                value={data.health.notes}
                onChange={(e) => setData({ ...data, health: { ...data.health, notes: e.target.value } })}
                placeholder="Any additional health information"
                rows={3}
                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-3 transition-colors"
              />
            </div>
          </div>
        </Section>

        <Section title="Emergency Contact" icon={AlertTriangle}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Emergency Contact Name"
                icon={User}
                value={data.emergency.name}
                onChange={(e) => setData({ ...data, emergency: { ...data.emergency, name: e.target.value } })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="sm:col-span-3">
              <InputField
                label="Emergency Phone"
                icon={AlertTriangle}
                type="tel"
                value={data.emergency.phone}
                onChange={(e) => setData({ ...data, emergency: { ...data.emergency, phone: e.target.value } })}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
        </Section>
      </form>
    </div >
  );
};

export default StudentProfile;

const InputField = ({ label, icon: Icon, value, onChange, placeholder = "", type = "text", className = "", ...props }) => (
  <div className={className}>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <div className="relative rounded-lg shadow-sm">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-slate-400" />
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${Icon ? 'pl-10' : 'pl-3'} py-2.5 border transition-colors`}
        {...props}
      />
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <div className="bg-white shadow-sm border border-slate-200 rounded-xl mb-6 overflow-hidden">
    <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
      <h3 className="text-lg font-semibold text-slate-800 flex items-center">
        {Icon && <Icon className="h-5 w-5 mr-2.5 text-blue-600" />}
        {title}
      </h3>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);
