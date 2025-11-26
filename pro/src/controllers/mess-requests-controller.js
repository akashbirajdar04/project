import { Mess, Student } from "../models/user.module.js";

export const acceptMessRequest = async (req, res) => {
  try {
    const { messId } = req.params;
    const { userId } = req.body;
    console.log('AcceptMessRequest called with messId:', messId, 'userId:', userId);
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const mess = await Mess.findById(messId);
    if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });

    // remove from requesters if present
    mess.requesters = (mess.requesters || []).filter((id) => String(id) !== String(userId));
    // add to accepted if not present
    if (!mess.accepted?.some((id) => String(id) === String(userId))) {
      mess.accepted = [...(mess.accepted || []), userId];
    }
    await mess.save({ validateBeforeSave: false });

    // Update student's messid
    const student = await Student.findById(userId);
    if (student) {
      student.messid = messId;
      await student.save({ validateBeforeSave: false });
      console.log('Student messid updated for', userId);
    }

    res.json({ success: true, data: { requesters: mess.requesters, accepted: mess.accepted } });
  } catch (e) {
    console.error('Error accepting mess request:', e);
    res.status(500).json({ success: false, message: e.message });
  }
};

export const getMessAccepted = async (req, res) => {
  try {
    const { messId } = req.params;
    const mess = await Mess.findById(messId).populate({ path: 'accepted', select: 'username email role' });
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    res.json({ success: true, data: mess.accepted || [] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const removeMessAccepted = async (req, res) => {
  try {
    const { messId, userId } = req.params;
    const mess = await Mess.findById(messId);
    if (!mess) return res.status(404).json({ success: false, message: 'Mess not found' });
    mess.accepted = (mess.accepted || []).filter((id) => String(id) !== String(userId));
    await mess.save({ validateBeforeSave: false });
    res.json({ success: true, data: mess.accepted });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};

export const rejectMessRequest = async (req, res) => {
  try {
    const { messId } = req.params;
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ success: false, message: "userId required" });

    const mess = await Mess.findById(messId);
    if (!mess) return res.status(404).json({ success: false, message: "Mess not found" });

    // remove from requesters
    mess.requesters = (mess.requesters || []).filter((id) => String(id) !== String(userId));
    await mess.save({ validateBeforeSave: false });

    res.json({ success: true, data: { requesters: mess.requesters, accepted: mess.accepted } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
};
