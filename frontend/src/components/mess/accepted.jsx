import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import {
  Users,
  UserMinus,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const AcceptedMembers = () => {
  const messId = localStorage.getItem("Id");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/Profile/Messaccepted/${messId}`, {
        params: { page, limit, search },
      });
      setItems(res.data?.data ?? []);
      setPage(res.data?.page ?? 1);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load accepted members");
    } finally {
      setLoading(false);
    }
  };

  // Debounce search and reload on change
  useEffect(() => {
    const timer = setTimeout(() => {
      if (messId) load();
    }, 300);
    return () => clearTimeout(timer);
  }, [messId, page, search]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 on new search
  };

  const remove = async (userId) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    try {
      await api.delete(`/Profile/Messaccepted/${messId}/${userId}`);
      toast.success("Removed from accepted list");
      setItems((prev) => prev.filter((u) => u._id !== userId));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to remove");
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Search className="mr-2 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={handleSearchChange}
          className="border rounded px-2 py-1 flex-1"
        />
      </div>

      {items.length === 0 ? (
        <p className="text-center text-gray-500">No accepted members found.</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((member) => (
              <tr key={member._id} className="border-t">
                <td className="px-4 py-2 flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {member.name || member.username || "Unnamed"}
                </td>
                <td className="px-4 py-2">{member.email || "N/A"}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => remove(member._id)}
                    className="text-red-600 hover:text-red-800 flex items-center justify-center"
                  >
                    <UserMinus className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
          className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
          className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default AcceptedMembers;