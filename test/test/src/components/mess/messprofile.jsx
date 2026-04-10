import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Save, Plus, X, Upload, Loader2, UtensilsCrossed, Image as ImageIcon } from "lucide-react";

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
        image: ""
    });
    const [facilityInput, setFacilityInput] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const canSave = useMemo(() => form.name.trim() && form.adress.trim() && form.price !== "", [form]);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
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
                    image: d.avatar?.url || ""
                });
            } catch (_) {
                // toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                update({ image: reader.result });
            };
            reader.readAsDataURL(file);

            const formData = new FormData();
            formData.append("image", file);
            api.put(`/mess/${id}/profile/image`, formData)
                .then((res) => {
                    toast.success("Image updated successfully");
                    if (res.data?.data?.url) {
                        update({ image: res.data.data.url });
                    }
                })
                .catch((e) => {
                    toast.error(e?.response?.data?.message || "Update failed");
                })
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!canSave) return;
        try {
            setSaving(true);
            await api.post("/Profile/Messprofile", { id, ...form });
            toast.success("Profile saved successfully");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Save failed");
        } finally {
            setSaving(false);
        }
    };

    // Removed blocking loader to enable progressive image loading
    // if (loading) return ...

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Mess Profile</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your mess details and public listing</p>
                </div>
                <button
                    onClick={onSubmit}
                    disabled={!canSave || saving}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm transition-all"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center">
                    <UtensilsCrossed className="w-5 h-5 mr-2 text-blue-600" />
                    <h3 className="font-semibold text-slate-800">General Information</h3>
                </div>

                <div className="p-6">
                    <div className="mb-8 flex flex-col items-center justify-center border-b border-slate-100 pb-8">
                        <div className="relative group">
                            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-slate-100 flex items-center justify-center">
                                {/* STATIC PLACEHOLDER — SAFE */}
                                <img
                                    src="/hero.png"
                                    alt="Profile placeholder"
                                    width="128"
                                    height="128"
                                    fetchPriority="high"
                                    loading="eager"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />

                                {/* REAL AVATAR — LOADS LATER */}
                                {form.image && form.image !== "/hero.webp" && (
                                    <img
                                        src={form.image}
                                        alt="Profile"
                                        className="absolute inset-0 w-full h-full object-cover animate-fadeIn"
                                        referrerPolicy="no-referrer"
                                    />
                                )}

                                {!form.image && (
                                    <div className="absolute inset-0 w-full h-full flex items-center justify-center text-slate-300 bg-black/10 backdrop-blur-[1px]">
                                        <UtensilsCrossed className="w-12 h-12" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer z-10">
                                    <ImageIcon className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <input
                                type="file"
                                onChange={handleImageChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                                title="Change Profile Image"
                            />
                            <div className="absolute bottom-0 right-0 bg-blue-600 text-white p-1.5 rounded-full shadow-md border-2 border-white">
                                <Plus size={14} />
                            </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-3">Click to upload profile picture</p>
                    </div>

                    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Mess Name</label>
                            <input
                                value={form.name}
                                onChange={(e) => update({ name: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                placeholder="e.g. Green Leaf Mess"
                            />
                        </div>
                        <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Information</label>
                            <input
                                value={form.contact}
                                onChange={(e) => update({ contact: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                placeholder="Phone number or email"
                            />
                        </div>

                        <div className="md:col-span-12">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={form.description}
                                onChange={(e) => update({ description: e.target.value })}
                                rows={3}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                placeholder="Tell students about your mess..."
                            />
                            <p className="text-xs text-slate-500 mt-1">This description will appear on your public listing.</p>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price (per month)</label>
                            <div className="relative rounded-lg shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-slate-500 sm:text-sm">₹</span>
                                </div>
                                <input
                                    type="number"
                                    value={form.price}
                                    onChange={(e) => update({ price: e.target.value })}
                                    className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border pl-7 pr-3"
                                    placeholder="3500"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Dietary Type</label>
                            <select
                                value={form.vegNonVeg}
                                onChange={(e) => update({ vegNonVeg: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                            >
                                <option value="veg">Vegetarian Only</option>
                                <option value="non-veg">Non-Vegetarian Only</option>
                                <option value="both">Both Veg & Non-Veg</option>
                            </select>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Price Range Category</label>
                            <select
                                value={form.priceRange}
                                onChange={(e) => update({ priceRange: e.target.value })}
                                className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                            >
                                <option value="low">Budget Friendly</option>
                                <option value="medium">Standard</option>
                                <option value="high">Premium</option>
                            </select>
                        </div>

                        <div className="md:col-span-12 border-t border-slate-100 pt-6 mt-2">
                            <h4 className="text-sm font-semibold text-slate-900 mb-4">Location Details</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Street Address</label>
                                    <input
                                        value={form.adress}
                                        onChange={(e) => update({ adress: e.target.value })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                        placeholder="Street, Area, Landmark"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                    <input
                                        value={form.location.city}
                                        onChange={(e) => update({ location: { ...form.location, city: e.target.value } })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                    <input
                                        value={form.location.state}
                                        onChange={(e) => update({ location: { ...form.location, state: e.target.value } })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                                    <input
                                        value={form.location.pincode}
                                        onChange={(e) => update({ location: { ...form.location, pincode: e.target.value } })}
                                        className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-12 border-t border-slate-100 pt-6 mt-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Facilities</label>
                            <div className="flex gap-2 mb-3">
                                <input
                                    value={facilityInput}
                                    onChange={(e) => setFacilityInput(e.target.value)}
                                    placeholder="Add a facility (e.g. WiFi, RO Water)"
                                    className="flex-1 block rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddFacility())}
                                />
                                <button
                                    type="button"
                                    onClick={onAddFacility}
                                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            {form.facilities.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {form.facilities.map((f, idx) => (
                                        <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium">
                                            {f}
                                            <button type="button" onClick={() => removeFacility(idx)} className="text-blue-400 hover:text-blue-700 rounded-full p-0.5 hover:bg-blue-100 transition-colors">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No facilities added yet.</p>
                            )}
                        </div>

                        <ImagesField form={form} update={update} />
                    </form>
                </div>
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
        <div className="md:col-span-12 border-t border-slate-100 pt-6 mt-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Gallery Images</label>
            <div className="flex gap-2 mb-4">
                <input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste image URL..."
                    className="flex-1 block rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
                />
                <button
                    type="button"
                    onClick={add}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors border border-slate-200"
                >
                    <Upload className="w-5 h-5" />
                </button>
            </div>

            {Array.isArray(form.images) && form.images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.images.map((src, i) => (
                        <div key={i} className="relative group border border-slate-200 rounded-xl overflow-hidden bg-slate-50 aspect-video">
                            <img src={src} alt="preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => remove(i)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-red-600 shadow-lg hover:bg-red-50 transition-colors"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <p className="text-sm text-slate-500">No images added. Add some photos to showcase your mess.</p>
                </div>
            )}
        </div>
    )
}