import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Star, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { drawings as initial } from "@/lib/mock-data";
import { toast } from "sonner";
export function Drawings() {
  const {t}=useTranslation(); const [q,setQ]=useState(""); const [issue,setIssue]=useState("all"); const [status,setStatus]=useState("all"); const [items,setItems]=useState(initial);
  const filtered=items.filter(d=>(q===""||d.title.toLowerCase().includes(q.toLowerCase())||d.firstName.toLowerCase().includes(q.toLowerCase()))&&(issue==="all"||d.issue===issue)&&(status==="all"||(status==="top30"?d.top30:!d.top30)));
  const toggleTop30=(id:string)=>{setItems(p=>p.map(d=>d.id===id?{...d,top30:!d.top30}:d));toast.success("Top 30 updated ⭐");};
  const remove=(id:string)=>{setItems(p=>p.filter(d=>d.id!==id));toast.success("Removed");};
  return(<div className="space-y-6"><div><h1 className="font-display text-3xl font-bold">{t("admin.nav.drawings")}</h1><p className="text-sm text-muted-foreground mt-0.5">{filtered.length} drawings</p></div>
    <div className="flex flex-wrap gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-playful">
      <div className="relative flex-1 min-w-44"><Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder={t("search.placeholder")} className="pl-9 rounded-full"/></div>
      <Select value={issue} onValueChange={setIssue}><SelectTrigger className="w-36 rounded-full"><SelectValue placeholder={t("gallery.filterIssue")}/></SelectTrigger><SelectContent><SelectItem value="all">{t("gallery.all")}</SelectItem>{["Issue 47","Issue 46","Issue 45"].map(i=><SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent></Select>
      <Select value={status} onValueChange={setStatus}><SelectTrigger className="w-36 rounded-full"><SelectValue placeholder="Status"/></SelectTrigger><SelectContent><SelectItem value="all">{t("gallery.all")}</SelectItem><SelectItem value="top30">⭐ Top 30</SelectItem><SelectItem value="other">Not Top 30</SelectItem></SelectContent></Select>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map(d=>(<div key={d.id} className="card-lift rounded-3xl border border-border/60 bg-card overflow-hidden shadow-playful">
        <div className="relative"><img src={d.imageUrl} alt="" className="aspect-[4/3] w-full object-cover"/>{d.top30&&<span className="absolute top-2 left-2 rounded-full bg-sunshine/90 px-2 py-0.5 text-xs font-bold text-sunshine-foreground shadow">⭐ Top 30</span>}</div>
        <div className="p-4"><div className="font-display font-bold text-base line-clamp-1">{d.title}</div><div className="text-xs text-muted-foreground mt-0.5">{d.firstName} · {d.school}</div>
          <div className="mt-2 flex items-center justify-between"><span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium">{d.issue}</span><EmojiRatingDisplay rating={d.rating} count={d.reviewCount}/></div>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className={`flex-1 rounded-full h-8 text-xs ${d.top30?"border-sunshine text-sunshine-foreground bg-sunshine/20":""}`} onClick={()=>toggleTop30(d.id)}><Star className={`mr-1 h-3 w-3 ${d.top30?"fill-yellow-400 text-yellow-400":""}`}/>{d.top30?"In Top 30":"Add to Top 30"}</Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-secondary" onClick={()=>toast.info("Edit")}><Pencil className="h-3.5 w-3.5"/></Button>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10" onClick={()=>remove(d.id)}><Trash2 className="h-3.5 w-3.5 text-destructive"/></Button>
          </div>
        </div>
      </div>))}
    </div>
    {filtered.length===0&&<div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center"><div className="text-4xl mb-3">🎨</div><div className="font-display font-bold text-lg">No drawings found</div></div>}
  </div>);
}
