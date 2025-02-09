export interface Data {
  dates: string[];
  sales: number[];
  mean?: number;
  median?: number;
  min?: number;
  max?: number;
  stdDev?: number;
  salesBins: string[];
  salesFrequencies: number[];
  kdeValues: number[];
}
