import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TrendingUp, Package, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ORDERS=[
  {id:"o1",name:"Nimal Perera",      email:"nimal@example.com",    issue:"Issue 47",type:"physical",copies:2,delivery:"colombo", deliveryFee:300, subtotal:700, total:1000,date:"2026-05-28",status:"paid"},
  {id:"o2",name:"Kamala Silva",      email:"kamala@example.com",   issue:"Issue 47",type:"pdf",     copies:1,delivery:"",        deliveryFee:0,   subtotal:150, total:150, date:"2026-05-27",status:"paid"},
  {id:"o3",name:"Ruwan Fernando",    email:"ruwan@example.com",    issue:"Issue 46",type:"physical",copies:1,delivery:"outside", deliveryFee:500, subtotal:350, total:850, date:"2026-05-26",status:"paid"},
  {id:"o4",name:"Dilani Jayawardena",email:"dilani@example.com",   issue:"Issue 47",type:"physical",copies:3,delivery:"colombo", deliveryFee:300, subtotal:1050,total:1350,date:"2026-05-25",status:"paid"},
  {id:"o5",name:"Anonymous",         email:"guest@example.com",    issue:"Issue 47",type:"pdf",     copies:1,delivery:"",        deliveryFee:0,   subtotal:150, total:150, date:"2026-05-24",status:"paid"},
  {id:"o6",name:"Saman Wickrama",    email:"saman@example.com",    issue:"Issue 46",type:"physical",copies:1,delivery:"outside", deliveryFee:500, subtotal:350, total:850, date:"2026-05-23",status:"pending"},
  {id:"o7",name:"Priya Nair",        email:"priya@example.com",    issue:"Issue 45",type:"pdf",     copies:1,delivery:"",        deliveryFee:0,   subtotal:150, total:150, date:"2026-05-20",status:"paid"},
  {id:"o8",name:"Tharanga Raj",      email:"tharanga@example.com", issue:"Issue 47",type:"physical",copies:2,delivery:"colombo", deliveryFee:300, subtotal:700, total:1000,date:"2026-05-19",status:"paid"},
];
const STATUS_STYLE:Record<string,string>={paid:"bg-mint/40 text-teal-700",pending:"bg-sunshine/40 text-sunshine-foreground",failed:"bg-cherry/20 text-cherry"};
const fmt=(n:number)=>`Rs. ${n.toLocaleString()}`;

