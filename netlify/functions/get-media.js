exports.handler = async function() {
  var CLOUD = 'drwafd40e';
  var API_KEY = '844983247748924';
  var API_SECRET = process.env.CLOUDINARY_API_SECRET;

  if (!API_SECRET) {
    return { statusCode: 500, body: JSON.stringify({ error: 'missing secret' }) };
  }

  var auth = Buffer.from(API_KEY + ':' + API_SECRET).toString('base64');

  function fetchRes(type) {
    return fetch(
      'https://api.cloudinary.com/v1_1/' + CLOUD + '/resources/' + type + '?max_results=500',
      { headers: { Authorization: 'Basic ' + auth } }
    ).then(function(r) { return r.json(); }).then(function(data) {
      return (data.resources || []).map(function(r) {
        return { public_id: r.public_id, kind: type === 'image' ? 'image' : 'video', created_at: r.created_at, context: r.context || {} };
      });
    });
  }

  return Promise.all([fetchRes('image'), fetchRes('video')]).then(function(results) {
    var all = results[0].concat(results[1]).sort(function(a, b) { return new Date(b.created_at) - new Date(a.created_at); });
    return { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }, body: JSON.stringify(all) };
  }).catch(function(e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  });
};
