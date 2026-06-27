exports.handler = fonction asynchrone() {
  const CLOUD = 'drwafd40e';
  const API_KEY = '844983247748924';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET;

  si (!API_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Clé secrète de l'API manquante' }) };
  }

  const auth = Buffer.from(API_KEY + ':' + API_SECRET).toString('base64');

  fonction asynchrone fetchResources(type) {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD}/resources/${type}?max_results=500`,
      { headers: { Authorization: 'Basic ' + auth } }
    );
    const data = await res.json();
    retourner (data.resources || []).map(r => ({
      public_id: r.public_id,
      type : type === 'image' ? 'image' : 'vidéo',
      créé_à : r.créé_à,
      contexte : r.contexte || {}
    }));
  }

  essayer {
    const [images, vidéos] = await Promise.all([
      récupérerRessources('image'),
      récupérerRessources('vidéo')
    ]);
    const all = [...images, ...videos].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    retour {
      code d'état : 200,
      en-têtes : { 'Content-Type' : 'application/json', 'Access-Control-Allow-Origin' : '*' },
      corps : JSON.stringify(all)
    };
  } attraper(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