export function Revenue() {
  const {t}=useTranslation();
  const [issueFilter,setIssueFilter]=useState("all");
  const [typeFilter, setTypeFilter] =useState("all");

  const filtered=ORDERS.filter(o=>(issueFilter==="all"||o.issue===issueFilter)&&(typeFilter==="all"||o.type===typeFilter));
  const totalRevenue =filtered.reduce((s,o)=>s+(o.status==="paid"?o.total:0),0);
  const physicalCount=filtered.filter(o=>o.type==="physical"&&o.status==="paid").length;
  const pdfCount     =filtered.filter(o=>o.type==="pdf"&&o.status==="paid").length;
  const pendingCount =filtered.filter(o=>o.status==="pending").length;

  return(
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.revenue.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("admin.revenue.subtitle")}</p>
        </div>
        <Button variant="outline" className="rounded-full" onClick={()=>toast.success("CSV exported!")}>
          <Download className="mr-2 h-4 w-4"/>{t("admin.revenue.export")}
        </Button>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {emoji:"💰",label:t("admin.revenue.totalRevenue"),value:fmt(totalRevenue),sub:"all paid orders",  bg:"bg-primary/10"},
          {emoji:"📦",label:t("admin.revenue.physicalSales"),value:physicalCount,   sub:"physical copies",  bg:"bg-sunshine/30"},
          {emoji:"📄",label:t("admin.revenue.pdfSales"),     value:pdfCount,         sub:"PDF downloads",   bg:"bg-mint/30"},
          {emoji:"⏳",label:t("admin.revenue.pending"),       value:pendingCount,     sub:"awaiting payment", bg:"bg-cherry/10"},
        ].map(c=>(
          <div key={c.label} className="card-lift rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl mb-4 ${c.bg}`}>{c.emoji}</div>
            <div className="font-display text-3xl font-bold">{c.value}</div>
            <div className="mt-1 text-sm font-semibold">{c.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Revenue by issue bar chart */}
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
        <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary"/>{t("admin.revenue.byIssue")}
        </h2>
        <div className="space-y-4">
          {["Issue 47","Issue 46","Issue 45"].map(issue=>{
            const io=ORDERS.filter(o=>o.issue===issue&&o.status==="paid");
            const ir=io.reduce((s,o)=>s+o.total,0);
            const pa=io.filter(o=>o.type==="physical").reduce((s,o)=>s+o.total,0);
            const da=io.filter(o=>o.type==="pdf").reduce((s,o)=>s+o.total,0);
            const max=4000;
            return(
              <div key={issue}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-semibold">{issue}</span>
                  <span className="font-bold text-primary">{fmt(ir)}</span>
                </div>
                <div className="h-4 rounded-full bg-border overflow-hidden flex">
                  <div className="h-full bg-primary transition-all rounded-l-full" style={{width:`${(pa/max)*100}%`}} title={`Physical: ${fmt(pa)}`}/>
                  <div className="h-full bg-mint transition-all" style={{width:`${(da/max)*100}%`}} title={`PDF: ${fmt(da)}`}/>
                </div>
                <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary inline-block"/>Physical: {fmt(pa)}</span>
                  <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-mint inline-block"/>PDF: {fmt(da)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Full order table */}
      <div className="rounded-3xl border border-border/60 bg-card overflow-hidden shadow-playful">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-secondary/30 px-6 py-4">
          <h2 className="font-display text-lg font-bold">{t("admin.revenue.allOrders")}</h2>
          <div className="flex gap-2">
            <Select value={issueFilter} onValueChange={setIssueFilter}>
              <SelectTrigger className="w-32 rounded-full h-8 text-xs"><SelectValue placeholder="Issue"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All issues</SelectItem>
                {["Issue 47","Issue 46","Issue 45"].map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-32 rounded-full h-8 text-xs"><SelectValue placeholder="Type"/></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="physical">Physical</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-secondary/30 text-left">
              <tr>
                {[t("admin.revenue.col.buyer"),t("admin.revenue.col.issue"),t("admin.revenue.col.type"),t("admin.revenue.col.copies"),t("admin.revenue.col.delivery"),t("admin.revenue.col.total"),t("admin.revenue.col.date"),t("admin.revenue.col.status")].map(h=>(
                  <th key={h} className="px-4 py-3 font-semibold text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(o=>(
                <tr key={o.id} className="border-t border-border/40 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3"><div className="font-semibold">{o.name}</div><div className="text-xs text-muted-foreground">{o.email}</div></td>
                  <td className="px-4 py-3">{o.issue}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${o.type==="physical"?"bg-sunshine/40 text-sunshine-foreground":"bg-primary/10 text-primary"}`}>
                      {o.type==="physical"?<><Package className="inline h-3 w-3 mr-1"/>Physical</>:<><FileText className="inline h-3 w-3 mr-1"/>PDF</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{o.type==="physical"?o.copies:"—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {o.type==="physical"?(o.delivery==="colombo"?"Colombo (Rs. 300)":"Outside Colombo (Rs. 500)"):"—"}
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">{fmt(o.total)}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-bold capitalize ${STATUS_STYLE[o.status]}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length===0&&<div className="py-12 text-center text-muted-foreground">No orders found.</div>}
        </div>
        <div className="flex justify-end border-t border-border/60 bg-secondary/20 px-6 py-3">
          <span className="text-sm font-semibold">
            {filtered.length} orders · Total: <span className="font-bold text-primary">{fmt(totalRevenue)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
