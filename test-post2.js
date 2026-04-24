import http from 'http';

// We'll test with a known good prompt that we can cause to fail, or just mock it.
// Actually, let's just trigger an explainTTP with something that might cause a 503 if we hit limits.
// But we just want to see if the express error boundary fails.
// I'll make the `getAIClient` throw specifically to see.

const req = http.request(
  'http://localhost:3000/api/ai/generate',
  { method: 'POST', headers: { 'Content-Type': 'application/json' } },
  (res) => {
    console.log('STATUS:', res.statusCode);
    let data = '';
    res.on('data', (c) => data += c);
    res.on('end', () => console.log('BODY:', data));
  }
);
req.write(JSON.stringify({ type: 'explainTTP', payload: { ttpName: 'test test test' } }));
req.end();
