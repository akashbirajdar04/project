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
      } catch (e) {
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

  const handleFacilityAdd = () => {
    if (facilityInput.trim()) {
      setForm((prev) => ({
        ...prev,
        facilities: [...prev.facilities, facilityInput.trim()],
      }));
      setFacilityInput("");
    }
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
      } catch {
        toast.error("Failed to upload an image");
      }
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, ...uploaded],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    try {
      await api.put(`/Profile/Messprofile/${id}`, form);
      toast.success("Mess profile updated");
    } catch {
      toast.error("Failed to update mess profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Mess Name"
          className="border p-2 rounded"
          required
        />
        <input
          name="adress"
          value={form.adress}
          onChange={handleChange}
          placeholder="Address"
          className="border p-2 rounded"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="border p-2 rounded"
          required
        />
        <input
          name="contact"
          value={form.contact}
          onChange={handleChange}
          placeholder="Contact Number"
          className="border p-2 rounded"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded w-full"
        rows={4}
      />

      <div className="flex items-center space-x-2">
        <input
          value={facilityInput}
          onChange={(e) => setFacilityInput(e.target.value)}
          placeholder="Add facility"
          className="border p-2 rounded flex-1"
        />
        <button
          type="button"
          onClick={handleFacilityAdd}
          className="bg-primary text-white p-2 rounded flex items-center"
        >
          <Plus size={16} />
        </button>
      </div>

      <ul className="list-disc pl-5 space-y-1">
        {form.facilities.map((f, i) => (
          <li key={i} className="flex justify-between items-center">
            {f}
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  facilities: prev.facilities.filter((_, idx) => idx !== i),
                }))
              }
              className="text-red-500"
            >
              <X size={14} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center space-x-2">
        <label className="flex items-center cursor-pointer">
          <Upload className="mr-2" />
          <span>Upload Images</span>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {form.images.map((src, i) => (
          <div key={i} className="relative">
            <img src={src} alt={`Mess ${i}`} className="object-cover w-full h-32 rounded" />
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  images: prev.images.filter((_, idx) => idx !== i),
                }))
              }
              className="absolute top-1 right-1 bg-white rounded-full p-1"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={!canSave || saving}
        className={`flex items-center justify-center gap-2 px-4 py-2 rounded ${
          canSave && !saving ? "bg-primary text-white" : "bg-gray-300 text-gray-600"
        }`}
      >
        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        Save
      </button>
    </form>
  );
};