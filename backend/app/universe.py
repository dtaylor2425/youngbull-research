# A broad, static US-listed research universe.
# It is intentionally not labeled as a current index membership list.
# Core AI-infrastructure names receive manual thematic overrides below.

UNIVERSE_GROUPS: dict[str, tuple[int, list[str]]] = {
    "AI Compute & Semiconductors": (78, [
        "NVDA","AMD","AVGO","QCOM","INTC","ARM","MRVL","MU","TXN","ADI","NXPI","MCHP",
        "ON","MPWR","SWKS","QRVO","LSCC","RMBS","CRUS","WOLF","SLAB","POWI","DIOD",
        "ALGM","ACLS","ONTO","FORM","COHU","AMKR","TER","ENTG","MKSI","CAMT","PLAB",
        "ASX","UMC","TSM","ASML","AMAT","LRCX","KLAC","SNPS","CDNS","ALAB","CRDO",
        "MTSI","SITM","SMTC","SYNA","AMBA","PI","OLED","COHR","LITE","AAOI","FN"
    ]),
    "Cloud, Software & Data": (68, [
        "MSFT","GOOGL","META","AMZN","ORCL","IBM","PLTR","SNOW","DDOG","MDB","NET",
        "CRWD","PANW","ZS","FTNT","OKTA","S","CYBR","GEN","NOW","CRM","ADBE","INTU",
        "WDAY","TEAM","HUBS","SHOP","TTD","APP","DUOL","CFLT","ESTC","GTLB","DOCN",
        "TWLO","PATH","AI","SOUN","BBAI","NBIS","TEM","VEEV","DOCS","PCOR","MNDY"
    ]),
    "Networking, Data Centers & Power": (76, [
        "ANET","CSCO","JNPR","CIEN","NOK","ERIC","VRT","ETN","HUBB","GEV","PWR",
        "EME","MYRG","FIX","TT","JCI","CARR","AAON","MOD","NVT","ROK","AME","ROP",
        "PH","IR","GNRC","ABB","TEL","APH","GLW","KEYS","FLEX","SANM","CLS","PENG",
        "DELL","HPE","SMCI","NTAP","PSTG","WDC","SNDK","STX","EQIX","DLR","IRM"
    ]),
    "Energy, Utilities & Nuclear": (70, [
        "CEG","VST","NRG","TLN","NEE","DUK","SO","AEP","EXC","D","SRE","PEG","ED",
        "EIX","PCG","XEL","WEC","DTE","ETR","FE","PPL","AES","CWEN","BEPC","BEP",
        "CCJ","BWXT","LEU","UEC","UUUU","NXE","DNN","URG","OKLO","SMR","NNE",
        "XOM","CVX","COP","EOG","OXY","FANG","DVN","HES","MPC","VLO","PSX","SLB",
        "HAL","BKR","KMI","WMB","OKE","LNG"
    ]),
    "Industrials, Automation & Robotics": (66, [
        "GE","HON","CAT","DE","CMI","PCAR","URI","FAST","GWW","WCN","WM","RSG","MMM",
        "DOV","ITW","XYL","IEX","CSL","GGG","HWM","ATI","NDSN","ZBRA","CGNX","TER",
        "SYM","OUST","RR","SERV","ISRG","ABBNY","FANUY","ROK","EMR","ETN","PH",
        "JCI","TT","CARR","IR","GNRC","AGCO","TEX","OSK","MTW","WAB","TRN"
    ]),
    "Defense, Space & Cyber": (72, [
        "LMT","RTX","NOC","GD","LHX","HII","BA","TXT","TDG","HEI","CW","WWD","KTOS",
        "AVAV","PLTR","RKLB","ASTS","RDW","LUNR","BKSY","SPIR","MNTS","SATL","IRDM",
        "VSAT","GSAT","MRCY","LDOS","SAIC","CACI","BAH","PSN","KBR","BWXT","AXON",
        "CRWD","PANW","FTNT","CYBR","ZS","OKTA","S","RBRK","TENB","QLYS"
    ]),
    "Materials & Strategic Resources": (64, [
        "LIN","APD","SHW","ECL","DD","DOW","PPG","NEM","GOLD","AEM","KGC","AU","GFI",
        "FCX","SCCO","TECK","HBM","ERO","MP","UUUU","LAC","ALB","SQM","LTHM","PLL",
        "CLF","NUE","STLD","X","AA","CENX","ATI","CRS","RS","CMC","VMC","MLM","EXP",
        "CF","MOS","NTR","IPI","CE","EMN","FMC","IFF"
    ]),
    "Consumer, Payments & Communications": (55, [
        "AAPL","TSLA","NFLX","DIS","CMCSA","T","VZ","TMUS","SPOT","RBLX","EA","TTWO",
        "UBER","LYFT","DASH","ABNB","BKNG","EXPE","MAR","HLT","MGM","LVS","WYNN",
        "COST","WMT","TGT","HD","LOW","ORLY","AZO","NKE","LULU","SBUX","MCD","YUM",
        "CMG","KO","PEP","MNST","PM","MO","EL","PG","CL","KMB","V","MA","AXP","PYPL",
        "COIN","HOOD","SOFI","AFRM","NU"
    ]),
    "Healthcare & Life Sciences": (55, [
        "LLY","NVO","JNJ","MRK","ABBV","PFE","BMY","AMGN","GILD","REGN","VRTX","BIIB",
        "ISRG","SYK","BSX","MDT","EW","DXCM","PODD","TMO","DHR","A","IQV","IDXX",
        "ZTS","HCA","UNH","ELV","CI","HUM","CNC","MCK","COR","CAH","VEEV","ALNY",
        "IONS","CRSP","NTLA","BEAM","RXRX","TEM","SANA","MRNA","BNTX","INCY","EXAS"
    ]),
    "Financials & Market Infrastructure": (52, [
        "JPM","BAC","WFC","C","GS","MS","BLK","BX","KKR","APO","ARES","OWL","SCHW",
        "IBKR","CME","ICE","NDAQ","SPGI","MCO","MSCI","COF","DFS","SYF","ALLY","USB",
        "PNC","TFC","BK","STT","AON","MMC","AJG","CB","PGR","TRV","ALL","MET","PRU"
    ]),
}

