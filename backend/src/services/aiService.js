/**
 * PropAI — AI Service
 *
 * Supported providers:
 *  - "free"      → Hugging Face (FREE, no credit card)
 *                  Image: Salesforce/blip-image-captioning-large (FREE)
 *                  Text:  mistralai/Mistral-7B-Instruct-v0.3 (FREE)
 *                  Sign up: https://huggingface.co/settings/tokens
 *
 *  - "anthropic" → Claude Vision (best quality, paid)
 *  - "openai"    → GPT-4o Vision (great quality, paid)
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');

// ─── Main exported functions ──────────────────────────────────────────────────
async function analyzePropertyImage(imagePath) {
  const provider = process.env.AI_PROVIDER || 'free';
  console.log(`🤖 Image analysis via: ${provider}`);

  if (provider === 'openai') return await analyzeOpenAI(imagePath);
  if (provider === 'anthropic') return await analyzeAnthropic(imagePath);
  return await analyzeHuggingFace(imagePath);
}

async function generatePropertyContent(propertyData, imageAnalysis) {
  const provider = process.env.AI_PROVIDER || 'free';
  console.log(`✍️  Content generation via: ${provider}`);

  const prompt = buildPrompt(propertyData, imageAnalysis);

  if (provider === 'openai') return await generateOpenAI(prompt);
  if (provider === 'anthropic') return await generateAnthropic(prompt);
  return await generateHuggingFace(prompt);
}

// ─── Prompt Builder ───────────────────────────────────────────────────────────
function buildPrompt(pd, ia) {
  const propertyType = pd.propertyType || ia?.predictedPropertyType || 'Residential';
  const bedrooms = pd.bedrooms || ia?.predictedBedrooms || '?';
  const location = pd.location || ia?.predictedLocation || 'Prime Location';

  return `You are an expert real estate copywriter. Generate premium property marketing content.

PROPERTY: ${propertyType} | ${bedrooms} bed | ${pd.bathrooms || '?'} bath | ${pd.price ? '$' + pd.price : 'POA'} | ${location} | ${pd.size ? pd.size + ' sqft' : ''} 
IMAGE ANALYSIS: ${ia?.caption || ''} | Style: ${ia?.style || 'Modern'} | Condition: ${ia?.condition || 'Excellent'}
NOTES: ${pd.notes || 'None'}

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "headline": "compelling headline max 12 words",
  "tagline": "evocative sub-headline max 20 words",
  "fullDescription": "3 paragraphs 150-200 words total: hook, features, location/value",
  "bulletPoints": ["feature 1","feature 2","feature 3","feature 4","feature 5"],
  "socialCaption": "Instagram caption with hashtags max 150 chars",
  "callToAction": "compelling CTA sentence",
  "seoTitle": "SEO page title max 60 chars",
  "targetAudience": "target buyer profile 1 sentence"
}`;
}

// ─── FREE: Hugging Face ───────────────────────────────────────────────────────
async function analyzeHuggingFace(imagePath) {
  const key = process.env.HF_API_KEY;
  if (!key || key.startsWith('hf_your')) {
    // Return enriched mock if no HF key is set
    return mockImageAnalysis();
  }

  try {
    const imageBuffer = fs.readFileSync(imagePath);

    // BLIP image captioning — completely free
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/octet-stream',
        },
        timeout: 30000,
      }
    );

    const caption = response.data?.[0]?.generated_text || 'a modern property interior';

    // Enrich the caption into structured analysis
    return enrichCaption(caption);
  } catch (err) {
    console.warn('HF image analysis failed, using mock:', err.message);
    return mockImageAnalysis();
  }
}

async function generateHuggingFace(prompt) {
  const key = process.env.HF_API_KEY;
  if (!key || key.startsWith('hf_your')) {
    return mockMarketingContent();
  }

  try {
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
      {
        inputs: `<s>[INST] ${prompt} [/INST]`,
        parameters: {
          max_new_tokens: 1200,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: { Authorization: `Bearer ${key}` },
        timeout: 60000,
      }
    );

    const text = response.data?.[0]?.generated_text || '';
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return mockMarketingContent();
  } catch (err) {
    console.warn('HF text generation failed, using mock:', err.message);
    return mockMarketingContent();
  }
}

// ─── PAID: Anthropic ──────────────────────────────────────────────────────────
async function analyzeAnthropic(imagePath) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const buf = fs.readFileSync(imagePath);
  const b64 = buf.toString('base64');
  const ext = path.extname(imagePath).toLowerCase().replace('.', '');
  const mt = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  const res = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: mt, data: b64 } },
        { type: 'text', text: 'Analyse this property image. Return ONLY raw JSON (no markdown): {"roomType":"...","condition":"Excellent|Good|Fair","style":"...","lighting":"Bright|Well-lit|Moderate|Dim","keyFeatures":["..."],"atmosphere":"...","estimatedSize":"Small|Medium|Large|Spacious","standoutElement":"...","caption":"one sentence describing the space","predictedPropertyType":"House|Apartment|Villa|Townhouse|Studio|Penthouse|Commercial|Land","predictedBedrooms":"1|2|3|4|5+ or numeric","predictedLocation":"city, neighbourhood, or blank if unknown"}' }
      ]
    }]
  });

  const text = res.content[0].text.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text);
}

async function generateAnthropic(prompt) {
  const Anthropic = require('@anthropic-ai/sdk');
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const res = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  const text = res.content[0].text.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text);
}

// ─── PAID: OpenAI ─────────────────────────────────────────────────────────────
async function analyzeOpenAI(imagePath) {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const buf = fs.readFileSync(imagePath);
  const b64 = buf.toString('base64');
  const ext = path.extname(imagePath).toLowerCase().replace('.', '');
  const mt = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;

  const res = await client.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: [
        { type: 'image_url', image_url: { url: `data:${mt};base64,${b64}` } },
        { type: 'text', text: 'Analyse this property image. Return ONLY raw JSON (no markdown): {"roomType":"...","condition":"Excellent|Good|Fair","style":"...","lighting":"Bright|Well-lit|Moderate|Dim","keyFeatures":["..."],"atmosphere":"...","estimatedSize":"Small|Medium|Large|Spacious","standoutElement":"...","caption":"one sentence describing the space","predictedPropertyType":"House|Apartment|Villa|Townhouse|Studio|Penthouse|Commercial|Land","predictedBedrooms":"1|2|3|4|5+ or numeric","predictedLocation":"city, neighbourhood, or blank if unknown"}' }
      ]
    }]
  });
  const text = res.choices[0].message.content.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text);
}

async function generateOpenAI(prompt) {
  const OpenAI = require('openai');
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const res = await client.chat.completions.create({
    model: 'gpt-4o', max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });
  const text = res.choices[0].message.content.trim().replace(/```json\n?|\n?```/g, '');
  return JSON.parse(text);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function enrichCaption(caption) {
  const lower = caption.toLowerCase();
  const roomType = lower.includes('kitchen') ? 'Kitchen'
    : lower.includes('bedroom') || lower.includes('bed') ? 'Bedroom'
    : lower.includes('bathroom') || lower.includes('bath') ? 'Bathroom'
    : lower.includes('garden') || lower.includes('outdoor') ? 'Garden / Outdoor'
    : lower.includes('dining') ? 'Dining Room'
    : 'Living Room';

  const propertyType = lower.includes('apartment') ? 'Apartment'
    : lower.includes('villa') ? 'Villa'
    : lower.includes('townhouse') ? 'Townhouse'
    : lower.includes('studio') ? 'Studio'
    : lower.includes('penthouse') ? 'Penthouse'
    : lower.includes('commercial') ? 'Commercial'
    : lower.includes('land') ? 'Land'
    : 'House';

  const bedroomMatch = caption.match(/(\d+)\s*-?\s*(?:bedroom|bedrooms|beds|bd\b)|(?:one|two|three|four|five|six|seven|eight|nine|ten)\s+(?:bedroom|bedrooms|beds)/i);
  const bedroomWords = caption.match(/\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
  const parsedBedrooms = bedroomMatch ? (parseInt(bedroomMatch[1], 10) || (bedroomWords && wordsToNumber(bedroomWords[1])) || null) : null;
  const predictedBedrooms = parsedBedrooms || (lower.includes('studio') ? 1 : null);

  return {
    roomType,
    condition: 'Excellent',
    style: lower.includes('modern') || lower.includes('contemporary') ? 'Contemporary' : 'Classic',
    lighting: lower.includes('bright') || lower.includes('light') ? 'Bright' : 'Well-lit',
    keyFeatures: ['Spacious layout', 'Quality finishes', 'Natural light', 'Premium fixtures'],
    atmosphere: 'Warm and inviting',
    estimatedSize: 'Large',
    standoutElement: caption,
    caption,
    predictedPropertyType: propertyType,
    predictedBedrooms,
    predictedLocation: '',
  };
}

function wordsToNumber(word) {
  const map = {
    one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  };
  return map[word.toLowerCase()] || null;
}

function mockImageAnalysis() {
  return {
    roomType: 'Living Room',
    condition: 'Excellent',
    style: 'Contemporary',
    lighting: 'Bright',
    keyFeatures: ['Vaulted ceilings', 'Hardwood floors', 'Bay windows', 'Feature fireplace', 'Open-plan layout'],
    atmosphere: 'Warm, spacious and inviting',
    estimatedSize: 'Spacious',
    standoutElement: 'Floor-to-ceiling windows flooding the space with natural light',
    caption: 'a bright contemporary living room with hardwood floors and large windows',
  };
}

function mockMarketingContent() {
  return {
    headline: 'Exceptional Contemporary Living in the Heart of the City',
    tagline: 'Where modern elegance meets effortless everyday lifestyle.',
    fullDescription: `Step into a world of refined contemporary living with this stunning four-bedroom residence that redefines what modern family life can look like. From the moment you enter, you are greeted by soaring vaulted ceilings and an abundance of natural light that floods every corner of this thoughtfully designed home.\n\nThe heart of the property is an expansive open-plan living space anchored by a statement feature fireplace and framed by floor-to-ceiling bay windows that blur the boundary between inside and out. Solid hardwood floors run seamlessly throughout, while premium finishes speak to the exceptional quality found in every detail.\n\nPositioned in one of the city's most sought-after neighbourhoods, this residence places you moments from top-rated schools, boutique dining, and cultural amenities. A rare opportunity not to be missed.`,
    bulletPoints: [
      '4 bedrooms, 2 bathrooms across 2,400 sq ft',
      'Vaulted ceilings with premium hardwood floors throughout',
      'Expansive open-plan living and dining space',
      'Feature fireplace with floor-to-ceiling windows',
      'Prime location minutes from top schools and dining',
    ],
    socialCaption: 'Your dream home awaits ✨ Stunning contemporary 4-bed with soaring ceilings & garden views. #PropertyForSale #DreamHome #RealEstate',
    callToAction: 'Book your private viewing today — properties like this are rarely available.',
    seoTitle: 'Contemporary 4-Bed Home | Prime City Location | $1.2M',
    targetAudience: 'Professional families and discerning buyers seeking premium lifestyle living in a prime urban location.',
  };
}

module.exports = { analyzePropertyImage, generatePropertyContent };
