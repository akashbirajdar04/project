import { useEffect, useMemo, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Allocation</h1>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <>
          {/* Assign Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3">Assign a Bed</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              <select value={assign.blockName} onChange={(e)=>setAssign(a=>({ ...a, blockName:e.target.value, floorName:"", roomNumber:"", bedNumber:"" }))} className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300">
                <option value="">Select Block</option>
                {blocks.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
              <select value={assign.floorName} onChange={(e)=>setAssign(a=>({ ...a, floorName:e.target.value, roomNumber:"", bedNumber:"" }))} className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300">
                <option value="">Select Floor</option>
                {floors.map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
              </select>
              <select value={assign.roomNumber} onChange={(e)=>setAssign(a=>({ ...a, roomNumber:e.target.value, bedNumber:"" }))} className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300">
                <option value="">Select Room</option>
                {rooms.map(r => <option key={r.number} value={r.number}>{r.number}</option>)}
              </select>
              <select value={assign.bedNumber} onChange={(e)=>setAssign(a=>({ ...a, bedNumber:e.target.value }))} className="md:col-span-2 px-3 py-2 rounded-lg border border-slate-300">
                <option value="">Bed</option>
                {beds.map(bd => <option key={bd.number} value={bd.number}>{bd.number}</option>)}
              </select>
              <input value={assign.studentId} onChange={(e)=>setAssign(a=>({ ...a, studentId:e.target.value }))} placeholder="Student ID" className="md:col-span-6 px-3 py-2 rounded-lg border border-slate-300" />
              <button onClick={onAssign} className="md:col-span-2 px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Assign</button>
            </div>
          </div>

          {/* Swap Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-3">Swap Beds</h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
              {(["a","b"]).map((key, idx) => (
                <div key={key} className="md:col-span-6 grid grid-cols-1 md:grid-cols-12 gap-2">
                  <div className="md:col-span-12 font-medium text-slate-700">{idx===0?"First":"Second"} Bed</div>
                  <select value={swap[key].blockName} onChange={(e)=>setSwap(s=>({ ...s, [key]: { ...s[key], blockName:e.target.value, floorName:"", roomNumber:"", bedNumber:"" } }))} className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-300">
                    <option value="">Block</option>
                    {blocks.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  </select>
                  <select value={swap[key].floorName} onChange={(e)=>setSwap(s=>({ ...s, [key]: { ...s[key], floorName:e.target.value, roomNumber:"", bedNumber:"" } }))} className="md:col-span-4 px-3 py-2 rounded-lg border border-slate-300">
                    <option value="">Floor</option>
                    {(blocks.find(b=>b.name===swap[key].blockName)?.floors||[]).map(f => <option key={f.name} value={f.name}>{f.name}</option>)}
                  </select>
                  <select value={swap[key].roomNumber} onChange={(e)=>setSwap(s=>({ ...s, [key]: { ...s[key], roomNumber:e.target.value, bedNumber:"" } }))} className="md:col-span-3 px-3 py-2 rounded-lg border border-slate-300">
                    <option value="">Room</option>
                    {(blocks.find(b=>b.name===swap[key].blockName)?.floors.find(f=>f.name===swap[key].floorName)?.rooms||[]).map(r => <option key={r.number} value={r.number}>{r.number}</option>)}
                  </select>
                  <select value={swap[key].bedNumber} onChange={(e)=>setSwap(s=>({ ...s, [key]: { ...s[key], bedNumber:e.target.value } }))} className="md:col-span-1 px-3 py-2 rounded-lg border border-slate-300">
                    <option value="">Bed</option>
                    {(blocks.find(b=>b.name===swap[key].blockName)?.floors.find(f=>f.name===swap[key].floorName)?.rooms.find(r=>r.number===swap[key].roomNumber)?.beds||[]).map(bd => <option key={bd.number} value={bd.number}>{bd.number}</option>)}
                  </select>
                </div>
              ))}
              <div className="md:col-span-12 flex justify-end">
                <button onClick={onSwap} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Swap</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HostelAllocation;
