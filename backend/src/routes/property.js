const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { analyzePropertyImage, generatePropertyContent } = require('../services/aiService');

const router = express.Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `prop-${Date.now()}${path.extname(file.originalname)}`),
});

const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/jpeg|jpg|png|webp/.test(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, WebP allowed.'));
  },
});

// POST /api/property/generate  (real AI)
router.post('/generate', upload.single('image'), async (req, res) => {
  let fp = null;
  try {
    if (!req.file) return res.status(400).json({ error: 'Image required.' });
    fp = req.file.path;

    const pd = {
      propertyType: req.body.propertyType || 'Residential',
      bedrooms: req.body.bedrooms, bathrooms: req.body.bathrooms,
      price: req.body.price, location: req.body.location,
      size: req.body.size, notes: req.body.notes,
    };

    const imageAnalysis = await analyzePropertyImage(fp);
    const marketingContent = await generatePropertyContent(pd, imageAnalysis);

    if (fs.existsSync(fp)) fs.unlinkSync(fp);
    res.json({ success: true, imageAnalysis, marketingContent, propertyData: pd, generatedAt: new Date().toISOString() });
  } catch (err) {
    if (fp && fs.existsSync(fp)) try { fs.unlinkSync(fp); } catch (_) {}
    console.error(err.message);
    if (err.message?.includes('API key') || err.status === 401)
      return res.status(401).json({ error: 'Invalid API key. Check your .env file.' });
    res.status(500).json({ error: err.message || 'Generation failed.' });
  }
});

// POST /api/property/demo  (mock data — no API key needed)
router.post('/demo', (req, res) => {
  setTimeout(() => {
    const { analyzePropertyImage, generatePropertyContent } = require('../services/aiService');
    // Trigger mock path directly
    res.json({
      success: true, isDemo: true,
      imageAnalysis: {
        roomType: 'Living Room', condition: 'Excellent', style: 'Contemporary',
        lighting: 'Bright',
        keyFeatures: ['Vaulted ceilings', 'Hardwood floors', 'Bay windows', 'Feature fireplace', 'Open-plan layout'],
        atmosphere: 'Warm, spacious and inviting', estimatedSize: 'Spacious',
        standoutElement: 'Floor-to-ceiling windows flooding the space with natural light',
        caption: 'a bright contemporary living room with hardwood floors and large windows',
      },
      marketingContent: {
        headline: 'Exceptional Contemporary Living in the Heart of the City',
        tagline: 'Where modern elegance meets effortless everyday lifestyle.',
        fullDescription: `Step into a world of refined contemporary living with this stunning four-bedroom residence that redefines what modern family life can look like. From the moment you enter, you are greeted by soaring vaulted ceilings and an abundance of natural light that floods every corner of this thoughtfully designed home.\n\nThe heart of the property is an expansive open-plan living space anchored by a statement feature fireplace and framed by floor-to-ceiling bay windows that blur the boundary between inside and out. Solid hardwood floors run seamlessly throughout, while premium finishes speak to exceptional quality.\n\nPositioned in one of the city's most sought-after neighbourhoods, this residence places you moments from top-rated schools, boutique dining, and vibrant cultural amenities. A rare opportunity not to be missed.`,
        bulletPoints: ['4 bedrooms, 2 bathrooms across 2,400 sq ft', 'Vaulted ceilings with premium hardwood floors', 'Expansive open-plan living and dining', 'Feature fireplace with floor-to-ceiling windows', 'Prime location minutes from top schools and dining'],
        socialCaption: 'Your dream home awaits ✨ Stunning contemporary 4-bed with soaring ceilings & garden views. #DreamHome #RealEstate #PropertyForSale',
        callToAction: 'Book your private viewing today — properties like this are rarely available.',
        seoTitle: 'Contemporary 4-Bed Home | Prime Location | $1.2M',
        targetAudience: 'Professional families seeking premium lifestyle living in a prime urban location.',
      },
      propertyData: req.body,
      generatedAt: new Date().toISOString(),
    });
  }, 2800);
});

module.exports = router;
