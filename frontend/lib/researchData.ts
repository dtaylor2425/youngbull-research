export type UniverseStock = {
  ticker: string;
  company: string;
  theme: string;
  thematicFit: number;
  conviction: "Core" | "High" | "Watch";
  note: string;
};

export const portfolioTickers = [
  "NBIS", "MU", "CRDO", "PENG", "OUST", "ANET", "SILC", "WYY", "ARM",
  "OSS", "ASTS", "ALAB", "XNDU", "FN", "SITM", "ALMU", "WOLF", "LPKFF", "RKLB"
];

export const universe: UniverseStock[] = [
  { ticker: "NVDA", company: "NVIDIA", theme: "AI Compute", thematicFit: 100, conviction: "Core", note: "The dominant accelerated-computing platform." },
  { ticker: "AMD", company: "Advanced Micro Devices", theme: "AI Compute", thematicFit: 95, conviction: "High", note: "The clearest second-source accelerator platform." },
  { ticker: "AVGO", company: "Broadcom", theme: "Custom Silicon", thematicFit: 98, conviction: "Core", note: "Networking and custom accelerators for hyperscalers." },
  { ticker: "ARM", company: "Arm Holdings", theme: "Compute Architecture", thematicFit: 94, conviction: "High", note: "CPU architecture increasingly important across edge and data center." },
  { ticker: "ALAB", company: "Astera Labs", theme: "Connectivity", thematicFit: 99, conviction: "Core", note: "Purpose-built connectivity for AI systems." },
  { ticker: "ANET", company: "Arista Networks", theme: "Networking", thematicFit: 98, conviction: "Core", note: "High-speed switching for scale-out AI clusters." },
  { ticker: "CRDO", company: "Credo Technology", theme: "Connectivity", thematicFit: 98, conviction: "Core", note: "High-speed interconnect exposure with strong operating leverage." },
  { ticker: "MRVL", company: "Marvell Technology", theme: "Custom Silicon", thematicFit: 95, conviction: "High", note: "Custom compute and electro-optics exposure." },
  { ticker: "MU", company: "Micron Technology", theme: "Memory", thematicFit: 96, conviction: "Core", note: "HBM and memory-cycle leverage." },
  { ticker: "SNDK", company: "SanDisk", theme: "Memory", thematicFit: 88, conviction: "Watch", note: "Flash storage exposure across AI infrastructure." },
  { ticker: "WDC", company: "Western Digital", theme: "Storage", thematicFit: 82, conviction: "Watch", note: "Data growth and storage-cycle leverage." },
  { ticker: "FN", company: "Fabrinet", theme: "Optical Manufacturing", thematicFit: 94, conviction: "High", note: "A high-quality manufacturing beneficiary of optical demand." },
  { ticker: "COHR", company: "Coherent", theme: "Optics", thematicFit: 93, conviction: "High", note: "Optical components required for faster AI networks." },
  { ticker: "LITE", company: "Lumentum", theme: "Optics", thematicFit: 89, conviction: "Watch", note: "Datacom optics and laser exposure." },
  { ticker: "MTSI", company: "MACOM", theme: "Connectivity", thematicFit: 91, conviction: "High", note: "Analog and photonic components for high-speed systems." },
  { ticker: "SITM", company: "SiTime", theme: "Timing", thematicFit: 90, conviction: "High", note: "Precision timing becomes more valuable as systems grow complex." },
  { ticker: "SILC", company: "Silicom", theme: "Networking", thematicFit: 83, conviction: "Watch", note: "Specialized networking and acceleration hardware." },
  { ticker: "OUST", company: "Ouster", theme: "Physical AI", thematicFit: 93, conviction: "High", note: "Digital lidar for robotics and autonomy." },
  { ticker: "NBIS", company: "Nebius Group", theme: "AI Cloud", thematicFit: 97, conviction: "Core", note: "High-beta AI infrastructure and cloud capacity exposure." },
  { ticker: "PENG", company: "Penguin Solutions", theme: "AI Systems", thematicFit: 92, conviction: "High", note: "AI infrastructure integration and memory solutions." },
  { ticker: "OSS", company: "One Stop Systems", theme: "Edge AI", thematicFit: 88, conviction: "Watch", note: "Ruggedized high-performance compute systems." },
  { ticker: "ASTS", company: "AST SpaceMobile", theme: "Space Connectivity", thematicFit: 86, conviction: "High", note: "Direct-to-device satellite connectivity." },
  { ticker: "RKLB", company: "Rocket Lab", theme: "Space Infrastructure", thematicFit: 90, conviction: "Core", note: "Launch and space-systems platform." },
  { ticker: "VRT", company: "Vertiv", theme: "Power & Cooling", thematicFit: 99, conviction: "Core", note: "Critical infrastructure for dense AI data centers." },
  { ticker: "ETN", company: "Eaton", theme: "Power", thematicFit: 96, conviction: "Core", note: "Electrical equipment and grid bottleneck beneficiary." },
  { ticker: "GEV", company: "GE Vernova", theme: "Power", thematicFit: 96, conviction: "Core", note: "Generation, grid and electrification exposure." },
  { ticker: "PWR", company: "Quanta Services", theme: "Grid Buildout", thematicFit: 93, conviction: "High", note: "Transmission and electrical infrastructure buildout." },
  { ticker: "EME", company: "EMCOR", theme: "Data Center Construction", thematicFit: 90, conviction: "High", note: "Electrical and mechanical construction exposure." },
  { ticker: "CEG", company: "Constellation Energy", theme: "Nuclear Power", thematicFit: 94, conviction: "Core", note: "Clean, reliable power for data-center demand." },
  { ticker: "VST", company: "Vistra", theme: "Power", thematicFit: 91, conviction: "High", note: "Merchant generation leverage to tightening power markets." },
  { ticker: "OKLO", company: "Oklo", theme: "Advanced Nuclear", thematicFit: 93, conviction: "Watch", note: "Long-duration advanced nuclear optionality." },
  { ticker: "SMR", company: "NuScale Power", theme: "Advanced Nuclear", thematicFit: 88, conviction: "Watch", note: "SMR commercialization optionality." },
  { ticker: "CCJ", company: "Cameco", theme: "Nuclear Fuel", thematicFit: 91, conviction: "High", note: "Strategic uranium and nuclear-fuel exposure." },
  { ticker: "BWXT", company: "BWX Technologies", theme: "Nuclear Components", thematicFit: 89, conviction: "High", note: "Specialized nuclear components and defense exposure." },
  { ticker: "LEU", company: "Centrus Energy", theme: "Nuclear Fuel", thematicFit: 92, conviction: "High", note: "Strategic enrichment and HALEU exposure." },
  { ticker: "FCX", company: "Freeport-McMoRan", theme: "Copper", thematicFit: 85, conviction: "High", note: "Copper exposure to electrification and grid spending." },
  { ticker: "SCCO", company: "Southern Copper", theme: "Copper", thematicFit: 84, conviction: "High", note: "Large-scale copper producer with scarcity value." },
  { ticker: "MP", company: "MP Materials", theme: "Rare Earths", thematicFit: 91, conviction: "High", note: "Western rare-earth supply-chain strategic asset." },
  { ticker: "UUUU", company: "Energy Fuels", theme: "Critical Minerals", thematicFit: 87, conviction: "Watch", note: "Uranium and rare-earth optionality." },
  { ticker: "PLTR", company: "Palantir", theme: "AI Software", thematicFit: 89, conviction: "Core", note: "Operational AI deployment across government and enterprise." },
  { ticker: "KTOS", company: "Kratos Defense", theme: "Autonomous Defense", thematicFit: 90, conviction: "High", note: "Low-cost autonomous systems and defense technology." },
  { ticker: "AVAV", company: "AeroVironment", theme: "Drones", thematicFit: 91, conviction: "High", note: "Uncrewed systems and loitering munitions." },
  { ticker: "LHX", company: "L3Harris", theme: "Defense Electronics", thematicFit: 83, conviction: "High", note: "Sensors, communications and space systems." },
  { ticker: "TSM", company: "TSMC", theme: "Foundry", thematicFit: 98, conviction: "Core", note: "The manufacturing center of advanced AI silicon." },
  { ticker: "ASML", company: "ASML", theme: "Semiconductor Equipment", thematicFit: 97, conviction: "Core", note: "Near-monopoly lithography exposure." },
  { ticker: "AMAT", company: "Applied Materials", theme: "Semiconductor Equipment", thematicFit: 92, conviction: "High", note: "Broad process-equipment exposure." },
  { ticker: "LRCX", company: "Lam Research", theme: "Semiconductor Equipment", thematicFit: 93, conviction: "High", note: "Memory and advanced-node process exposure." },
  { ticker: "KLAC", company: "KLA", theme: "Semiconductor Equipment", thematicFit: 92, conviction: "High", note: "Process-control intensity rises with complexity." },
  { ticker: "TER", company: "Teradyne", theme: "Robotics & Test", thematicFit: 84, conviction: "Watch", note: "Semiconductor test and industrial automation exposure." },
  { ticker: "SYM", company: "Symbotic", theme: "Robotics", thematicFit: 89, conviction: "High", note: "Warehouse automation and physical AI." },
  { ticker: "AMBA", company: "Ambarella", theme: "Edge AI", thematicFit: 87, conviction: "Watch", note: "Computer-vision silicon for edge inference." }
];

