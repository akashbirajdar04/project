import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { BedDouble, ArrowRightLeft, UserPlus, Loader2 } from "lucide-react";

const HostelAllocation = () => {
  const hostelId = localStorage.getItem("Id");
  const [structure, setStructure] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);

  const [assign, setAssign] = useState({ blockName: "", floorName: "", roomNumber: "", bedNumber: "", studentId: "" });
  const [swap, setSwap] = useState({ a: { blockName: "", floorName: "", roomNumber: "", bedNumber: "" }, b: { blockName: "", floorName: "", roomNumber: "", bedNumber: "" } });

  const blocks = useMemo(() => structure.blocks || [], [structure]);
  const floors = useMemo(() => (blocks.find(b => b.name === assign.blockName)?.floors) || [], [blocks, assign.blockName]);
  const rooms = useMemo(() => (floors.find(f => f.name === assign.floorName)?.rooms) || [], [floors, assign.floorName]);
  const beds = useMemo(() => (rooms.find(r => r.number === assign.roomNumber)?.beds) || [], [rooms, assign.roomNumber]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hostel/${hostelId}/structure`);
      setStructure(res.data?.data || { blocks: [] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load structure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (hostelId) load(); }, [hostelId]);

  const onAssign = async () => {
    try {
      const body = { ...assign };
      if (!body.blockName || !body.floorName || !body.roomNumber || !body.bedNumber || !body.studentId) {
        toast.error("Fill all fields to assign");
        return;
      }
      await api.post(`/hostel/${hostelId}/assign`, body);
      toast.success("Assigned successfully");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Assign failed");
    }
  };

  const onSwap = async () => {
    try {
      const body = { a: swap.a, b: swap.b };
      await api.post(`/hostel/${hostelId}/swap`, body);
      toast.success("Swapped successfully");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Swap failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Room Allocation</h1>
        <p className="text-slate-500 text-sm mt-1">Manage bed assignments and swaps</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assign Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Assign Bed</h2>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Block</label>
                  <select value={assign.blockName} onChange={(e) => setAssign(a => ({ ...a, blockName: e.target.value, floorName: "", roomNumber: "", bedNumber: "" }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Block</option>
                    {blocks.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Floor</label>
                  <select value={assign.floorName} onChange={(e) => setAssign(a => ({ ...a, floorName: e.target.value, roomNumber: "", bedNumber: "" }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Floor</option>
                    {floors.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Room</label>
                  <select value={assign.roomNumber} onChange={(e) => setAssign(a => ({ ...a, roomNumber: e.target.value, bedNumber: "" }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Room</option>
                    {rooms.map(r => <option key={r.number} value={r.number}>{r.number}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1">Bed</label>
                  <select value={assign.bedNumber} onChange={(e) => setAssign(a => ({ ...a, bedNumber: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select Bed</option>
                    {beds.map(bd => <option key={bd.number} value={bd.number}>{bd.number}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Student ID</label>
                <input
                  value={assign.studentId}
                  onChange={(e) => setAssign(a => ({ ...a, studentId: e.target.value }))}
                  placeholder="Enter Student ID"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                onClick={onAssign}
                className="w-full py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition-colors shadow-sm mt-2"
              >
                Assign Student
              </button>
            </div>
          </div>

          {/* Swap Section */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-slate-800">Swap Beds</h2>
            </div>

            <div className="p-6 space-y-6">
              {(["a", "b"]).map((key, idx) => (
                <div key={key} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                    <h3 className="text-sm font-medium text-slate-700">Student {idx === 0 ? "A" : "B"} Location</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <select value={swap[key].blockName} onChange={(e) => setSwap(s => ({ ...s, [key]: { ...s[key], blockName: e.target.value, floorName: "", roomNumber: "", bedNumber: "" } }))} className="px-2 py-2 rounded-lg border border-slate-300 text-xs">
                      <option value="">Block</option>
                      {blocks.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                    </select>
                    <select value={swap[key].floorName} onChange={(e) => setSwap(s => ({ ...s, [key]: { ...s[key], floorName: e.target.value, roomNumber: "", bedNumber: "" } }))} className="px-2 py-2 rounded-lg border border-slate-300 text-xs">
                      <option value="">Floor</option>
                      {(blocks.find(b => b.name === swap[key].blockName)?.floors || []).map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                    </select>
                    <select value={swap[key].roomNumber} onChange={(e) => setSwap(s => ({ ...s, [key]: { ...s[key], roomNumber: e.target.value, bedNumber: "" } }))} className="px-2 py-2 rounded-lg border border-slate-300 text-xs">
                      <option value="">Room</option>
                      {(blocks.find(b => b.name === swap[key].blockName)?.floors.find(f => f.name === swap[key].floorName)?.rooms || []).map(r => <option key={r.number} value={r.number}>{r.number}</option>)}
                    </select>
                    <select value={swap[key].bedNumber} onChange={(e) => setSwap(s => ({ ...s, [key]: { ...s[key], bedNumber: e.target.value } }))} className="px-2 py-2 rounded-lg border border-slate-300 text-xs">
                      <option value="">Bed</option>
                      {(blocks.find(b => b.name === swap[key].blockName)?.floors.find(f => f.name === swap[key].floorName)?.rooms.find(r => r.number === swap[key].roomNumber)?.beds || []).map(bd => <option key={bd.number} value={bd.number}>{bd.number}</option>)}
                    </select>
                  </div>
                </div>
              ))}

              <button
                onClick={onSwap}
                className="w-full py-2.5 rounded-lg bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium transition-colors shadow-sm"
              >
                Swap Students
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelAllocation;
