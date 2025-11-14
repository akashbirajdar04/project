import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

export const Messprofile = () => {
  const id = localStorage.getItem("Id");
  const [form, setForm] = useState({
    name: "",
    adress: "",
    price: "",
    description: "",
    facilities: [],
    images: [],
    contact: "",
    vegNonVeg: "both",
    priceRange: "medium",
    location: { city: "", state: "", pincode: "" },
  });
  const [facilityInput, setFacilityInput] = useState("");
  const [saving, setSaving] = useState(false);
  const canSave = useMemo(() => form.name.trim() && form.adress.trim() && form.price !== "", [form]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/Profile/Messprofile/${id}`);
        const d = res.data?.data || {};
        setForm({
          name: d.name || "",
          adress: d.adress || "",
          price: d.price || "",
          description: d.description || "",
          facilities: Array.isArray(d.facilities) ? d.facilities : [],
          images: Array.isArray(d.images) ? d.images : [],
          contact: d.contact || "",
          vegNonVeg: d.vegNonVeg || "both",
          priceRange: d.priceRange || "medium",
          location: {
            city: d.location?.city || "",
            state: d.location?.state || "",
            pincode: d.location?.pincode || "",
          },
        });
      } catch (_) {}
    };
    if (id) load();
  }, [id]);

  const update = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onAddFacility = () => {
    const v = facilityInput.trim();
    if (!v) return;
    update({ facilities: [...form.facilities, v] });
    setFacilityInput("");
  };

  const removeFacility = (idx) => {
    update({ facilities: form.facilities.filter((_, i) => i !== idx) });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    try {
      setSaving(true);
      await api.post("/Profile/Messprofile", { id, ...form });
      toast.success("Profile saved");
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-emerald-700 mb-4">Mess Profile</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-4">
            <label className="block text-sm text-slate-600 mb-1">Mess Name</label>
            <input value={form.name} onChange={(e)=>update({name:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. Green Leaf Mess" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm text-slate-600 mb-1">Address</label>
            <input value={form.adress} onChange={(e)=>update({adress:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="Street, Area" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">Price (per month)</label>
            <input type="number" value={form.price} onChange={(e)=>update({price:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="e.g. 3500" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm text-slate-600 mb-1">Contact</label>
            <input value={form.contact} onChange={(e)=>update({contact:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="Phone or email" />
          </div>

          <div className="md:col-span-6">
            <label className="block text-sm text-slate-600 mb-1">Description</label>
            <textarea value={form.description} onChange={(e)=>update({description:e.target.value})} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-300" placeholder="Short description about the mess" />
            <p className="text-xs text-slate-500 mt-1">This appears on your mess listing and helps students know your offering.</p>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-slate-600 mb-1">Veg/Non-Veg</label>
            <select value={form.vegNonVeg} onChange={(e)=>update({vegNonVeg:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300">
              <option value="veg">Veg</option>
              <option value="non-veg">Non-Veg</option>
              <option value="both">Both</option>
            </select>
          </div>
          <div className="md:col-span-3">
            <label className="block text-sm text-slate-600 mb-1">Price Range</label>
            <select value={form.priceRange} onChange={(e)=>update({priceRange:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-300">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm text-slate-600 mb-1">City</label>
            <input value={form.location.city} onChange={(e)=>update({location:{...form.location, city:e.target.value}})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm text-slate-600 mb-1">State</label>
            <input value={form.location.state} onChange={(e)=>update({location:{...form.location, state:e.target.value}})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>
          <div className="md:col-span-4">
            <label className="block text-sm text-slate-600 mb-1">Pincode</label>
            <input value={form.location.pincode} onChange={(e)=>update({location:{...form.location, pincode:e.target.value}})} className="w-full px-3 py-2 rounded-lg border border-slate-300" />
          </div>

          <div className="md:col-span-12">
            <label className="block text-sm text-slate-600 mb-1">Facilities</label>
            <div className="flex gap-2 mb-2">
              <input value={facilityInput} onChange={(e)=>setFacilityInput(e.target.value)} placeholder="Add a facility and press Add" className="flex-1 px-3 py-2 rounded-lg border border-slate-300" />
              <button type="button" onClick={onAddFacility} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Add</button>
            </div>
            {form.facilities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.facilities.map((f, idx) => (
                  <span key={idx} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {f}
                    <button type="button" onClick={()=>removeFacility(idx)} className="text-emerald-700 hover:text-emerald-900">✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <ImagesField form={form} update={update} />

          <div className="md:col-span-12 flex justify-end gap-2 mt-2">
            <button type="submit" disabled={!canSave || saving} className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const ImagesField = ({ form, update }) => {
  const [url, setUrl] = useState("");
  const add = () => {
    const u = url.trim();
    if (!u) return;
    update({ images: [...(form.images || []), u] });
    setUrl("");
  };
  const remove = (i) => update({ images: (form.images || []).filter((_, idx) => idx !== i) });
  return (
    <div className="md:col-span-12">
      <label className="block text-sm text-slate-600 mb-1">Images</label>
      <div className="flex gap-2 mb-2">
        <input value={url} onChange={(e)=>setUrl(e.target.value)} placeholder="Paste image URL and press Add" className="flex-1 px-3 py-2 rounded-lg border border-slate-300" />
        <button type="button" onClick={add} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Add</button>
      </div>
      {Array.isArray(form.images) && form.images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {form.images.map((src, i) => (
            <div key={i} className="relative group border rounded-lg overflow-hidden bg-slate-50">
              <img src={src} alt="preview" className="w-full h-28 object-cover" />
              <button type="button" onClick={()=>remove(i)} className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-white/90 text-slate-700 shadow opacity-0 group-hover:opacity-100">Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}