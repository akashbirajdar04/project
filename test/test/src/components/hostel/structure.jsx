import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";

const HostelStructure = () => {
  const hostelId = localStorage.getItem("Id");
  const [data, setData] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/hostel/${hostelId}/structure`);
      setData(res.data?.data || { blocks: [] });
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to load structure");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (hostelId) load(); }, [hostelId]);

  const save = async () => {
    try {
      await api.post(`/hostel/${hostelId}/structure`, { blocks: data.blocks });
      toast.success("Structure saved");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    }
  };

  // Helpers to mutate nested structure
  const addBlock = () => setData((d) => ({ ...d, blocks: [...(d.blocks||[]), { name: `Block ${d.blocks.length+1}`, floors: [] }] }));
  const removeBlock = (i) => setData((d) => ({ ...d, blocks: d.blocks.filter((_, idx) => idx !== i) }));
  const renameBlock = (i, name) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===i ? { ...b, name } : b) }));

  const addFloor = (bi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: [...(b.floors||[]), { name: `Floor ${b.floors.length+1}`, rooms: [] }] } : b) }));
  const removeFloor = (bi, fi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: b.floors.filter((_, i) => i!==fi) } : b) }));
  const renameFloor = (bi, fi, name) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, name } : f) } : b) }));

  const addRoom = (bi, fi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, rooms: [...(f.rooms||[]), { number: `${f.rooms.length+1}0${(f.rooms.length%10)+1}`, beds: [] }] } : f) } : b) }));
  const removeRoom = (bi, fi, ri) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, rooms: f.rooms.filter((_, k) => k!==ri) } : f) } : b) }));
  const renameRoom = (bi, fi, ri, number) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, rooms: f.rooms.map((r, k) => k===ri ? { ...r, number } : r) } : f) } : b) }));

  const addBed = (bi, fi, ri) => setData((d) => ({ ...d, blocks: d.blocks.map((b, i) => i===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, rooms: f.rooms.map((r, k) => k===ri ? { ...r, beds: [...(r.beds||[]), { number: (r.beds?.length||0)+1, occupiedBy: null }] } : r) } : f) } : b) }));
  const removeBed = (bi, fi, ri, bedIdx) => setData((d) => ({ ...d, blocks: d.blocks.map((b, i) => i===bi ? { ...b, floors: b.floors.map((f, j) => j===fi ? { ...f, rooms: f.rooms.map((r, k) => k===ri ? { ...r, beds: r.beds.filter((_, p) => p!==bedIdx) } : r) } : f) } : b) }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-slate-800">Hostel Structure</h1>
        <button onClick={save} className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">Save</button>
      </div>

      {loading ? (
        <div className="text-slate-500">Loading...</div>
      ) : (
        <div className="space-y-3">
          <button onClick={addBlock} className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50">+ Add Block</button>

          {/* Blocks */}
          <div className="space-y-3">
            {data.blocks.map((b, bi) => (
              <div key={bi} className="border rounded-xl bg-white shadow-sm">
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <input value={b.name} onChange={(e)=>renameBlock(bi, e.target.value)} className="px-3 py-1.5 rounded border border-slate-300" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={()=>addFloor(bi)} className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">+ Floor</button>
                    <button onClick={()=>removeBlock(bi)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50">Remove</button>
                  </div>
                </div>

                {/* Floors */}
                <div className="p-3 space-y-3">
                  {b.floors.map((f, fi) => (
                    <div key={fi} className="rounded-lg border">
                      <div className="flex items-center justify-between p-3 border-b bg-slate-50">
                        <input value={f.name} onChange={(e)=>renameFloor(bi, fi, e.target.value)} className="px-3 py-1.5 rounded border border-slate-300" />
                        <div className="flex gap-2">
                          <button onClick={()=>addRoom(bi, fi)} className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50">+ Room</button>
                          <button onClick={()=>removeFloor(bi, fi)} className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50">Remove</button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="p-3 space-y-2">
                        {f.rooms.map((r, ri) => (
                          <div key={ri} className="rounded-md border p-3">
                            <div className="flex items-center gap-2">
                              <label className="text-sm text-slate-600">Room</label>
                              <input value={r.number} onChange={(e)=>renameRoom(bi, fi, ri, e.target.value)} className="px-2 py-1 rounded border border-slate-300 w-32" />
                              <button onClick={()=>addBed(bi, fi, ri)} className="ml-auto px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-50">+ Bed</button>
                              <button onClick={()=>removeRoom(bi, fi, ri)} className="px-3 py-1 rounded-lg border border-red-300 text-red-600 hover:bg-red-50">Remove Room</button>
                            </div>
                            {Array.isArray(r.beds) && r.beds.length>0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {r.beds.map((bd, bdx) => (
                                  <span key={bdx} className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${bd.occupiedBy ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
                                    Bed {bd.number}
                                    <button onClick={()=>removeBed(bi, fi, ri, bdx)} className="text-slate-500 hover:text-slate-700">✕</button>
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HostelStructure;
