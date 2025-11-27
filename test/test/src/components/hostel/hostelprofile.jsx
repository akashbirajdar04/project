import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Building2, MapPin, Phone, Save, Loader2, Image as ImageIcon } from "lucide-react";

export const Hostelprofile = () => {
    const hostelId = localStorage.getItem("Id");
    const [profile, setProfile] = useState({
        name: "",
        address: "",
        contact: "",
        description: "",
        facilities: "",
        rules: "",
        image: ""
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const load = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/hostel/${hostelId}/profile`);
            if (res.data?.data) {
                const data = res.data.data;
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
            // toast.error("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Show local preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);

            const form = new FormData();
            form.append("image", file);
            api.put(`/hostel/${hostelId}/profile/image`, form)
                .then((res) => {
                    toast.success("Image updated successfully");
                    if (res.data?.data?.url) {
                        setProfile(prev => ({ ...prev, image: res.data.data.url }));
                    }
                })
                .catch((e) => {
                    toast.error(e?.response?.data?.message || "Update failed");
                })
        }
    };

    useEffect(() => { if (hostelId) load(); }, [hostelId]);

    const onSave = async () => {
        try {
            setSaving(true);
            await api.put(`/hostel/${hostelId}/profile`, profile);
            toast.success("Profile updated successfully");
        } catch (e) {
            toast.error(e?.response?.data?.message || "Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Hostel Profile</h1>
                    <p className="text-slate-500 text-sm mt-1">Manage your hostel's public information</p>
                </div>
                <button
                    onClick={onSave}
                    disabled={saving}
                    className="flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-all disabled:opacity-70"
                >
                    {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">Basic Details</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Hostel Name</label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="e.g. Sunshine Boys Hostel"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                <textarea
                                    value={profile.address}
                                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                                    placeholder="Full address of the property"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Contact Number</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    value={profile.contact}
                                    onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
                        <h3 className="font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">Additional Info</h3>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                            <textarea
                                value={profile.description}
                                onChange={(e) => setProfile({ ...profile, description: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                placeholder="Tell students about your hostel..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Facilities (Comma separated)</label>
                            <input
                                value={profile.facilities}
                                onChange={(e) => setProfile({ ...profile, facilities: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="WiFi, AC, Gym, Laundry..."
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar / Images */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <h3 className="font-semibold text-slate-800 mb-4">Hostel Image</h3>
                        <div className="aspect-video rounded-lg bg-slate-100 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-500 transition-all cursor-pointer relative overflow-hidden">
                            {profile.image ? (
                                <img
                                    src={profile.image}
                                    alt="Hostel"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <>
                                    <ImageIcon className="w-8 h-8 mb-2" />
                                    <span className="text-xs font-medium">Upload Image</span>
                                </>
                            )}
                            <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2 text-center">
                            Supported: JPG, PNG (Max 5MB)
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                        <h3 className="font-semibold text-blue-900 mb-2">Tips</h3>
                        <ul className="text-sm text-blue-800 space-y-2 list-disc pl-4">
                            <li>Keep your contact info up to date.</li>
                            <li>List all major facilities to attract students.</li>
                            <li>Add a clear description of the location.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
