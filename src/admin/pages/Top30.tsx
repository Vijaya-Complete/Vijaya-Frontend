import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { drawings, stories } from "@/lib/mock-data";
import { toast } from "sonner";

export function Top30() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"drawings"|"stories">("drawings");
  const [selD, setSelD] = useState<Set<string>>(new Set(drawings.filter(d=>d.top30).map(d=>d.id)));
  const [selS, setSelS] = useState<Set<string>>(new Set(stories.filter(s=>s.top30).map(s=>s.id)));

  const sortedD = [...drawings].sort((a,b)=>b.rating-a.rating);
  const sortedS = [...stories].sort((a,b)=>b.rating-a.rating);

  const toggleD=(id:string)=>setSelD(p=>{const n=new Set(p);if(n.has(id)){n.delete(id);return n;}if(n.size>=30){toast.error(t("admin.top30.title")+" max 30");return p;}n.add(id);return n;});
  const toggleS=(id:string)=>setSelS(p=>{const n=new Set(p);if(n.has(id)){n.delete(id);return n;}if(n.size>=30){toast.error(t("admin.top30.title")+" max 30");return p;}n.add(id);return n;});

  const items  = tab==="drawings"?sortedD:sortedS;
  const sel    = tab==="drawings"?selD:selS;
  const toggle = tab==="drawings"?toggleD:toggleS;
  const insuf  = tab==="drawings"?sortedD.filter(d=>d.rating>=3).length<30:sortedS.filter(s=>s.rating>=3).length<30;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.top30.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{t("admin.top30.title")} — {t("submit.rules").split(".")[0]}</p>
        </div>
        <Button className="rounded-full shadow-playful" onClick={()=>toast.success("Top 30 confirmed! Notifications sent 🌟")}>
          <CheckCircle2 className="mr-2 h-4 w-4"/> {t("admin.top30.confirmTop30")}
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex rounded-full border border-border overflow-hidden shadow-playful">
          {(["drawings","stories"] as const).map(tb=>(
            <button key={tb} onClick={()=>setTab(tb)}
              className={`px-5 py-2 text-sm font-semibold transition ${tab===tb?"bg-primary text-primary-foreground":"hover:bg-secondary"}`}>
              {tb==="drawings"?`🎨 ${t("admin.top30.drawingsTab")} (${selD.size}/30)`:`📝 ${t("admin.top30.storiesTab")} (${selS.size}/30)`}
            </button>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-bold text-primary">{sel.size}</span> / 30 {t("admin.top30.selected")}
        </span>
      </div>

      {insuf&&(
        <div className="flex items-center gap-3 rounded-2xl border border-sunshine/50 bg-sunshine/25 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 text-sunshine-foreground flex-shrink-0"/>
          <span>{t("admin.top30.flagWarning")}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item,i)=>{
          const selected=sel.has(item.id);
          const isD="imageUrl" in item;
          return(
            <button key={item.id} onClick={()=>toggle(item.id)}
              className={`card-lift text-left rounded-3xl border-2 overflow-hidden transition-all
                ${selected?"border-primary shadow-playful scale-[1.02]":"border-border/60 bg-card hover:border-primary/30"}`}>
              {isD?(
                <div className="relative">
                  <img src={(item as any).imageUrl} alt="" className="aspect-[4/3] w-full object-cover"/>
                  <div className="absolute top-2 left-2 h-7 w-7 rounded-full bg-black/60 text-white text-xs font-bold grid place-items-center">#{i+1}</div>
                  {selected&&<div className="absolute top-2 right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground grid place-items-center shadow-playful"><CheckCircle2 className="h-4 w-4"/></div>}
                </div>
              ):(
                <div className={`p-4 ${selected?"bg-primary/5":"bg-secondary/30"}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl font-bold text-muted-foreground/40">#{i+1}</span>
                    {selected&&<CheckCircle2 className="h-5 w-5 text-primary"/>}
                  </div>
                  <span className="rounded-full bg-sunshine/40 px-2 py-0.5 text-xs font-bold">{(item as any).type}</span>
                </div>
              )}
              <div className="p-3">
                <div className="font-display font-bold text-sm line-clamp-1">{item.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{isD?(item as any).firstName:(item as any).author}</div>
                <div className="mt-2"><EmojiRatingDisplay rating={item.rating} count={item.reviewCount}/></div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