export const themes = [
  { slug: "compute", title: "AI Compute", score: 98, horizon: "Now", tickers: ["NVDA", "AMD", "AVGO", "ARM"], thesis: "Accelerator demand remains the center of AI capital spending, but value is spreading into custom silicon and system architecture." },
  { slug: "networking", title: "Networking & Connectivity", score: 97, horizon: "Now", tickers: ["ANET", "CRDO", "ALAB", "MRVL", "FN"], thesis: "Cluster scale is making networking, optics and interconnect a larger percentage of total system value." },
  { slug: "power", title: "Power & Cooling", score: 99, horizon: "Now", tickers: ["VRT", "ETN", "GEV", "PWR", "EME"], thesis: "The constraint is moving from chips to electricity, cooling and electrical infrastructure." },
  { slug: "memory", title: "Memory & Storage", score: 94, horizon: "Now", tickers: ["MU", "SNDK", "WDC"], thesis: "HBM content and data growth are turning memory from a commodity side note into a strategic AI bottleneck." },
  { slug: "nuclear", title: "Nuclear Renaissance", score: 91, horizon: "12–60 months", tickers: ["CEG", "CCJ", "BWXT", "LEU", "OKLO"], thesis: "Power scarcity is restoring the strategic value of reliable nuclear generation and fuel security." },
  { slug: "physical-ai", title: "Physical AI", score: 88, horizon: "24–60 months", tickers: ["OUST", "SYM", "TER", "AMBA"], thesis: "Robotics moves AI from software into sensors, timing, edge compute and physical systems." }
];

