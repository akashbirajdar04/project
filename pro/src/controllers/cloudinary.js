import api from "../../../test/test/src/lib/api";

api.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // THIS is where it's called  
    const result = await uploadBufferToCloudinary(req.file.buffer, { folder: 'users' });

    const doc = await Image.create({
      url: result.secure_url,
      public_id: result.public_id
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});
