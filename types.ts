
export type Recommendation = 'BUY' | 'SELL' | 'HOLD' | 'STRONG BUY' | 'STRONG SELL';

export interface AnalystPerspective {
  name: string;
  title: string;
  recommendation: Recommendation;
  rationale: string;
  keyMetrics: string[];
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}

export interface ChartDataPoint {
  date: string;
  price: number;
  volume: number;
  isPrediction?: boolean;
}

export interface ConfidenceMetrics {
  dataRobustness: number;
  sentimentSignal: number;
  forecastReliability: number;
  buyConfidence: number;
  holdConfidence: number;
  sellConfidence: number;
}

export interface AnalysisResult {
  symbol: string;
  companyName: string;
  currentPrice: number;
  predictedPriceData: { date: string, price: number, confidence: number }[];
  weeklyPredictedPriceData: { date: string, price: number, confidence: number }[];
  quantAnalyst: AnalystPerspective;
  newsAnalyst: AnalystPerspective;
  judgeAnalyst: AnalystPerspective;
  summaryVerdict: string;
  sources?: GroundingSource[];
  riskFactor: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  confidenceMetrics: ConfidenceMetrics;
}
