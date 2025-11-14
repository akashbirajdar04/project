import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  occupiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { _id: false });

const RoomSchema = new mongoose.Schema({
  number: { type: String, required: true },
  beds: { type: [BedSchema], default: [] },
});

const FloorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rooms: { type: [RoomSchema], default: [] },
});

const BlockSchema = new mongoose.Schema({
  name: { type: String, required: true },
  floors: { type: [FloorSchema], default: [] },
});

const HostelStructureSchema = new mongoose.Schema({
  hostelId: { type: mongoose.Schema.Types.ObjectId, ref: "Hostel", required: true, index: true, unique: true },
  blocks: { type: [BlockSchema], default: [] },
}, { timestamps: true });

const HostelStructure = mongoose.model("HostelStructure", HostelStructureSchema);
export default HostelStructure;
