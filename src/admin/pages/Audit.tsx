import { useTranslation } from "react-i18next";
import { ClipboardList } from "lucide-react";

const LOG=[
  {id:"a1",action:"Removed drawing",   target:"The Brave Lion",              by:"Admin",at:"2026-05-28 14:32",type:"delete"},
  {id:"a2",action:"Added to Top 30",   target:"My Happy Garden",             by:"Admin",at:"2026-05-28 14:10",type:"top30"},
  {id:"a3",action:"Confirmed Top 3",   target:"Issue 47 — Ages 5–8",         by:"Admin",at:"2026-05-28 13:55",type:"top3"},
  {id:"a4",action:"Edited story",      target:"The Moon's Secret",           by:"Admin",at:"2026-05-28 12:20",type:"edit"},
  {id:"a5",action:"Deactivated user",  target:"user_xyz@example.com",        by:"Admin",at:"2026-05-27 16:45",type:"user"},
  {id:"a6",action:"Removed review",    target:"Review on Spaceship Picnic",  by:"Admin",at:"2026-05-27 11:03",type:"delete"},
  {id:"a7",action:"Created issue",     target:"Issue 47",                    by:"Admin",at:"2026-05-01 09:00",type:"issue"},
  {id:"a8",action:"Updated About page",target:"About page",                  by:"Admin",at:"2026-04-30 15:20",type:"content"},
];
const STYLE:Record<string,{bg:string;text:string;emoji:string}>={
  delete:{bg:"bg-destructive/10",text:"text-destructive",       emoji:"🗑️"},
  top30: {bg:"bg-sunshine/30",   text:"text-sunshine-foreground",emoji:"⭐"},
  top3:  {bg:"bg-primary/10",    text:"text-primary",            emoji:"🏆"},
  edit:  {bg:"bg-sky/30",        text:"text-blue-700",           emoji:"✏️"},
  user:  {bg:"bg-cherry/10",     text:"text-cherry",             emoji:"👤"},
  issue: {bg:"bg-mint/30",       text:"text-teal-700",           emoji:"📖"},
  content:{bg:"bg-secondary",    text:"text-muted-foreground",   emoji:"📄"},
};

export function Audit() {
  const { t } = useTranslation();
  return(
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-primary/10 grid place-items-center"><ClipboardList className="h-5 w-5 text-primary"/></div>
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.auditLog.title")}</h1>
          <p className="text-sm text-muted-foreground">{LOG.length} recorded actions</p>
        </div>
      </div>
      <div className="space-y-3">
        {LOG.map(entry=>{
          const s=STYLE[entry.type]??STYLE.content;
          return(
            <div key={entry.id} className="card-lift flex items-center gap-4 rounded-2xl border border-border/60 bg-card px-5 py-4 shadow-playful">
              <div className={`h-9 w-9 rounded-xl grid place-items-center text-lg flex-shrink-0 ${s.bg}`}>{s.emoji}</div>
              <div className="flex-1 min-w-0">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${s.bg} ${s.text}`}>{entry.action}</span>
                <div className="mt-1 text-sm font-medium truncate">{entry.target}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-semibold text-muted-foreground">{entry.by}</div>
                <div className="text-xs text-muted-foreground">{entry.at}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
