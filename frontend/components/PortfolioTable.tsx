"use client";
import Link from "next/link";
import {useMemo,useState} from "react";
import type {PortfolioHolding} from "@/lib/types";
type SortKey="weight"|"total_gain_pct"|"market_value";
const money=(v:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v);
export function PortfolioTable({holdings,compact=false}:{holdings:PortfolioHolding[];compact?:boolean}){
 const [sortKey,setSortKey]=useState<SortKey>("weight"); const sorted=useMemo(()=>[...holdings].sort((a,b)=>b[sortKey]-a[sortKey]),[holdings,sortKey]); const visible=compact?sorted.slice(0,10):sorted;
 return <div>{!compact&&<div className="portfolio-sort"><span>SORT BY</span>{(["weight","total_gain_pct","market_value"] as SortKey[]).map(k=><button key={k} className={sortKey===k?"active":""} onClick={()=>setSortKey(k)}>{k==="weight"?"Weight":k==="total_gain_pct"?"Return":"Value"}</button>)}</div>}<div className="portfolio-table-wrap"><table className="portfolio-table"><thead><tr><th>Position</th><th>Weight</th><th>Value</th><th>Avg. cost</th><th>Total gain</th><th>Return</th><th></th></tr></thead><tbody>{visible.map(h=><tr key={h.ticker}><td><strong>{h.ticker}</strong><small>Since {h.acquired}</small></td><td>{h.weight.toFixed(2)}%</td><td>{money(h.market_value)}</td><td>${h.average_cost.toFixed(2)}</td><td className={h.total_gain>=0?"positive":"negative"}>{money(h.total_gain)}</td><td className={h.total_gain_pct>=0?"positive":"negative"}>{h.total_gain_pct>0?"+":""}{h.total_gain_pct.toFixed(2)}%</td><td><Link href={`/stocks/${h.ticker}`}>Workbook →</Link></td></tr>)}</tbody></table></div></div>
}
