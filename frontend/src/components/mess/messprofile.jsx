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

  // Placeholder for additional logic (e.g., save handler, facility management, image upload)
  // The rest of the component implementation would go here.

  return null;
};