export const researchPosts = [
  { title: "Do Not Buy the Robot. Buy the Export License.", date: "Jul 25", tickers: ["MP", "NVDA"], theme: "Critical Minerals", access: "Premium" },
  { title: "I Passed on This Stock at $188. Today I Paid $327.", date: "Jul 24", tickers: ["ALAB"], theme: "Connectivity", access: "Premium" },
  { title: "AI Ran Out of Transformers. One Company Makes the Steel.", date: "Jul 15", tickers: ["ETN", "GEV"], theme: "Power", access: "Free" },
  { title: "AI Just Hit a Wall. Buy the Wall.", date: "Jul 13", tickers: ["VRT", "PWR"], theme: "Power & Cooling", access: "Free" },
  { title: "Everyone Bought the Cooler. I Bought the Coolant.", date: "Jul 16", tickers: ["VRT"], theme: "Cooling", access: "Premium" },
  { title: "SK Hynix Is the Anti-SpaceX IPO", date: "Jul 10", tickers: ["MU"], theme: "Memory", access: "Premium" }
];

export function pseudoScore(ticker: string, thematicFit: number) {
  const seed = ticker.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const momentum = 55 + (seed * 7) % 43;
  const technicals = 52 + (seed * 11) % 46;
  const fundamentals = 50 + (seed * 13) % 47;
  const overall = Math.round(momentum * 0.25 + technicals * 0.25 + fundamentals * 0.30 + thematicFit * 0.20);
  return { momentum, technicals, fundamentals, thematicFit, overall };
}
