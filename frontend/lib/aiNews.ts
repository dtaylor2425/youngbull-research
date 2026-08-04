// Young Bull — AI News
// Hardcoded editorial dataset for the Young Bull Research Terminal.
// Update this file manually as new stories become relevant.
// Stance vocabulary: 'Bullish', 'Bearish', 'Mixed', 'Watch', 'Neutral'.

export type AiNewsTicker = {
  ticker: string;
  stance: "Bullish" | "Bearish" | "Mixed" | "Watch" | "Neutral";
  why: string;
};

export type AiNewsItem = {
  id: string;
  rank: number;
  title: string;
  category: string;
  status: "Breaking" | "Active" | "Developing" | "Monitor";
  urgency: "High" | "Medium" | "Low";
  updated: string;
  sourceLabel: string;
  sourceUrl?: string;
  oneLine: string;
  whyItMatters: string[];
  marketImpact: {
    label: string;
    direction: "Bullish" | "Bearish" | "Mixed" | "Neutral";
    reason: string;
  }[];
  tickers: AiNewsTicker[];
  invalidation: string;
  watchNext: string[];
};

const AI_NEWS: AiNewsItem[] = [
  {
    id: "hyperscaler-capex-repricing",
    rank: 1,
    title: "The market is separating AI spending from AI returns",
    category: "Hyperscalers / Capex",
    status: "Active",
    urgency: "High",
    updated: "2026-08-04",
    sourceLabel: "Young Bull Research",
    oneLine:
      "Investors are no longer rewarding AI capital spending by default. The next phase of the trade depends on whether cloud revenue, inference demand and free cash flow can catch up to the scale of spending.",
    whyItMatters: [
      "The AI trade is shifting from a capex announcement cycle to a return-on-invested-capital cycle.",
      "Suppliers with direct revenue conversion may hold up better than companies funding open-ended infrastructure buildouts.",
      "Free-cash-flow pressure could create sharper dispersion between hyperscalers."
    ],
    marketImpact: [
      {
        label: "Mega-cap AI",
        direction: "Mixed",
        reason: "The market is rewarding revenue conversion and punishing spend without visible margin support."
      },
      {
        label: "Semiconductors",
        direction: "Mixed",
        reason: "Demand remains large, but suppliers are increasingly judged against capex durability rather than headline spending."
      },
      {
        label: "Power and cooling",
        direction: "Bullish",
        reason: "Physical infrastructure demand can persist even as investors become more selective about software and platform valuations."
      }
    ],
    tickers: [
      { ticker: "NVDA", stance: "Watch", why: "Still the central compute beneficiary, but increasingly exposed to capex-duration concerns." },
      { ticker: "VRT", stance: "Bullish", why: "Power and cooling remain necessary regardless of which model or cloud platform wins." },
      { ticker: "ETN", stance: "Bullish", why: "Electrical bottlenecks sit below the hyperscaler spending debate." },
      { ticker: "GOOGL", stance: "Mixed", why: "Strong AI assets offset by scrutiny around the cost of sustaining the buildout." }
    ],
    invalidation:
      "Cloud growth and AI monetization accelerate enough to expand free cash flow despite elevated capital spending.",
    watchNext: [
      "Cloud revenue growth versus capex growth",
      "Free-cash-flow margins",
      "Inference pricing",
      "2027 hyperscaler capital-spending guidance"
    ]
  },
  {
    id: "ai-networking-bottleneck",
    rank: 2,
    title: "Networking is becoming a larger share of every AI system",
    category: "Networking / Connectivity",
    status: "Active",
    urgency: "High",
    updated: "2026-08-04",
    sourceLabel: "Young Bull Research",
    oneLine:
      "As clusters scale, the bottleneck moves away from individual chips and toward moving data between accelerators, memory and racks with less latency and power loss.",
    whyItMatters: [
      "The value of the network rises as the number of accelerators in a cluster increases.",
      "Higher speeds create demand for better switches, retimers, active electrical cables and optical components.",
      "Connectivity suppliers can outgrow the broader semiconductor cycle."
    ],
    marketImpact: [
      {
        label: "Switching",
        direction: "Bullish",
        reason: "Scale-out clusters require more high-speed switching and network intelligence."
      },
      {
        label: "Optics",
        direction: "Bullish",
        reason: "Bandwidth growth increases optical content per system."
      },
      {
        label: "Legacy networking",
        direction: "Bearish",
        reason: "Older architectures lose share as AI workloads demand lower latency and higher throughput."
      }
    ],
    tickers: [
      { ticker: "ANET", stance: "Bullish", why: "A direct beneficiary of high-speed Ethernet adoption in AI clusters." },
      { ticker: "CRDO", stance: "Bullish", why: "Leverage to connectivity density and high-speed interconnect." },
      { ticker: "ALAB", stance: "Bullish", why: "Purpose-built connectivity products for increasingly complex AI systems." },
      { ticker: "FN", stance: "Watch", why: "Manufacturing exposure to optical and networking demand." }
    ],
    invalidation:
      "Cluster growth slows materially or hyperscalers reduce networking intensity through architecture changes.",
    watchNext: [
      "800G and 1.6T adoption",
      "Ethernet versus proprietary fabric share",
      "Optical component lead times",
      "Networking revenue growth versus GPU revenue growth"
    ]
  },
  {
    id: "ai-power-constraint",
    rank: 3,
    title: "The AI bottleneck is moving into the power stack",
    category: "Power / Data Centers",
    status: "Active",
    urgency: "High",
    updated: "2026-08-04",
    sourceLabel: "Young Bull Research",
    oneLine:
      "The limiting factor for new AI capacity is increasingly the ability to secure electricity, transformers, switchgear, cooling and grid interconnection rather than simply buying more chips.",
    whyItMatters: [
      "Data-center projects can be delayed by years if power infrastructure is unavailable.",
      "Electrical-equipment backlogs create pricing power for suppliers.",
      "Utilities and generation assets may capture more value from AI demand than the market previously assumed."
    ],
    marketImpact: [
      {
        label: "Electrical equipment",
        direction: "Bullish",
        reason: "Grid equipment and switchgear remain difficult to source quickly."
      },
      {
        label: "Independent power",
        direction: "Bullish",
        reason: "Reliable generation becomes more valuable near data-center clusters."
      },
      {
        label: "Unpowered projects",
        direction: "Bearish",
        reason: "Projects without credible interconnection or generation access face execution risk."
      }
    ],
    tickers: [
      { ticker: "VRT", stance: "Bullish", why: "Direct exposure to data-center power and thermal management." },
      { ticker: "ETN", stance: "Bullish", why: "Electrical distribution equipment sits at the center of the buildout." },
      { ticker: "GEV", stance: "Bullish", why: "Grid equipment and generation exposure align with the new bottleneck." },
      { ticker: "CEG", stance: "Watch", why: "Reliable nuclear generation is strategically valuable for large loads." }
    ],
    invalidation:
      "Power demand forecasts fall sharply or data-center construction is delayed enough to eliminate equipment scarcity.",
    watchNext: [
      "Utility interconnection queues",
      "Transformer and switchgear lead times",
      "Data-center power-purchase agreements",
      "Nuclear and gas generation announcements"
    ]
  },
  {
    id: "memory-hbm-content",
    rank: 4,
    title: "Memory is no longer a side trade in AI",
    category: "Memory / HBM",
    status: "Developing",
    urgency: "Medium",
    updated: "2026-08-04",
    sourceLabel: "Young Bull Research",
    oneLine:
      "High-bandwidth memory content is rising with accelerator complexity, turning memory supply, packaging and yields into a strategic part of the AI system.",
    whyItMatters: [
      "HBM content per accelerator can rise faster than unit growth.",
      "Supply discipline and advanced packaging constraints can support margins.",
      "The market may underprice how much memory value shifts into premium products."
    ],
    marketImpact: [
      {
        label: "HBM suppliers",
        direction: "Bullish",
        reason: "Premium memory demand remains linked to accelerator deployments."
      },
      {
        label: "Commodity memory",
        direction: "Mixed",
        reason: "AI demand helps, but broader cycle conditions still matter."
      },
      {
        label: "Packaging equipment",
        direction: "Bullish",
        reason: "More advanced packaging raises process complexity and equipment intensity."
      }
    ],
    tickers: [
      { ticker: "MU", stance: "Bullish", why: "Direct leverage to HBM mix and memory-cycle improvement." },
      { ticker: "SNDK", stance: "Watch", why: "Storage demand benefits from data growth but remains cyclical." },
      { ticker: "AMAT", stance: "Watch", why: "Higher memory and packaging complexity can lift equipment intensity." },
      { ticker: "LRCX", stance: "Watch", why: "Memory process exposure creates upside if investment broadens." }
    ],
    invalidation:
      "HBM supply expands much faster than demand or accelerator deployments slow materially.",
    watchNext: [
      "HBM pricing",
      "Supplier qualification milestones",
      "Advanced packaging capacity",
      "Memory capex guidance"
    ]
  },
  {
    id: "physical-ai-early-cycle",
    rank: 5,
    title: "Physical AI is leaving the demo stage",
    category: "Robotics / Edge AI",
    status: "Developing",
    urgency: "Medium",
    updated: "2026-08-04",
    sourceLabel: "Young Bull Research",
    oneLine:
      "Robotics and autonomous systems are moving from controlled demonstrations toward real deployments, creating demand for sensors, edge compute, timing and machine vision.",
    whyItMatters: [
      "The physical AI stack is broader than the robot brand itself.",
      "Component suppliers may monetize earlier than consumer-facing robotics platforms.",
      "Industrial deployments offer clearer economics than general-purpose humanoid promises."
    ],
    marketImpact: [
      {
        label: "Sensors",
        direction: "Bullish",
        reason: "Real-world deployment requires reliable perception across changing environments."
      },
      {
        label: "Edge compute",
        direction: "Bullish",
        reason: "Latency-sensitive workloads must run locally."
      },
      {
        label: "Humanoid platforms",
        direction: "Mixed",
        reason: "Large long-term opportunity, but current valuations may discount years of execution."
      }
    ],
    tickers: [
      { ticker: "OUST", stance: "Watch", why: "Digital lidar exposure to robotics and autonomy." },
      { ticker: "AMBA", stance: "Watch", why: "Computer-vision silicon for edge applications." },
      { ticker: "SITM", stance: "Bullish", why: "Timing precision becomes more important in complex autonomous systems." },
      { ticker: "SYM", stance: "Watch", why: "Warehouse automation offers a real commercial deployment path." }
    ],
    invalidation:
      "Deployment timelines slip materially or customers fail to demonstrate attractive labor and productivity economics.",
    watchNext: [
      "Commercial deployment counts",
      "Robot utilization rates",
      "Component cost declines",
      "Customer payback periods"
    ]
  }
];

export default AI_NEWS;
