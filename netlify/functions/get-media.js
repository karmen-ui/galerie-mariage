exports.handler = async function() {
  const CLOUD = 'drwafd40e';
  const API_KEY = '844983247748924';
  const API_SECRET = 'YzK0UgCNy7HD7Fb_E3nnrYOMFl4';
  const auth = Buffer.from(API_KEY + ':' + API_SECRET).toString('base64');

  async function fetchResources(type) {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/${type}?prefix=mariage/&max_results=500`,
      { headers: { Authorization: 'Basic ' + auth } }
    );
    const data = await res.json();
    return (data.resources || []).map(r => ({
      public_id: r.public_id,
      kind: type === 'image' ? 'image' : 'video',
      created_at: r.created_at,
      context: r.context || {}
    }));
  }

  try {
    const [images, videos] = await Promise.all([
      fetchResources('image'),
      fetchResources('video')
    ]);
    const all = [...images, ...videos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(all)
    };
  } catch(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
