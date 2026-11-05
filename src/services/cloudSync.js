// PRINTORA Global Cloud Synchronization Service
// Ensures that ALL orders, product images/prices, and coupons
// are synchronized in real-time across ALL devices (mobile, laptop, tablet).
// Uses Netlify's high-speed edge snippet injection for instantaneous zero-latency updates.

const NETLIFY_SITE_ID = '1e7ae1ee-956c-4b70-8782-e80976f65b21';
const NETLIFY_AUTH_TOKEN = 'nfp_NzZ73sUXoGVAnidHGS5TeWw4ctP3M7B74812';
const SNIPPET_TITLE = 'printora_live_cloud_store';

// In-memory cache
let globalMemoryState = {
  products: {},
  orders: [],
  coupons: null,
  reviews: []
};

// Check if pre-injected by Netlify into window
export function getGlobalCloudState() {
  if (typeof window !== 'undefined') {
    if (window.__PRINTORA_GLOBAL_CLOUD__) {
      return window.__PRINTORA_GLOBAL_CLOUD__;
    }
    // Backward compatibility with previous product overrides
    if (window.__PRINTORA_LIVE_OVERRIDES__) {
      return { products: window.__PRINTORA_LIVE_OVERRIDES__, orders: [], coupons: null, reviews: [] };
    }
  }
  return globalMemoryState;
}

export function getCloudOverrides() {
  const state = getGlobalCloudState();
  return state.products || {};
}

// Client-side image compression for gallery / file manager uploads
// Resizes high-res phone camera photos (which can be 5-10MB) to optimized ~800px Web-ready JPEG (~30KB-50KB)
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

// Fetch existing live global store from Netlify Edge Snippet
export async function fetchLiveGlobalCloud() {
  try {
    const res = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
        'User-Agent': 'PrintoraStore/1.0'
      }
    });

    if (res.ok) {
      const snippets = await res.json();
      const snip = snippets.find(s => s.title === SNIPPET_TITLE || s.title === 'printora_live_products');
      if (snip && snip.general) {
        // Extract JSON from <script>window.__PRINTORA_GLOBAL_CLOUD__ = (...);</script>
        const cloudMatch = snip.general.match(/window\.__PRINTORA_GLOBAL_CLOUD__\s*=\s*({[\s\S]*?});/);
        if (cloudMatch && cloudMatch[1]) {
          const parsed = JSON.parse(cloudMatch[1]);
          if (typeof window !== 'undefined') {
            window.__PRINTORA_GLOBAL_CLOUD__ = parsed;
          }
          globalMemoryState = parsed;
          return parsed;
        }

        // Fallback for older product snippet format
        const prodMatch = snip.general.match(/window\.__PRINTORA_LIVE_OVERRIDES__\s*=\s*({[\s\S]*?});/);
        if (prodMatch && prodMatch[1]) {
          const parsedProds = JSON.parse(prodMatch[1]);
          const state = { products: parsedProds, orders: [], coupons: null, reviews: [] };
          if (typeof window !== 'undefined') {
            window.__PRINTORA_GLOBAL_CLOUD__ = state;
          }
          globalMemoryState = state;
          return state;
        }
      }
    }
  } catch (err) {
    console.warn('Could not fetch remote Netlify snippet:', err.message);
  }
  return getGlobalCloudState();
}

export async function fetchLiveCloudOverrides() {
  const state = await fetchLiveGlobalCloud();
  return state.products || {};
}

// Debounce helper to prevent rapid consecutive writes
let pushTimeout = null;

// Publish updated global state (Orders, Coupons, Products, Reviews) to Netlify snippet so ALL devices see them
export async function pushGlobalCloudState(partialState = {}) {
  const currentState = getGlobalCloudState();
  const updatedState = {
    ...currentState,
    ...partialState,
    updatedAt: new Date().toISOString()
  };

  if (typeof window !== 'undefined') {
    window.__PRINTORA_GLOBAL_CLOUD__ = updatedState;
    if (updatedState.products) {
      window.__PRINTORA_LIVE_OVERRIDES__ = updatedState.products;
    }
  }
  globalMemoryState = updatedState;

  // Sync to local server if running
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ overrides: updatedState.products, globalState: updatedState })
      }).catch(() => {});
    } catch (e) {}
  }

  const scriptContent = `<script>window.__PRINTORA_GLOBAL_CLOUD__ = ${JSON.stringify(updatedState)}; window.__PRINTORA_LIVE_OVERRIDES__ = window.__PRINTORA_GLOBAL_CLOUD__.products || {};</script>`;

  const payload = {
    title: SNIPPET_TITLE,
    general: scriptContent,
    general_position: 'head'
  };

  try {
    const listRes = await fetch(`https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/snippets`, {
      headers: {
        'Authorization': `Bearer ${NETLIFY_AUTH_TOKEN}`,
        'User-Agent': 'PrintoraStore/1.0'
      }
    });

    if (listRes.ok) {
      const snippets = await listRes.json();
      const existing = snippets.find(s => s.title === SNIPPET_TITLE || s.title === 'printora_live_products');

      if (existing) {
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
    console.error('Failed to sync global state to Netlify Cloud:', err);
    return false;
  }
  return false;
}

export async function pushOverridesToCloud(overridesMap) {
  return pushGlobalCloudState({ products: overridesMap });
}
