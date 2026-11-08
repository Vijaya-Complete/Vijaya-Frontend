import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Flag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { toast } from "sonner";

const MOCK=[
  {id:"r1",content:"drawing",title:"My Happy Garden", reviewer:"Amali K.",  text:"This is so beautiful! I love the colours you used.",rating:5,flagged:false,date:"2026-05-20"},
  {id:"r2",content:"story",  title:"The Moon's Secret",reviewer:"Anonymous",text:"What a magical story! It made me smile.",           rating:4,flagged:false,date:"2026-05-21"},
  {id:"r3",content:"drawing",title:"The Brave Lion",  reviewer:"Parent",    text:"My daughter absolutely loves this artwork.",         rating:5,flagged:true, date:"2026-05-22"},
  {id:"r4",content:"story",  title:"Why Cats Purr",  reviewer:"Teacher",   text:"Excellent vocabulary for this age group!",           rating:5,flagged:false,date:"2026-05-23"},
];

export function Reviews() {
  const { t } = useTranslation();
  const [filter,setFilter]=useState<"all"|"flagged">("all");
  const [reviews,setReviews]=useState(MOCK);
  const filtered=filter==="flagged"?reviews.filter(r=>r.flagged):reviews;
  const remove=(id:string)=>{setReviews(p=>p.filter(r=>r.id!==id));toast.success(t("admin.reviews.remove")+" ✓");};
  const toggleFlag=(id:string)=>setReviews(p=>p.map(r=>r.id===id?{...r,flagged:!r.flagged}:r));

  return(
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.reviews.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{reviews.filter(r=>r.flagged).length} {t("admin.reviews.flag").toLowerCase()}</p>
        </div>
        <div className="flex rounded-full border border-border overflow-hidden shadow-playful">
          {(["all","flagged"] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              className={`px-5 py-2 text-sm font-semibold transition ${filter===f?"bg-primary text-primary-foreground":"hover:bg-secondary"}`}>
              {f==="all"?t("admin.reviews.all"):`🚩 ${t("admin.reviews.flag")} (${reviews.filter(r=>r.flagged).length})`}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filtered.map(r=>(
          <div key={r.id} className={`card-lift rounded-3xl border p-5 shadow-playful ${r.flagged?"border-cherry/40 bg-cherry/5":"border-border/60 bg-card"}`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="font-display font-bold">{r.reviewer}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${r.content==="drawing"?"bg-sky/40 text-blue-700":"bg-sunshine/40 text-sunshine-foreground"}`}>{r.content}</span>
                  <span className="text-sm text-muted-foreground">{t("detail.by")} "{r.title}"</span>
                  {r.flagged&&<span className="rounded-full bg-cherry/20 text-cherry px-2 py-0.5 text-xs font-bold">🚩 {t("admin.reviews.flag")}</span>}
                </div>
                <p className="text-sm">{r.text}</p>
                <div className="mt-2 flex items-center gap-3"><EmojiRatingDisplay rating={r.rating} count={0}/><span className="text-xs text-muted-foreground">{r.date}</span></div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className={`rounded-full ${r.flagged?"border-cherry/50 bg-cherry/10 text-cherry":""}`} onClick={()=>toggleFlag(r.id)}>
                  <Flag className="mr-1 h-3.5 w-3.5"/>{r.flagged?"Unflag":t("admin.reviews.flag")}
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full hover:bg-destructive/10" onClick={()=>remove(r.id)}>
                  <Trash2 className="h-3.5 w-3.5 text-destructive"/>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length===0&&<div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center"><div className="text-4xl mb-3">💬</div><div className="font-display font-bold text-lg">No reviews found</div></div>}
      </div>
    </div>
  );
}
