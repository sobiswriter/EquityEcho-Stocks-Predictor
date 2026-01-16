
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GroundingSource, ChartDataPoint } from "../types";

const API_KEY = process.env.API_KEY || "";

/**
 * Adds realistic market "noise" to a price path using a simple stochastic drift.
 */
const injectMarketNoise = (price: number, volatility: number = 0.015) => {
  const change = (Math.random() - 0.5) * 2 * volatility;
  return price * (1 + change);
};

export const analyzeStock = async (
  symbol: string,
  documentBase64?: string,
  documentMimeType?: string
): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are the EquityEcho Intelligence Tribunal. 
    
    MANDATORY TOOL USAGE:
    You MUST use the 'googleSearch' tool to find the LATEST market data, news, and financial reports for ${symbol}.
    You are REQUIRED to find and cite at least 3-5 distinct, high-quality sources (news articles, official filings, or analyst reports).
    
    METRIC SCALING RULES:
    All confidence percentages (buyConfidence, sellConfidence, dataRobustness, etc.) MUST be returned as integers between 0 and 100. 
    Do NOT return decimals like 0.85. Return 85.
    
    TRIBUNAL ROLES:
    1. MARK (Chief Quantitative Strategist): Hard metrics (P/E, RSI, Debt).
    2. ANNA (Market Intelligence Analyst): Recent news, sentiment, global catalysts.
    3. BOSE (Tribunal Presiding Judge): Weighs both to reach a final Decree.
    
    BOSE'S CLOSING:
    Bose MUST conclude his rationale with: "FINAL DECREE: [BUY/SELL/HOLD]. RISK PROFILE: [LOW/MEDIUM/HIGH/EXTREME]."
    The RISK PROFILE in text MUST match the 'riskFactor' field in the JSON.
    
    Return the response in a structured JSON format.
  `;

  const prompt = `
    Conduct an exhaustive intelligence scour for ${symbol}. 
    1. Use googleSearch to find current news headlines and price targets.
    2. Analyze technicals and sentiment.
    3. Provide a 7-day daily forecast and 4-week weekly forecast.
    ${documentBase64 ? "Incorporate data from the attached document." : "Focus on real-time web intelligence."}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      tools: [{ googleSearch: {} }],
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          symbol: { type: Type.STRING },
          companyName: { type: Type.STRING },
          currentPrice: { type: Type.NUMBER },
          riskFactor: { type: Type.STRING, description: "LOW, MEDIUM, HIGH, or EXTREME" },
          summaryVerdict: { type: Type.STRING },
          confidenceMetrics: {
            type: Type.OBJECT,
            properties: {
              dataRobustness: { type: Type.NUMBER, description: "Integer 0-100" },
              sentimentSignal: { type: Type.NUMBER, description: "Integer 0-100" },
              forecastReliability: { type: Type.NUMBER, description: "Integer 0-100" },
              buyConfidence: { type: Type.NUMBER, description: "Integer 0-100" },
              holdConfidence: { type: Type.NUMBER, description: "Integer 0-100" },
              sellConfidence: { type: Type.NUMBER, description: "Integer 0-100" }
            }
          },
          predictedPriceData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { date: { type: Type.STRING }, price: { type: Type.NUMBER } }
            }
          },
          weeklyPredictedPriceData: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { date: { type: Type.STRING }, price: { type: Type.NUMBER } }
            }
          },
          quantAnalyst: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, title: { type: Type.STRING }, recommendation: { type: Type.STRING }, rationale: { type: Type.STRING }, keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          newsAnalyst: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, title: { type: Type.STRING }, recommendation: { type: Type.STRING }, rationale: { type: Type.STRING }, keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } } } },
          judgeAnalyst: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, title: { type: Type.STRING }, recommendation: { type: Type.STRING }, rationale: { type: Type.STRING }, keyMetrics: { type: Type.ARRAY, items: { type: Type.STRING } } } }
        },
        required: ["symbol", "companyName", "currentPrice", "riskFactor", "summaryVerdict", "confidenceMetrics", "quantAnalyst", "newsAnalyst", "judgeAnalyst", "predictedPriceData", "weeklyPredictedPriceData"]
      },
    },
  });

  const analysis: AnalysisResult = JSON.parse(response.text);
  const sources: GroundingSource[] = [];
  
  // Advanced grounding extraction
  const metadata = response.candidates?.[0]?.groundingMetadata;
  if (metadata?.groundingChunks) {
    metadata.groundingChunks.forEach((chunk: any) => {
      if (chunk.web) {
        sources.push({ title: chunk.web.title || "Market Intelligence Source", uri: chunk.web.uri });
      }
    });
  }

  // Fallback if no specific grounding chunks were returned but model cited things
  if (sources.length === 0) {
    // Attempt to extract URLs from the text if metadata is missing (unlikely with gemini-3 but good safety)
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const foundUrls = response.text.match(urlRegex);
    if (foundUrls) {
      foundUrls.forEach(url => sources.push({ title: "Reference Link", uri: url.replace(/[).,;]$/, '') }));
    }
  }

  return {
    ...analysis,
    sources: Array.from(new Map(sources.map(item => [item.uri, item])).values())
  };
};

export const processPredictiveData = (
  apiData: { date: string, price: number }[],
  volatility: number = 0.012
): ChartDataPoint[] => {
  if (!apiData) return [];
  return apiData.map((d) => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: Number(injectMarketNoise(d.price, volatility).toFixed(2)),
    volume: Math.floor(Math.random() * 500000) + 100000,
    isPrediction: true
  }));
};
