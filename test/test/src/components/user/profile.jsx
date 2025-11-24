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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/profile", { params: { userId } });
      if (res.data?.data) setData((d) => ({ ...d, ...res.data.data }));
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
      await api.post("/student/profile", { ...data, userId });
      toast.success("Profile updated successfully");
    } catch (e) { 
      console.error(e);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const InputField = ({ label, icon: Icon, value, onChange, placeholder = "", type = "text", className = "", ...props }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="relative rounded-md shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${Icon ? 'pl-10' : 'pl-3'} py-2 border`}
          {...props}
        />
      </div>
    </div>
  );

  const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
      <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
          {Icon && <Icon className="h-5 w-5 mr-2 text-indigo-600" />}
          {title}
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage your personal information and preferences
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            type="submit"
            form="profile-form"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
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

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <form id="profile-form" onSubmit={save} className="space-y-6">
          <Section title="Academic Information" icon={BookOpen}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <InputField
                  label="Course"
                  icon={BookOpen}
                  value={data.course}
                  onChange={(e) => setData({...data, course: e.target.value})}
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
                  onChange={(e) => setData({...data, year: e.target.value})}
                  placeholder="e.g., 3"
                  required
                />
              </div>
            </div>
          </Section>

        <Section title="Housing Preferences" icon={Home}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (per month)</label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  value={data.preferences.budget}
                  onChange={(e) => setData({...data, preferences: {...data.preferences, budget: e.target.value}})}
                  placeholder="e.g., 5000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm pl-10 py-2 border"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Gender</label>
              <select 
                value={data.preferences.gender}
                onChange={(e) => setData({...data, preferences: {...data.preferences, gender: e.target.value}})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2 border"
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
                onChange={(e) => setData({...data, preferences: {...data.preferences, lifestyle: e.target.value}})}
                placeholder="e.g., Quiet, Social, etc."
              />
            </div>
          </div>
        </Section>

        <Section title="Guardian Information" icon={User}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Guardian Name"
                icon={User}
                value={data.guardian.name}
                onChange={(e) => setData({...data, guardian: {...data.guardian, name: e.target.value}})}
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
                onChange={(e) => setData({...data, guardian: {...data.guardian, phone: e.target.value}})}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
        </Section>

        <Section title="Health Information" icon={HeartPulse}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <InputField
                label="Dietary Preference"
                icon={HeartPulse}
                value={data.health.diet}
                onChange={(e) => setData({...data, health: {...data.health, diet: e.target.value}})}
                placeholder="e.g., Vegetarian, Vegan, Jain"
              />
            </div>
            <div className="sm:col-span-4">
              <InputField
                label="Allergies"
                icon={AlertTriangle}
                value={data.allergies}
                onChange={(e) => setData({...data, allergies: e.target.value})}
                placeholder="List any allergies"
              />
            </div>
            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Health Notes</label>
              <textarea
                value={data.health.notes}
                onChange={(e) => setData({...data, health: {...data.health, notes: e.target.value}})}
                placeholder="Any additional health information"
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
              />
            </div>
          </div>
        </Section>

        <Section title="Emergency Contact" icon={AlertTriangle}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <InputField
                label="Emergency Contact Name"
                icon={User}
                value={data.emergency.name}
                onChange={(e) => setData({...data, emergency: {...data.emergency, name: e.target.value}})}
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
                onChange={(e) => setData({...data, emergency: {...data.emergency, phone: e.target.value}})}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
        </Section>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
                Saving...
              </>
            ) : (
              <>
                <Save className="-ml-1 mr-2 h-5 w-5" />
                Save All Changes
              </>
            )}
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfile;
