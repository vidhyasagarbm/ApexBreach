import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function explainTTP(ttpName: string, context: string = "") {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a world-class ethical hacker and offensive security expert. 
  Provide a detailed technical guide for the following hacking technique: "${ttpName}".
  
  Context: ${context}
  
  Provide:
  1. A deep technical breakdown of how the technique works from an offensive perspective.
  2. Specific security tools used (e.g., Nmap, Metasploit, Burp Suite).
  3. Step-by-step command-line procedures and syntax.
  4. Practical examples for a penetration testing engagement.
  5. **Tool Chaining**: How to link this technique with other tools to advance the attack.
  
  Format the output in clean Markdown. Use code blocks for commands or scripts.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error explaining TTP:", error);
    return "Failed to generate explanation. Please check your API key or connection.";
  }
}

export async function analyzeScenario(scenario: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a Senior Penetration Tester. Analyze the following hacking scenario and provide a detailed attack methodology using tactical security tools.
  
  Scenario: ${scenario}
  
  Structure your response by:
  1. Attack Strategy: High-level approach.
  2. Tool Selection: Which security tools to use and why.
  3. Step-by-Step Execution: Detailed commands and workflow.
  4. Post-Exploitation: What to do after gaining access.
  5. Ethical Boundaries: Reminders on legal and safe testing.
  
  Format the output in clean Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing scenario:", error);
    return "Failed to analyze scenario. Please check your API key or connection.";
  }
}

export async function searchCVE(query: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `Search for real-world CVEs (Common Vulnerabilities and Exposures) related to: "${query}". 
  Provide a list of 3-5 relevant CVEs with their IDs, descriptions, severity (CVSS score), and potential impact. 
  Format the output in clean Markdown with a professional cybersecurity intelligence tone. 
  If the query is generic, provide the latest trending CVEs.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error searching CVE:", error);
    return "Failed to retrieve CVE intelligence. Please check your API key or connection.";
  }
}

export async function auditCode(code: string) {
  const model = "gemini-2.0-flash-exp";
  const prompt = `You are an expert Security Auditor and Senior Software Engineer. 
  Perform a Static Application Security Testing (SAST) scan on the following code snippet.
  
  Code:
  \`\`\`
  ${code}
  \`\`\`
  
  Identify vulnerabilities such as:
  - Hardcoded secrets, API keys, or credentials
  - SQL Injection, XSS, CSRF, Command Injection
  - Insecure cryptographic practices
  - Broken Access Control
  - Insecure dependencies or configurations
  - Logic flaws
  
  Return the findings ONLY as a JSON array of objects with this structure:
  [
    {
      "id": "unique-id",
      "type": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO",
      "title": "Short title of the finding",
      "description": "Detailed explanation of the vulnerability",
      "location": "Line number or code snippet where the issue exists",
      "remediation": "Clear steps to fix the vulnerability"
    }
  ]
  
  If no vulnerabilities are found, return an empty array [].
  Do not include any other text, markdown blocks, or explanations outside the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text;
    // Clean up potential markdown formatting if the model includes it despite instructions
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error auditing code:", error);
    throw error;
  }
}

export async function auditUrl(url: string) {
  const model = "gemini-2.0-flash-exp";
  const prompt = `You are an expert Security Researcher and Penetration Tester. 
  Perform a simulated Dynamic Application Security Testing (DAST) scan on the following URL endpoint.
  
  URL: ${url}
  
  Based on the URL structure, common technologies associated with such paths, and general web security best practices, predict potential vulnerabilities that a DAST scanner might find.
  
  Consider:
  - Missing security headers (HSTS, CSP, X-Frame-Options)
  - Potential XSS or SQLi entry points in query parameters
  - Information disclosure (Server headers, versioning)
  - SSL/TLS configuration issues
  - Authentication/Authorization weaknesses
  
  Return the findings ONLY as a JSON array of objects with this structure:
  [
    {
      "id": "unique-id",
      "type": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO",
      "title": "Short title of the predicted finding",
      "description": "Detailed explanation of why this is a likely vulnerability for this specific URL",
      "remediation": "Clear steps to fix or mitigate the vulnerability"
    }
  ]
  
  Do not include any other text, markdown blocks, or explanations outside the JSON array.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    const text = response.text;
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Error auditing URL:", error);
    throw error;
  }
}

export async function generateAPTPlaybook(actor: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a Threat Intelligence Analyst. Generate a detailed "Offensive Playbook" for the Threat Actor: "${actor}".
  
  Structure the playbook by:
  1. Actor Profile: Origins, motivations, and target sectors.
  2. Signature TTPs: Their most common techniques across the MITRE ATT&CK framework.
  3. Attack Sequence: A step-by-step "Signature Move" flow from initial access to data exfiltration.
  4. Infrastructure Patterns: Common C2 frameworks, domain naming conventions, and hosting providers they use.
  5. Detection Evasion: How they typically bypass security controls.
  
  Format the output in clean Markdown with a tactical, high-intelligence tone.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating APT playbook:", error);
    return "Failed to generate playbook. Please check your API key.";
  }
}

export async function obfuscatePayload(payload: string, technique: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are an Evasion Specialist. Analyze the following payload and apply the "${technique}" obfuscation strategy to bypass EDR/AV detection.
  
  Payload:
  \`\`\`
  ${payload}
  \`\`\`
  
  Provide:
  1. Obfuscated Code: The transformed payload.
  2. Evasion Logic: Explanation of how this specific technique bypasses common detection patterns.
  3. Detection Prediction: A risk assessment of which security vendors (e.g., CrowdStrike, SentinelOne, Microsoft Defender) are most likely to flag this and why.
  
  Format the output in clean Markdown. Use code blocks for the obfuscated payload.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error obfuscating payload:", error);
    return "Failed to obfuscate payload.";
  }
}

export async function analyzeReconSurface(target: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are an OSINT Specialist. Perform an automated attack surface mapping for the target: "${target}".
  
  Analyze and predict:
  1. Subdomain Landscape: Likely subdomains and their potential functions.
  2. Exposed Endpoints: Common API paths or administrative portals that might be public.
  3. Technology Stack: Predicted infrastructure (Cloud providers, CMS, Web servers).
  4. Employee Profiling Patterns: Common naming conventions for emails and potential high-value targets.
  5. Credential Leak Risk: Correlation with known dark web leak patterns for this target type.
  
  Format the output in clean Markdown with a professional OSINT intelligence tone.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing recon surface:", error);
    return "Failed to perform recon analysis.";
  }
}

export async function visualizeAttackPath(findings: string) {
  const model = "gemini-3-flash-preview";
  const prompt = `You are a Red Team Lead. Analyze the following security findings and visualize the "Path of Least Resistance" to reach critical assets.
  
  Findings:
  ${findings}
  
  Provide:
  1. Attack Chain: A step-by-step sequence of how these findings can be chained together (e.g., Finding A -> Finding B -> Domain Admin).
  2. Path Probability: Success rate for each step in the chain.
  3. Critical Assets: Which "Crown Jewels" are most at risk based on this path.
  4. Visual Representation: A text-based Mermaid.js graph code block representing the attack path.
  
  Format the output in clean Markdown.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error visualizing attack path:", error);
    return "Failed to visualize attack path.";
  }
}
