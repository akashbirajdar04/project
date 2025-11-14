import { useEffect, useState } from "react";
import api from "../../lib/api";

export const StudentProfile = () => {
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

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/profile", { params: { userId } });
      if (res.data?.data) setData((d) => ({ ...d, ...res.data.data }));
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.post("/student/profile", { ...data, userId });
      alert("Profile saved");
    } catch (e) { console.error(e); }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Student Profile</h1>
      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white border border-slate-200 rounded-xl p-4">
          <input value={data.course} onChange={(e)=>setData({...data, course: e.target.value})} placeholder="Course" className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.year} onChange={(e)=>setData({...data, year: e.target.value})} placeholder="Year" className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.preferences.budget} onChange={(e)=>setData({...data, preferences: {...data.preferences, budget: e.target.value}})} placeholder="Budget" className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300" />
          <select value={data.preferences.gender} onChange={(e)=>setData({...data, preferences: {...data.preferences, gender: e.target.value}})} className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300">
            <option value="any">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <input value={data.preferences.lifestyle} onChange={(e)=>setData({...data, preferences: {...data.preferences, lifestyle: e.target.value}})} placeholder="Lifestyle" className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300" />

          <input value={data.guardian.name} onChange={(e)=>setData({...data, guardian: {...data.guardian, name: e.target.value}})} placeholder="Guardian Name" className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.guardian.phone} onChange={(e)=>setData({...data, guardian: {...data.guardian, phone: e.target.value}})} placeholder="Guardian Phone" className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300" />

          <input value={data.health.diet} onChange={(e)=>setData({...data, health: {...data.health, diet: e.target.value}})} placeholder="Diet (veg/vegan/jain)" className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.allergies} onChange={(e)=>setData({...data, allergies: e.target.value})} placeholder="Allergies" className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.health.notes} onChange={(e)=>setData({...data, health: {...data.health, notes: e.target.value}})} placeholder="Health Notes" className="md:col-span-6 px-3 py-2 rounded-lg border border-slate-300" />

          <input value={data.emergency.name} onChange={(e)=>setData({...data, emergency: {...data.emergency, name: e.target.value}})} placeholder="Emergency Contact" className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-300" />
          <input value={data.emergency.phone} onChange={(e)=>setData({...data, emergency: {...data.emergency, phone: e.target.value}})} placeholder="Emergency Phone" className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300" />

          <div className="md:col-span-12 flex justify-end">
            <button type="submit" className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default StudentProfile;
