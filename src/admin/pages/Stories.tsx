import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Star, Trash2, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmojiRatingDisplay } from "@/components/EmojiRating";
import { stories as initial } from "@/lib/mock-data";
import { toast } from "sonner";

const TYPE_COLOR: Record<string,string> = {
  Poem:"bg-primary/10 text-primary","Short Story":"bg-sunshine/40 text-sunshine-foreground",
  Article:"bg-mint/40 text-teal-700",Other:"bg-secondary text-muted-foreground",
};

export function Stories() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [type, setType] = useState("all");
  const [items, setItems] = useState(initial);

  const filtered = items.filter(s =>
    (q===""||s.title.toLowerCase().includes(q.toLowerCase())||s.author.toLowerCase().includes(q.toLowerCase())) &&
    (type==="all"||s.type===type)
  );
  const toggleTop30 = (id:string) => { setItems(p=>p.map(s=>s.id===id?{...s,top30:!s.top30}:s)); toast.success("Updated ⭐"); };
  const remove      = (id:string) => { setItems(p=>p.filter(s=>s.id!==id)); toast.success("Removed"); };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("admin.nav.stories")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{filtered.length} {t("gallery.storiesTitle").toLowerCase()}</p>
      </div>

      <div className="flex flex-wrap gap-3 rounded-3xl border border-border/60 bg-card p-4 shadow-playful">
        <div className="relative flex-1 min-w-44">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
          <Input value={q} onChange={e=>setQ(e.target.value)} placeholder={t("search.placeholder")} className="pl-9 rounded-full"/>
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-40 rounded-full"><SelectValue placeholder={t("gallery.filterType")}/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("gallery.all")}</SelectItem>
            {["Poem","Short Story","Article","Other"].map(tp=><SelectItem key={tp} value={tp}>{tp}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(s=>(
          <div key={s.id} className="card-lift rounded-3xl border border-border/60 bg-card p-5 shadow-playful flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${TYPE_COLOR[s.type]??TYPE_COLOR.Other}`}>{s.type}</span>
                {s.top30&&<span className="rounded-full bg-sunshine/60 px-2 py-0.5 text-xs font-bold text-sunshine-foreground">⭐ Top 30</span>}
              </div>
              <div className="font-display text-lg font-bold leading-snug">{s.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.author} · {s.issue}</div>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.excerpt}</p>
            </div>
            <div className="mt-4">
              <div className="mb-3"><EmojiRatingDisplay rating={s.rating} count={s.reviewCount}/></div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline"
                  className={`flex-1 rounded-full h-8 text-xs ${s.top30?"border-sunshine text-sunshine-foreground bg-sunshine/20":""}`}
                  onClick={()=>toggleTop30(s.id)}>
                  <Star className={`mr-1 h-3 w-3 ${s.top30?"fill-yellow-400 text-yellow-400":""}`}/>
                  {s.top30?"In Top 30":"Add to Top 30"}
                </Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-secondary" onClick={()=>toast.info("Edit story")}><Pencil className="h-3.5 w-3.5"/></Button>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-full hover:bg-destructive/10" onClick={()=>remove(s.id)}><Trash2 className="h-3.5 w-3.5 text-destructive"/></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0&&(
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <div className="text-4xl mb-3">📝</div>
          <div className="font-display font-bold text-lg">No stories found</div>
        </div>
      )}
    </div>
  );
}
