import { useEffect, useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { Save, Plus, Trash2, Layout, Layers, Box, BedDouble, Loader2 } from "lucide-react";

const HostelStructure = () => {
  const hostelId = localStorage.getItem("Id");
  const [data, setData] = useState({ blocks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      setSaving(true);
      await api.post(`/hostel/${hostelId}/structure`, { blocks: data.blocks });
      toast.success("Structure saved successfully");
      await load();
    } catch (e) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Helpers to mutate nested structure
  const addBlock = () => setData((d) => ({ ...d, blocks: [...(d.blocks || []), { name: `Block ${d.blocks.length + 1}`, floors: [] }] }));
  const removeBlock = (i) => setData((d) => ({ ...d, blocks: d.blocks.filter((_, idx) => idx !== i) }));
  const renameBlock = (i, name) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === i ? { ...b, name } : b) }));

  const addFloor = (bi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: [...(b.floors || []), { name: `Floor ${b.floors.length + 1}`, rooms: [] }] } : b) }));
  const removeFloor = (bi, fi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: b.floors.filter((_, i) => i !== fi) } : b) }));
  const renameFloor = (bi, fi, name) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, name } : f) } : b) }));

  const addRoom = (bi, fi) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, rooms: [...(f.rooms || []), { number: `${f.rooms.length + 1}0${(f.rooms.length % 10) + 1}`, beds: [] }] } : f) } : b) }));
  const removeRoom = (bi, fi, ri) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, rooms: f.rooms.filter((_, k) => k !== ri) } : f) } : b) }));
  const renameRoom = (bi, fi, ri, number) => setData((d) => ({ ...d, blocks: d.blocks.map((b, idx) => idx === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, rooms: f.rooms.map((r, k) => k === ri ? { ...r, number } : r) } : f) } : b) }));

  const addBed = (bi, fi, ri) => setData((d) => ({ ...d, blocks: d.blocks.map((b, i) => i === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, rooms: f.rooms.map((r, k) => k === ri ? { ...r, beds: [...(r.beds || []), { number: (r.beds?.length || 0) + 1, occupiedBy: null }] } : r) } : f) } : b) }));
  const removeBed = (bi, fi, ri, bedIdx) => setData((d) => ({ ...d, blocks: d.blocks.map((b, i) => i === bi ? { ...b, floors: b.floors.map((f, j) => j === fi ? { ...f, rooms: f.rooms.map((r, k) => k === ri ? { ...r, beds: r.beds.filter((_, p) => p !== bedIdx) } : r) } : f) } : b) }));

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hostel Structure</h1>
          <p className="text-slate-500 text-sm mt-1">Define blocks, floors, rooms, and beds</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow-sm transition-all disabled:opacity-70"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Changes
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={addBlock}
            className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center font-medium"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Block
          </button>

          {/* Blocks */}
          <div className="space-y-6">
            {data.blocks.map((b, bi) => (
              <div key={bi} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
                  <div className="flex items-center gap-3">
                    <Layout className="text-blue-600" size={20} />
                    <input
                      value={b.name}
                      onChange={(e) => renameBlock(bi, e.target.value)}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-blue-500 focus:border-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addFloor(bi)} className="flex items-center px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700 transition-colors">
                      <Plus size={14} className="mr-1" /> Floor
                    </button>
                    <button onClick={() => removeBlock(bi)} className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Floors */}
                <div className="p-6 space-y-6">
                  {b.floors.length === 0 && (
                    <div className="text-center py-8 text-slate-400 italic">No floors added yet</div>
                  )}
                  {b.floors.map((f, fi) => (
                    <div key={fi} className="rounded-xl border border-slate-200 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-3 bg-slate-50/50 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                          <Layers className="text-slate-400" size={16} />
                          <input
                            value={f.name}
                            onChange={(e) => renameFloor(bi, fi, e.target.value)}
                            className="px-2 py-1 rounded border border-slate-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => addRoom(bi, fi)} className="flex items-center px-2 py-1 rounded bg-white border border-slate-300 hover:bg-slate-50 text-xs font-medium text-slate-700">
                            <Plus size={12} className="mr-1" /> Room
                          </button>
                          <button onClick={() => removeFloor(bi, fi)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Rooms */}
                      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {f.rooms.map((r, ri) => (
                          <div key={ri} className="rounded-lg border border-slate-200 p-3 bg-white hover:shadow-sm transition-shadow">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Box className="text-slate-400" size={14} />
                                <input
                                  value={r.number}
                                  onChange={(e) => renameRoom(bi, fi, ri, e.target.value)}
                                  className="px-2 py-1 rounded border border-slate-300 text-xs w-20 font-medium"
                                />
                              </div>
                              <button onClick={() => removeRoom(bi, fi, ri)} className="text-slate-400 hover:text-red-500">
                                <Trash2 size={14} />
                              </button>
                            </div>

                            <div className="flex flex-wrap gap-2 min-h-[32px]">
                              {Array.isArray(r.beds) && r.beds.map((bd, bdx) => (
                                <span
                                  key={bdx}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border ${bd.occupiedBy
                                      ? 'bg-blue-50 border-blue-200 text-blue-700'
                                      : 'bg-slate-50 border-slate-200 text-slate-600'
                                    }`}
                                >
                                  <BedDouble size={10} />
                                  {bd.number}
                                  <button onClick={() => removeBed(bi, fi, ri, bdx)} className="ml-1 hover:text-red-500">×</button>
                                </span>
                              ))}
                              <button
                                onClick={() => addBed(bi, fi, ri)}
                                className="inline-flex items-center justify-center w-6 h-6 rounded border border-dashed border-slate-300 text-slate-400 hover:text-blue-600 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                          </div>
                        ))}
                        {f.rooms.length === 0 && (
                          <div className="col-span-full text-center py-2 text-xs text-slate-400">No rooms</div>
                        )}
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
