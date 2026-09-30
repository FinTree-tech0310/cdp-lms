export interface FounderPitchVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  realCompanyName: string;
  outcome: string;
}

export const FOUNDER_PITCH_VIDEOS: readonly FounderPitchVideo[] = [
  {
    id: "pitch-1",
    videoUrl: "/pitch-videos/pitch-01.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-01.jpg",
    realCompanyName: "Flipkart",
    outcome:
      "The idea became Flipkart, a major Indian e-commerce marketplace. In 2018, Walmart completed an approximately $16 billion investment for about 77% of the company.",
  },
  {
    id: "pitch-2",
    videoUrl: "/pitch-videos/pitch-02.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-02.jpg",
    realCompanyName: "Koo",
    outcome:
      "The idea became Koo, an Indian social media platform. Its founders announced in July 2024 that the service would shut down after partnership and acquisition discussions did not produce a viable path forward.",
  },
  {
    id: "pitch-3",
    videoUrl: "/pitch-videos/pitch-03.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-03.jpg",
    realCompanyName: "LocalOye",
    outcome:
      "The idea became LocalOye, a home-services marketplace. In 2016, its founder described a restructuring and a shift toward automation, monetization, and business partnerships rather than direct customer acquisition.",
  },
  {
    id: "pitch-4",
    videoUrl: "/pitch-videos/pitch-04.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-04.jpg",
    realCompanyName: "PepperTap",
    outcome:
      "The idea became PepperTap. In 2016, the team closed its consumer grocery-delivery business and shifted toward e-commerce logistics after the delivery model proved costly to sustain.",
  },
  {
    id: "pitch-5",
    videoUrl: "/pitch-videos/pitch-05.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-05.jpg",
    realCompanyName: "GoZoomo",
    outcome:
      "The idea became GoZoomo, a peer-to-peer used-car marketplace. In 2016, the founders shut down the business after its unit economics proved unsustainable and decided to return the remaining capital to investors.",
  },
  {
    id: "pitch-6",
    videoUrl: "/pitch-videos/pitch-06.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-06.jpg",
    realCompanyName: "Nykaa",
    outcome:
      "The idea became Nykaa, a beauty and personal-care retailer. Its parent company, FSN E-Commerce Ventures, completed an IPO and listed on India's NSE and BSE in November 2021.",
  },
  {
    id: "pitch-7",
    videoUrl: "/pitch-videos/pitch-07.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-07.jpg",
    realCompanyName: "Zerodha",
    outcome:
      "The idea became Zerodha, a technology-led brokerage. The company grew without external funding and reported revenue of Rs. 8,320 crore and profit of Rs. 4,700 crore for the financial year 2023-24.",
  },
  {
    id: "pitch-8",
    videoUrl: "/pitch-videos/pitch-08.mp4",
    thumbnailUrl: "/pitch-videos/thumbnails/pitch-08.jpg",
    realCompanyName: "Stayzilla",
    outcome:
      "The idea became Stayzilla, an accommodation and homestay marketplace. In February 2017, it suspended new bookings and halted operations in their existing form while its founders proposed a different business model. The founder cited the cost of building both supply and demand and heavy discounting as challenges.",
  },
];
