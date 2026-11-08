import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Trophy, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { topContributors } from "@/lib/mock-data";
import { toast } from "sonner";

type Pool = "5-8"|"9-12"|"13-17";
const POOLS=[{pool:"5-8" as Pool,label:"Ages 5–8",idx:0,insufficient:false},{pool:"9-12" as Pool,label:"Ages 9–12",idx:1,insufficient:false},{pool:"13-17" as Pool,label:"Ages 13–17",idx:2,insufficient:true}];
const STYLES=[{grad:"from-yellow-400 to-primary",trophy:"text-yellow-300",rank:"#1 Contributor"},{grad:"from-slate-300 to-slate-500",trophy:"text-slate-200",rank:"#2 Contributor"},{grad:"from-amber-600 to-amber-800",trophy:"text-amber-300",rank:"#3 Contributor"}];

export function Top3() {
  const { t } = useTranslation();
  const [confirmed,setConfirmed]=useState<Record<Pool,boolean>>({"5-8":false,"9-12":false,"13-17":false});
  const allDone=Object.values(confirmed).every(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.top3.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Review system suggestions then confirm your final picks</p>
        </div>
        <Button className="rounded-full shadow-playful" disabled={allDone}
          onClick={()=>{setConfirmed({"5-8":true,"9-12":true,"13-17":true});toast.success("All Top 3 confirmed! 🏆");}}>
          <Trophy className="mr-2 h-4 w-4"/>
          {allDone?`${t("admin.top3.confirmed")} ✓`:t("admin.top3.confirmAll")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {POOLS.map(({pool,label,idx,insufficient})=>{
          const c=topContributors[idx]; const s=STYLES[idx]; const done=confirmed[pool];
          return(
            <div key={pool} className={`card-lift rounded-3xl border-2 overflow-hidden shadow-playful transition-all ${done?"border-primary":"border-border/60"}`}>
              <div className={`relative bg-gradient-to-br ${s.grad} p-5`}>
                <Trophy className={`h-10 w-10 ${s.trophy} drop-shadow`}/>
                <div className="mt-1 font-display text-lg font-bold text-white drop-shadow">{label}</div>
                <div className="text-xs text-white/80">{s.rank}</div>
                {done&&<div className="absolute top-3 right-3 rounded-full bg-white/20 p-1.5"><CheckCircle2 className="h-5 w-5 text-white"/></div>}
              </div>
              <div className="p-5">
                {insufficient&&(
                  <div className="mb-4 flex items-start gap-2 rounded-2xl border border-sunshine/40 bg-sunshine/25 p-3 text-xs">
                    <AlertTriangle className="h-4 w-4 text-sunshine-foreground flex-shrink-0 mt-0.5"/>
                    <span>{t("admin.top3.insufficientData")}</span>
                  </div>
                )}
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">{t("admin.top3.suggested")}</div>
                <div className="rounded-2xl bg-secondary/40 p-4 mb-4">
                  <img src={c.highlightImg} alt="" className="w-full h-28 object-cover rounded-xl mb-3"/>
                  <div className="font-display font-bold">{c.name}</div>
                  <div className="text-xs text-muted-foreground">{c.school}</div>
                  <div className="mt-2 flex items-center justify-between">
                    <EmojiRatingDisplay rating={c.rating} count={0}/>
                    <span className="text-xs font-semibold text-muted-foreground">{t("admin.top3.aggregateScore")}: <span className="text-foreground">{c.rating.toFixed(2)}</span></span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-full h-9" variant={done?"outline":"default"} disabled={done}
                    onClick={()=>{setConfirmed(p=>({...p,[pool]:true}));toast.success(`${label} confirmed! 🎉`);}}>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5"/>
                    {done?t("admin.top3.confirmed"):t("admin.top3.accept")}
                  </Button>
                  <Button variant="outline" className="rounded-full h-9 px-3" title={t("admin.top3.override")}
                    onClick={()=>toast.info("Override: pick a user from User Management")}>
                    <RefreshCw className="h-3.5 w-3.5"/>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
