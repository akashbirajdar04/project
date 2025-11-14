import HostelStructure from "../models/hostel-structure.js";

export const getStructure = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const doc = await HostelStructure.findOne({ hostelId });
    return res.json({ success: true, data: doc || { hostelId, blocks: [] } });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const upsertStructure = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { blocks } = req.body;
    const doc = await HostelStructure.findOneAndUpdate(
      { hostelId },
      { $set: { blocks } },
      { new: true, upsert: true }
    );
    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const assignBed = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { blockName, floorName, roomNumber, bedNumber, studentId } = req.body;
    const doc = await HostelStructure.findOne({ hostelId });
    if (!doc) return res.status(404).json({ success: false, message: "Structure not found" });

    const block = doc.blocks.find(b => b.name === blockName);
    if (!block) return res.status(404).json({ success: false, message: "Block not found" });
    const floor = block.floors.find(f => f.name === floorName);
    if (!floor) return res.status(404).json({ success: false, message: "Floor not found" });
    const room = floor.rooms.find(r => r.number === roomNumber);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });
    const bed = room.beds.find(b => b.number === Number(bedNumber));
    if (!bed) return res.status(404).json({ success: false, message: "Bed not found" });
    if (bed.occupiedBy && String(bed.occupiedBy) !== String(studentId)) {
      return res.status(400).json({ success: false, message: "Bed already occupied" });
    }

    bed.occupiedBy = studentId;
    await doc.save({ validateBeforeSave: false });
    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};

export const swapBeds = async (req, res) => {
  try {
    const { hostelId } = req.params;
    const { a, b } = req.body; // each: { blockName, floorName, roomNumber, bedNumber }
    const doc = await HostelStructure.findOne({ hostelId });
    if (!doc) return res.status(404).json({ success: false, message: "Structure not found" });

    const findBed = (ref) => {
      const block = doc.blocks.find(x => x.name === ref.blockName);
      const floor = block?.floors.find(x => x.name === ref.floorName);
      const room = floor?.rooms.find(x => x.number === ref.roomNumber);
      const bed = room?.beds.find(x => x.number === Number(ref.bedNumber));
      return { bed };
    };

    const bedA = findBed(a).bed;
    const bedB = findBed(b).bed;
    if (!bedA || !bedB) return res.status(404).json({ success: false, message: "Bed not found" });

    const temp = bedA.occupiedBy;
    bedA.occupiedBy = bedB.occupiedBy;
    bedB.occupiedBy = temp;
    await doc.save({ validateBeforeSave: false });
    return res.json({ success: true, data: doc });
  } catch (e) {
    return res.status(500).json({ success: false, message: e.message });
  }
};
