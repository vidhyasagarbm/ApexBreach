import http from 'http';

const req = http.request(
  'http://localhost:3000/api/ai/generate',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  },
  (res) => {
    console.log('STATUS:', res.statusCode);
    console.log('HEADERS:', res.headers);
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => { console.log('BODY:', data); });
  }
);
req.on('error', (e) => { console.error('Error:', e); });
req.write(JSON.stringify({ type: 'unknown_type_to_trigger_400', payload: {} }));
req.end();
