import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import {
  Save,
  Plus,
  X,
  Upload,
  Loader2,
  UtensilsCrossed,
  Image as ImageIcon,
} from "lucide-react";

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
    image: "",
  });
  const [facilityInput, setFacilityInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const canSave = useMemo(
    () => form.name.trim() && form.adress.trim() && form.price !== "",
    [form]
  );

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
          image: "",
        });
      } catch (_) {
        toast.error("Failed to load mess profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value,
      },
    }));
  };

  const addFacility = () => {
    if (facilityInput.trim()) {
      setForm((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput("");
    }
  };

  const removeFacility = (idx) => {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== idx),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await api.post("/upload", formData);
        uploaded.push(res.data?.url);
      } catch (_) {
        toast.error("Failed to upload image");
      }
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
  };

  const handleSave = async () => {
    if (!canSave) return;
    setSaving(true);
    try {
      await api.put(`/Profile/Messprofile/${id}`, form);
      toast.success("Mess profile saved successfully");
    } catch (_) {
      toast.error("Failed to save mess profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Mess Profile</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Address</label>
          <input
            name="adress"
            value={form.adress}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Price</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contact</label>
          <input
            name="contact"
            value={form.contact}
            onChange={handleChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            name="city"
            value={form.location.city}
            onChange={handleLocationChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">State</label>
          <input
            name="state"
            value={form.location.state}
            onChange={handleLocationChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Pincode</label>
          <input
            name="pincode"
            value={form.location.pincode}
            onChange={handleLocationChange}
            className="mt-1 block w-full border rounded p-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Facilities</label>
        <div className="flex space-x-2 mb-2">
          <input
            value={facilityInput}
            onChange={(e) => setFacilityInput(e.target.value)}
            className="flex-1 border rounded p-2"
            placeholder="Add facility"
          />
          <button
            type="button"
            onClick={addFacility}
            className="flex items-center px-3 py-2 bg-blue-600 text-white rounded"
          >
            <Plus size={16} className="mr-1" />
            Add
          </button>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          {form.facilities.map((f, idx) => (
            <li key={idx} className="flex items-center justify-between">
              <span>{f}</span>
              <button
                type="button"
                onClick={() => removeFacility(idx)}
                className="text-red-600"
              >
                <X size={14} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Images</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700"
        />
        <div className="grid grid-cols-3 gap-2 mt-2">
          {form.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Mess ${idx}`}
              className="h-24 w-full object-cover rounded"
            />
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`flex items-center px-4 py-2 rounded text-white ${
            canSave && !saving ? "bg-green-600 hover:bg-green-700" : "bg-gray-400"
          }`}
        >
          {saving ? (
            <Loader2 className="animate-spin mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save
        </button>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
        >
          <X className="mr-2 h-4 w-4" />
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Messprofile;