CORE_OVERRIDES: dict[str, tuple[str, int]] = {
    "NVDA": ("AI Compute", 100),
    "AMD": ("AI Compute", 95),
    "AVGO": ("Custom Silicon", 98),
    "ARM": ("Compute Architecture", 94),
    "ALAB": ("Connectivity", 99),
    "ANET": ("Networking", 98),
    "CRDO": ("Connectivity", 98),
    "MRVL": ("Custom Silicon", 95),
    "MU": ("Memory", 96),
    "SNDK": ("Memory", 88),
    "WDC": ("Storage", 82),
    "FN": ("Optical Manufacturing", 94),
    "COHR": ("Optics", 93),
    "LITE": ("Optics", 89),
    "MTSI": ("Connectivity", 91),
    "SITM": ("Timing", 90),
    "OUST": ("Physical AI", 93),
    "NBIS": ("AI Cloud", 97),
    "PENG": ("AI Systems", 92),
    "OSS": ("Edge AI", 88),
    "ASTS": ("Space Connectivity", 86),
    "RKLB": ("Space Infrastructure", 90),
    "VRT": ("Power & Cooling", 99),
    "ETN": ("Power", 96),
    "GEV": ("Power", 96),
    "PWR": ("Grid Buildout", 93),
    "EME": ("Data Center Construction", 90),
    "CEG": ("Nuclear Power", 94),
    "VST": ("Power", 91),
    "OKLO": ("Advanced Nuclear", 93),
    "SMR": ("Advanced Nuclear", 88),
    "CCJ": ("Nuclear Fuel", 91),
    "BWXT": ("Nuclear Components", 89),
    "LEU": ("Nuclear Fuel", 92),
    "FCX": ("Copper", 85),
    "SCCO": ("Copper", 84),
    "MP": ("Rare Earths", 91),
    "UUUU": ("Critical Minerals", 87),
    "PLTR": ("AI Software", 89),
    "KTOS": ("Autonomous Defense", 90),
    "AVAV": ("Drones", 91),
    "LHX": ("Defense Electronics", 83),
    "TSM": ("Foundry", 98),
    "ASML": ("Semiconductor Equipment", 97),
    "AMAT": ("Semiconductor Equipment", 92),
    "LRCX": ("Semiconductor Equipment", 93),
    "KLAC": ("Semiconductor Equipment", 92),
    "TER": ("Robotics & Test", 84),
    "SYM": ("Robotics", 89),
    "AMBA": ("Edge AI", 87),
}

THEMATIC_FIT: dict[str, tuple[str, int]] = {}
for group_name, (default_score, tickers) in UNIVERSE_GROUPS.items():
    for ticker in tickers:
        THEMATIC_FIT.setdefault(ticker, (group_name, default_score))

THEMATIC_FIT.update(CORE_OVERRIDES)
UNIVERSE = sorted(THEMATIC_FIT)
