// PRINTORA Global Cloud Synchronization Service
// Ensures that all product modifications (images from gallery/file manager, prices, names)
// are stored in a centralized cloud store and immediately visible to ALL devices worldwide.
// Uses Netlify's high-speed edge snippet injection for instantaneous zero-latency updates.

const NETLIFY_SITE_ID = '1e7ae1ee-956c-4b70-8782-e80976f65b21';
const NETLIFY_AUTH_TOKEN = 'nfp_NzZ73sUXoGVAnidHGS5TeWw4ctP3M7B74812';
const SNIPPET_ID = '0';

// In-memory / Window cache
export function getCloudOverrides() {
  if (typeof window !== 'undefined' && window.__PRINTORA_LIVE_OVERRIDES__) {
    return window.__PRINTORA_LIVE_OVERRIDES__;
  }
  return {};
}

// Client-side image compression for gallery / file manager uploads
// Resizes high-res phone camera photos (which can be 5-10MB) to optimized ~800px Web-ready JPEG (~40KB)
export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      return reject(new Error('Invalid image file'));
    }

    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Fetch existing snippet overrides from Netlify API
export async function fetchLiveCloudOverrides() {
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
        'User-Agent': 'PrintoraStore/1.0'
      }
    });

    if (res.ok) {
      const snippets = await res.json();
      const snip = snippets.find(s => s.title === 'printora_live_products');
      if (snip && snip.general) {
        // Extract JSON from <script>window.__PRINTORA_LIVE_OVERRIDES__ = (...);</script>
        const match = snip.general.match(/window\.__PRINTORA_LIVE_OVERRIDES__\s*=\s*({[\s\S]*?});/);
        if (match && match[1]) {
          const parsed = JSON.parse(match[1]);
          if (typeof window !== 'undefined') {
            window.__PRINTORA_LIVE_OVERRIDES__ = parsed;
          }
          return parsed;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote Netlify snippet:', err.message);
  }
  return getCloudOverrides();
}

// Publish updated overrides to Netlify snippet so ALL devices see them
export async function pushOverridesToCloud(overridesMap) {
  if (typeof window !== 'undefined') {
    window.__PRINTORA_LIVE_OVERRIDES__ = overridesMap;
  }

  // Also sync to local dev server if running on localhost:3000
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides: overridesMap })
      });
    } catch (e) {
      // Local server API might not be running or optional
    }
  }

  const scriptContent = `<script>window.__PRINTORA_LIVE_OVERRIDES__ = ${JSON.stringify(overridesMap)};</script>`;

  const payload = {
    title: 'printora_live_products',
    general: scriptContent,
    general_position: 'head'
  };

  try {
    // Check if snippet exists first
    const listRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
        'User-Agent': 'PrintoraStore/1.0'
      }
    });

    if (listRes.ok) {
      const snippets = await listRes.json();
      const existing = snippets.find(s => s.title === 'printora_live_products');

      if (existing) {
        // Update existing snippet
        const putRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets/${existing.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'PrintoraStore/1.0'
          },
          body: JSON.stringify(payload)
        });
        return putRes.ok;
      } else {
        // Create new snippet
        const postRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
            'Content-Type': 'application/json',
            'User-Agent': 'PrintoraStore/1.0'
          },
          body: JSON.stringify(payload)
        });
        return postRes.ok;
      }
    }
  } catch (err) {
    console.error('Failed to sync overrides to Netlify Cloud:', err);
    return false;
  }
  return false;
}
