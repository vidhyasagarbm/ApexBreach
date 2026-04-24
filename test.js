async function test() {
  const res = await fetch("http://localhost:3000/api/ai/generate", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "auditUrl", payload: { url: "test.com" } })
  });
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("HEADERS:", Object.fromEntries(res.headers));
  console.log("BODY:", text.substring(0, 100));
}
test();
