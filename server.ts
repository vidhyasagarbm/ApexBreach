import dotenv from "dotenv";
dotenv.config({ override: true });

import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import tls from "tls";
import Parser from "rss-parser";
import { GoogleGenAI } from "@google/genai";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;
  const parser = new Parser();

  app.use(express.json());

  // Helper to lazily initialize the AI client to ensure env vars are loaded.
  const getAIClient = () => {
    const key = process.env.GEMINI_API_KEY;
    console.log("DEBUG: GEMINI_API_KEY Type: ", typeof key, "Length:", key ? key.length : 0);
    
    if (!key || key === "" || key === "MY_GEMINI_API_KEY") {
      throw new Error(`GEMINI_API_KEY is not configured or uses default string. Current value: ${key}`);
    }
    return new GoogleGenAI({ apiKey: key });
  };

  // --- API ROUTES ---

  /**
   * 1. CISA KEV Intelligence
   */
  app.get("/api/cisa-kev", async (req, res) => {
    try {
      const response = await fetch("https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json");
      if (!response.ok) throw new Error("CISA feed unreachable");
      const data = await response.json();
      const recent = data.vulnerabilities.slice(0, 50);
      res.json({
        total: data.count,
        vulnerabilities: recent,
        dateReleased: data.dateReleased
      });
    } catch (error) {
      console.error("CISA Fetch Error:", error);
      res.status(500).json({ error: "Failed to fetch CISA KEV data" });
    }
  });

  /**
   * 2. Active Target Auditor + SSL Audit
   */
  app.post("/api/audit", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Target URL required" });

    try {
      const cleanUrl = url.replace(/^(https?:\/\/)/, "").split("/")[0];
      const targetUrl = url.startsWith("http") ? url : `https://${url}`;
      
      const startTime = Date.now();
      const response = await fetch(targetUrl, { 
        method: 'HEAD',
        redirect: 'follow',
        headers: { 'User-Agent': 'ApexBreach-Auditor/1.0' }
      });
      const duration = Date.now() - startTime;

      const headers = Object.fromEntries(response.headers.entries());
      const securityHeaders = [
        "content-security-policy",
        "strict-transport-security",
        "x-frame-options",
        "x-content-type-options",
        "x-xss-protection",
        "referrer-policy",
        "permissions-policy"
      ];

      const audit = securityHeaders.map(h => ({
        header: h,
        present: !!headers[h],
        value: headers[h] || null
      }));

      // SSL Audit (Async fetch cert details)
      let sslInfo = null;
      try {
        sslInfo = await new Promise((resolve) => {
          const socket = tls.connect(443, cleanUrl, { servername: cleanUrl }, () => {
            const cert = socket.getPeerCertificate();
            socket.end();
            resolve({
              issuer: cert.issuer?.O || "Unknown",
              validFrom: cert.valid_from,
              validTo: cert.valid_to,
              fingerprint: cert.fingerprint,
              subject: cert.subject?.CN || cleanUrl,
              isSecure: !socket.authorized ? false : true
            });
          });
          socket.on("error", () => resolve(null));
          socket.setTimeout(3000, () => {
            socket.destroy();
            resolve(null);
          });
        });
      } catch (e) {
        sslInfo = null;
      }

      res.json({
        url: response.url,
        status: response.status,
        duration: `${duration}ms`,
        server: headers["server"] || "Undisclosed",
        audit,
        findings: audit.filter(a => !a.present).length,
        sslInfo
      });
    } catch (error) {
      console.error("Audit Error:", error);
      res.status(500).json({ error: "Failed to audit target. Ensure URL is reachable." });
    }
  });

  /**
   * 3. IP Geo-Intelligence & WHOIS
   */
  app.get("/api/geo/:target?", async (req, res) => {
    try {
      const { target } = req.params;
      const apiPath = (!target || target === 'self') ? "" : target;
      const response = await fetch(`https://freeipapi.com/api/json/${apiPath}`);
      if (!response.ok) throw new Error("Geo service unreachable");
      const data = await response.json();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch geo intelligence" });
    }
  });

  /**
   * 4. Live Security News
   */
  app.get("/api/news", async (req, res) => {
    try {
      const feed = await parser.parseURL("https://www.bleepingcomputer.com/feed/");
      res.json(feed.items.slice(0, 10).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet
      })));
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch security news" });
    }
  });

  /**
   * 5. Breach Intelligence (Simulation/Search)
   */
  app.get("/api/breach/:domain", async (req, res) => {
     const { domain } = req.params;
     const riskLevel = domain.includes("gov") ? "critical" : (domain.includes(".") ? "medium" : "low");
     const simulatedBreaches = [
       { name: "Public Pastries Leak", date: "2024-01-12", count: "1.2M", severity: "High" },
       { name: "Global Credential Reset", date: "2023-11-05", count: "450k", severity: "Medium" }
     ];
     
     res.json({
       domain,
       riskLevel,
       breachCount: simulatedBreaches.length,
       breaches: simulatedBreaches
     });
  });

  /**
   * 6. Shodan API Integration
   */
  app.get("/api/shodan/:ip", async (req, res) => {
    const { ip } = req.params;
    const apiKey = process.env.SHODAN_API_KEY;
    
    if (!apiKey) {
      // Demo/simulation fallback
      return res.json({
        simulation: true,
        ip_str: ip,
        ports: [80, 443, 22, 3306],
        vulns: ["CVE-2021-44228", "CVE-2019-0708"],
        os: "Ubuntu 22.04",
        isp: "AWS / Simulated Cloud",
        hostnames: [`server-${ip.replace(/\./g, '-')}.eu-west-1.compute.amazonaws.com`]
      });
    }

    try {
      const response = await fetch(`https://api.shodan.io/shodan/host/${ip}?key=${apiKey}`);
      if (!response.ok) {
        if (response.status === 404) return res.json({ ip_str: ip, ports: [], vulns: [], os: "Unknown" });
        throw new Error("Shodan API error");
      }
      const data = await response.json();
      res.json({
        simulation: false,
        ip_str: data.ip_str,
        ports: data.ports || [],
        vulns: data.vulns || [],
        os: data.os || "Unknown",
        isp: data.isp,
        hostnames: data.hostnames || []
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch Shodan data" });
    }
  });

  /**
   * 7. VirusTotal API Integration with Caching to protect 4 req/min limit
   */
  const vtCache = new Map<string, { timestamp: number, data: any }>();

  app.get("/api/virustotal/:target", async (req, res) => {
    const { target } = req.params;
    const apiKey = process.env.VT_API_KEY;
    
    const isIp = /^[0-9.]+$/.test(target);
    const endpoint = isIp ? `ip_addresses/${target}` : `domains/${target}`;

    if (!apiKey) {
      // Demo/simulation fallback
      return res.json({
        simulation: true,
        reputation: -15,
        malicious: 4,
        suspicious: 2,
        undetected: 78,
        harmless: 5,
        last_analysis_date: Math.floor(Date.now() / 1000)
      });
    }

    // Check aggressive caching (Cache for 24 hours to save API hits)
    const cached = vtCache.get(target);
    if (cached && Date.now() - cached.timestamp < 1000 * 60 * 60 * 24) {
      return res.json({ ...cached.data, cached: true });
    }

    try {
      const response = await fetch(`https://www.virustotal.com/api/v3/${endpoint}`, {
        headers: { 'x-apikey': apiKey }
      });
      
      if (response.status === 429) {
         // Rate limit hit (4 req/min limit)
         return res.status(429).json({ error: "VirusTotal API rate limit exceeded (4 lookups / min)." });
      }
      
      if (!response.ok) throw new Error("VirusTotal API error: " + response.statusText);
      
      const data = await response.json();
      const stats = data.data.attributes.last_analysis_stats;
      
      const resultData = {
        simulation: false,
        reputation: data.data.attributes.reputation || 0,
        malicious: stats.malicious || 0,
        suspicious: stats.suspicious || 0,
        undetected: stats.undetected || 0,
        harmless: stats.harmless || 0,
        last_analysis_date: data.data.attributes.last_analysis_date
      };

      // Save to cache
      vtCache.set(target, { timestamp: Date.now(), data: resultData });

      res.json(resultData);
    } catch (error) {
      console.error("VT Error:", error);
      res.status(500).json({ error: "Failed to fetch VirusTotal data" });
    }
  });

  // --- AI SECURE ROUTES ---
  app.post("/api/ai/generate", async (req, res) => {
    const { type, payload } = req.body;
    let contents = "";
    let model = "gemini-3-flash-preview";

    try {
      switch (type) {
        case "explainTTP":
          contents = `You are a world-class ethical hacker and offensive security expert. 
          Provide a detailed technical guide for the following hacking technique: "${payload.ttpName}".
          Context: ${payload.context || ""}
          Provide:
          1. A deep technical breakdown of how the technique works from an offensive perspective.
          2. Specific security tools used (e.g., Nmap, Metasploit, Burp Suite).
          3. Step-by-step command-line procedures and syntax.
          4. Practical examples for a penetration testing engagement.
          5. **Tool Chaining**: How to link this technique with other tools to advance the attack.
          Format the output in clean Markdown. Use code blocks for commands or scripts.`;
          break;
        case "analyzeScenario":
          contents = `You are a Senior Penetration Tester. Analyze the following hacking scenario and provide a detailed attack methodology using tactical security tools.
          Scenario: ${payload.scenario}
          Think step-by-step:
          1. Reconnaissance & Surface Analysis
          2. Initial Access Vectors
          3. Persistence & Lateral Movement
          4. Objective Achievement
          Format the output in clean Markdown.`;
          break;
        case "searchCVE":
          contents = `Search for real-world CVEs (Common Vulnerabilities and Exposures) related to: "${payload.query}". 
          Provide a summary of the most critical ones, their impact, and potential exploit vectors.
          Format as a tactical intelligence briefing in Markdown.`;
          break;
        case "auditCode":
          model = "gemini-3.1-pro-preview";
          contents = `You are an expert Security Auditor and Senior Software Engineer. 
          Perform a Static Application Security Testing (SAST) scan on the following code snippet.
          Code:
          \`\`\`
          ${payload.code}
          \`\`\`
          Identify vulnerabilities (secrets, SQLi, XSS, Logic flaws, etc.).
          Return the findings ONLY as a JSON array of objects with this structure:
          [{"id":"id","type":"CRITICAL|HIGH|MEDIUM|LOW|INFO","title":"...","description":"...","location":"...","remediation":"..."}]
          If no vulnerabilities are found, return an empty array [].
          Do not include any other text, markdown blocks, or explanations outside the JSON array.`;
          break;
        case "auditUrl":
          model = "gemini-3.1-pro-preview";
          contents = `You are an expert Security Researcher and Penetration Tester. 
          Perform a simulated Dynamic Application Security Testing (DAST) scan on the following URL endpoint.
          URL: ${payload.url}
          Predict potential vulnerabilities based on general web security best practices (Headers, XSS, Secrets).
          Return the findings ONLY as a JSON array of objects with this structure:
          [{"id":"..","type":"CRITICAL|HIGH|MEDIUM|LOW|INFO","title":"..","description":"..","remediation":".."}]
          Do not include any other text outside the JSON array.`;
          break;
        case "generateAPTPlaybook":
          contents = `You are a Threat Intelligence Analyst. Generate a comprehensive hacking playbook for the APT actor: "${payload.actor}".
          Focus on their known TTPs, preferred attack vectors, and infrastructure choices.
          Format the output in clean Markdown suitable for a security briefing.`;
          break;
        case "obfuscatePayload":
          contents = `You are an Evasion Specialist. Obfuscate the following payload to bypass traditional signature-based detection.
          Payload: ${payload.payload}
          Objective: ${payload.objective}
          Provide:
          1. An obfuscated version of the payload.
          2. Explanation of the evasion techniques applied.
          3. Guidance on how to deploy this without triggering heuristics.
          Format the output in clean Markdown.`;
          break;
        case "analyzeReconSurface":
          contents = `You are an Attack Surface Management expert. Analyze the following reconnaissance data and identify high-value targets and potential entry points.
          Recon Data: ${payload.reconData}
          Provide High-Value Targets, Entry Point Analysis, and Targeted Recommendations.
          Format the output in clean Markdown.`;
          break;
        case "visualizeAttackPath":
          contents = `You are an Exploit Chain Architect. Design a multi-stage attack path based on the following security findings.
          Findings:
          ${payload.findings}
          Structure: Phase 1: Initial Foothold, Phase 2: Privilege Escalation, Phase 3: Lateral Movement, Phase 4: Objective Achievement.
          Format as a visual-friendly Markdown list with technical tool references.`;
          break;
        default:
          return res.status(400).json({ error: "Unknown AI task type" });
      }

      const aiClient = getAIClient();
      const aiResponse = await aiClient.models.generateContent({
        model,
        contents
      });

      res.json({ result: aiResponse.text });
    } catch (error: any) {
      console.error("AI Generation Error:", error);
      
      let statusCode = 500;
      if (error && typeof error === 'object') {
        if (typeof error.status === 'number') statusCode = error.status;
        else if (typeof error.code === 'number') statusCode = error.code;
        else if (error.response && typeof error.response.status === 'number') statusCode = error.response.status;
        // Attempt to parse string codes if present
        else if (typeof error.status === 'string' && !isNaN(Number(error.status))) statusCode = Number(error.status);
      }
      
      if (statusCode < 100 || statusCode > 599 || isNaN(statusCode)) {
        statusCode = 500;
      }
      
      let errorMessage = error?.message || String(error) || "Internal AI Error";
      if (errorMessage.includes("Unexpected token '<'") && errorMessage.includes("is not valid JSON")) {
         errorMessage = "Google API Overloaded: Upstream 503 HTML response caused SDK parsing fault.";
         statusCode = 503;
      }
      res.status(statusCode).json({ error: errorMessage });
    }
  });

  // --- VITE MIDDLEWARE ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SYSTEM] Server operational on http://0.0.0.0:${PORT}`);
  });
}

startServer();
