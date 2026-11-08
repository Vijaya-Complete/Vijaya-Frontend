import { useTranslation } from "react-i18next";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";
import { drawings, stories } from "@/lib/mock-data";
interface Props { onNav:(p:any)=>void }
function StatCard({emoji,label,value,sub,bg}:{emoji:string;label:string;value:string|number;sub:string;bg:string}){
  return(<div className="card-lift rounded-3xl border border-border/60 bg-card p-6 shadow-playful"><div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl text-2xl mb-4 ${bg}`}>{emoji}</div><div className="font-display text-4xl font-bold">{value}</div><div className="mt-1 text-sm font-semibold">{label}</div><div className="text-xs text-muted-foreground mt-0.5">{sub}</div></div>);
}
export function Overview({onNav}:Props){
  const {t}=useTranslation();
  return(<div className="space-y-8">
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-cherry p-8 text-primary-foreground shadow-playful">
      <div className="relative z-10"><div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4">✦ Editor's Desk</div><h1 className="font-display text-4xl font-bold">{t("admin.title")}</h1><p className="mt-2 max-w-xl text-sm opacity-90">{t("admin.lead")}</p></div>
      <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10"/><div className="absolute -right-4 bottom-0 h-28 w-28 rounded-full bg-white/10"/>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard emoji="⏳" label={t("admin.pending")} value={12} sub="new submissions" bg="bg-primary/10"/>
      <StatCard emoji="🚩" label={t("admin.flagged")} value={2} sub="need attention" bg="bg-cherry/10"/>
      <StatCard emoji="📖" label="Active issue" value="#47" sub="12 days remaining" bg="bg-sunshine/30"/>
      <StatCard emoji="👥" label={t("admin.totalUsers")} value={284} sub="+12 this week" bg="bg-mint/30"/>
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-3xl border border-border/60 bg-card shadow-playful overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/60 bg-secondary/30 px-6 py-4">
          <h2 className="font-display text-lg font-bold">{t("admin.pending")}</h2>
          <button onClick={()=>onNav("drawings")} className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">View all <ArrowRight className="h-3.5 w-3.5"/></button>
        </div>
        <div className="divide-y divide-border/40">
          {drawings.slice(0,5).map(d=>(
            <div key={d.id} className="flex items-center gap-3 px-6 py-3 hover:bg-secondary/20 transition">
              <img src={d.imageUrl} alt="" className="h-10 w-10 rounded-xl object-cover flex-shrink-0 border border-border/40"/>
              <div className="flex-1 min-w-0"><div className="font-semibold text-sm line-clamp-1">{d.title}</div><div className="text-xs text-muted-foreground">{d.firstName}, age {d.age}</div></div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button className="rounded-full bg-mint/40 px-3 py-1 text-xs font-bold text-teal-700 hover:bg-mint/60 transition">✓</button>
                <button className="rounded-full bg-cherry/15 px-2 py-1 text-xs font-bold text-cherry hover:bg-cherry/25 transition">✗</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
        <h2 className="font-display text-lg font-bold mb-5 flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary"/>Issue 47 progress</h2>
        <div className="space-y-4">
          {[{label:"Drawings submitted",value:drawings.length,max:30,color:"bg-primary"},{label:"Stories submitted",value:stories.length,max:30,color:"bg-cherry"},{label:"Top 30 drawings picked",value:drawings.filter(d=>d.top30).length,max:30,color:"bg-sunshine"},{label:"Top 30 stories picked",value:stories.filter(s=>s.top30).length,max:30,color:"bg-mint"}].map(s=>(
            <div key={s.label}><div className="flex justify-between text-sm mb-1.5"><span className="font-medium">{s.label}</span><span className="font-bold text-muted-foreground">{s.value}<span className="font-normal text-muted-foreground/60"> / {s.max}</span></span></div><div className="h-2.5 rounded-full bg-border overflow-hidden"><div className={`h-full rounded-full ${s.color}`} style={{width:`${Math.min(100,(s.value/s.max)*100)}%`}}/></div></div>
          ))}
        </div>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-sunshine/40 bg-sunshine/20 p-4 text-sm"><Clock className="h-4 w-4 text-sunshine-foreground flex-shrink-0"/><div><span className="font-semibold">Deadline in 12 days</span><span className="text-muted-foreground ml-1">— Issue 47 closes June 15</span></div></div>
      </div>
    </div>
    <div><h2 className="font-display text-xl font-bold mb-4">Quick actions</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[{page:"top30",emoji:"⭐",label:"Manage Top 30",desc:"Select the best work"},{page:"top3",emoji:"🏆",label:"Confirm Top 3",desc:"Choose contributors"},{page:"builder",emoji:"📖",label:"Build Magazine",desc:"Lay out the next issue"},{page:"revenue",emoji:"💰",label:"Revenue",desc:"Track magazine sales"}].map(q=>(
          <button key={q.page} onClick={()=>onNav(q.page as any)} className="card-lift flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 text-left hover:border-primary/40 transition-all shadow-playful">
            <span className="text-2xl">{q.emoji}</span><div><div className="font-display font-bold text-sm">{q.label}</div><div className="text-xs text-muted-foreground">{q.desc}</div></div>
          </button>
        ))}
      </div>
    </div>
  </div>);
}
