/**
 * Centralized result cache to minimize API calls and mitigate rate limiting.
 */
const responseCache = new Map<string, any>();

/**
 * Standardized error handling for AI API responses.
 * Detects rate limits, quota issues, and general errors to provide domain-specific feedback.
 */
function handleGeminiError(error: any): string {
  console.error("AI Generation Error:", error);
  
  const msg = error?.message || String(error);
  
  // Rate Limit / 429
  if (msg.includes("429") || msg.toLowerCase().includes("rate limit") || msg.includes("RATE_LIMIT")) {
    return "RATE_LIMIT_EXCEEDED: The tactical AI node is cooling down. Please wait 60 seconds before re-engaging. The high volume of defensive scans has temporarily saturated the connection.";
  }
  
  // Quota / Billing
  if (msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("exceeded")) {
    return "QUOTA_EXCEEDED: Your operational AI allowance has reached its threshold. Review tactical limits to resume full-spectrum auditing.";
  }

  // Safety / Blocks
  if (msg.toLowerCase().includes("safety") || msg.toLowerCase().includes("blocked") || msg.toLowerCase().includes("candidate")) {
    return "INTERCEPTED: The AI safety protocols have flagged this request as potentially violating ethical boundaries. Rephrase your objective to focus on defensive and educational security research.";
  }

  // API Key Invalid / Settings Error
  if (msg.includes("API key not valid") || msg.includes("API_KEY_INVALID")) {
    return "SYSTEM_FAULT: Your assigned Gemini API key is invalid or expired. To fix: Open the 'Settings' menu -> 'Secrets' panel in AI Studio, delete any manually typed out keys, and allow it to use the default key. Refresh the page after resolving.";
  }

  // Server Errors & SDK HTML parse faults
  if (msg.includes("500") || msg.toLowerCase().includes("internal error") || msg.toLowerCase().includes("overloaded") || msg.includes("Unexpected token '<'")) {
    return "NODE_FAILURE: The remote Google AI node is currently overloaded and rejecting queries (HTTP 503). This is a temporary upstream capacity issue. Please retry the sequence in a few moments.";
  }

  return `SYSTEM_FAULT: ${msg}`;
}

async function fetchFromBackend(type: string, payload: any) {
  try {
    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, payload }),
    });

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");

    if (!response.ok) {
      if (isJson) {
        const data = await response.json();
        throw new Error(data.error || `HTTP ${response.status} Error`);
      } else {
        const textError = await response.text();
        throw new Error(`HTTP ${response.status} Error: ${textError.substring(0, 100)}...`);
      }
    }

    if (!isJson) {
      const text = await response.text();
      // If we got a 200 OK but it's an HTML page (like Vite's SPA fallback), we should throw
      if (text.trim().toLowerCase().startsWith("<!doctype")) {
         throw new Error("Received HTML SPA fallback instead of API response. The backend server might have restarted.");
      }
      throw new Error(`Expected JSON but received: ${text.substring(0, 100)}...`);
    }

    const data = await response.json();
    return data.result;
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
       throw new Error("Failed to fetch: Network error or the backend development server is currently restarting.");
    }
    throw error;
  }
}

export async function explainTTP(ttpName: string, context: string = "") {
  const cacheKey = `explain:${ttpName}:${context}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("explainTTP", { ttpName, context });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function analyzeScenario(scenario: string) {
  const cacheKey = `scenario:${scenario}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("analyzeScenario", { scenario });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function searchCVE(query: string) {
  const cacheKey = `cve:${query}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("searchCVE", { query });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function auditCode(code: string) {
  const cacheKey = `auditCode:${code}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const text = await fetchFromBackend("auditCode", { code });
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const result = JSON.parse(jsonStr);
    
    responseCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error(handleGeminiError(error));
  }
}

export async function auditUrl(url: string) {
  const cacheKey = `auditUrl:${url}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const text = await fetchFromBackend("auditUrl", { url });
    
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const result = JSON.parse(jsonStr);
    
    responseCache.set(cacheKey, result);
    return result;
  } catch (error) {
    throw new Error(handleGeminiError(error));
  }
}

export async function generateAPTPlaybook(actor: string) {
  const cacheKey = `apt:${actor}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("generateAPTPlaybook", { actor });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function obfuscatePayload(payload: string, objective: string) {
  const cacheKey = `obfuscate:${payload}:${objective}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("obfuscatePayload", { payload, objective });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function analyzeReconSurface(reconData: string) {
  const cacheKey = `recon:${reconData}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("analyzeReconSurface", { reconData });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

export async function visualizeAttackPath(findings: string) {
  const cacheKey = `visualize:${findings}`;
  if (responseCache.has(cacheKey)) return responseCache.get(cacheKey);

  try {
    const result = await fetchFromBackend("visualizeAttackPath", { findings });
    
    if (result && !result.includes("RATE_LIMIT") && !result.includes("SYSTEM_FAULT")) {
      responseCache.set(cacheKey, result);
    }
    return result;
  } catch (error) {
    return handleGeminiError(error);
  }
}

