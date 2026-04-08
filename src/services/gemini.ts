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
