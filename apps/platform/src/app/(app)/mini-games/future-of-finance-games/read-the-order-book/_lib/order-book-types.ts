export interface OrderBookLevel {
  price: number;
  size: number;
}

export interface OrderBookScenario {
  id: string;
  marketContext: string;
  currentPrice: number;
  sellOrders: OrderBookLevel[];
  buyOrders: OrderBookLevel[];
  questionText: string;
  answerOptions: string[];
  correctInterpretation: string;
  explanation: string;
  depthDescriptionForScreenReaders: string;
}

export interface OrderBookResultSnapshot {
  scenarioId: string;
  marketContext: string;
  currentPrice: number;
  sellOrders: OrderBookLevel[];
  buyOrders: OrderBookLevel[];
  questionText: string;
  displayAnswerOptions: string[];
  selectedAnswer: string;
  correctInterpretation: string;
  matched: boolean;
  explanation: string;
  depthDescriptionForScreenReaders: string;
}
