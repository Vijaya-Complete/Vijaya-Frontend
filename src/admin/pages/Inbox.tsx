import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Msg={id:string;name:string;email:string;message:string;date:string;status:"new"|"replied";reply?:string};
const MOCK:Msg[]=[
  {id:"m1",name:"Chamari Silva",email:"chamari@example.com",message:"Hello! I'm a teacher at Ananda College. We'd love to have our class participate in the next issue.",date:"2026-05-28",status:"new"},
  {id:"m2",name:"Ravi Nair",email:"ravi@example.com",message:"My daughter submitted a drawing for Issue 47 but we haven't heard back. Her name is Diya Nair.",date:"2026-05-27",status:"replied",reply:"Dear Ravi, we have received Diya's drawing and it is currently under review."},
  {id:"m3",name:"Priya Thomas",email:"priya@example.com",message:"Is there a way to purchase back issues of the magazine? We'd love copies from Issue 40 onwards.",date:"2026-05-25",status:"new"},
];

export function Inbox() {
  const { t } = useTranslation();
  const [messages,setMessages]=useState(MOCK);
  const [selected,setSelected]=useState<Msg|null>(null);
  const [replyText,setReplyText]=useState("");
  const sendReply=()=>{
    if(!replyText.trim()||!selected)return;
    setMessages(p=>p.map(m=>m.id===selected.id?{...m,status:"replied",reply:replyText}:m));
    setSelected(null);setReplyText("");toast.success("Reply sent! ✉️");
  };

  return(
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("admin.inbox.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{messages.filter(m=>m.status==="new").length} unread messages</p>
      </div>
      <div className="space-y-3">
        {messages.map(m=>(
          <div key={m.id} onClick={()=>{setSelected(m);setReplyText(m.reply??"");}}
            className={`card-lift cursor-pointer rounded-3xl border p-5 shadow-playful transition-all ${m.status==="new"?"border-primary/40 bg-primary/5":"border-border/60 bg-card"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`mt-0.5 h-9 w-9 rounded-2xl grid place-items-center flex-shrink-0 ${m.status==="new"?"bg-primary/10":"bg-secondary"}`}>
                  <Mail className={`h-4 w-4 ${m.status==="new"?"text-primary":"text-muted-foreground"}`}/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-bold">{m.name}</span>
                    <span className="text-xs text-muted-foreground">{m.email}</span>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${m.status==="new"?"bg-primary/15 text-primary":"bg-secondary text-muted-foreground"}`}>
                      {m.status==="new"?t("admin.inbox.status.new"):t("admin.inbox.status.replied")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{m.message}</p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">{m.date}</span>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={!!selected} onOpenChange={o=>!o&&setSelected(null)}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-xl flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary"/>{t("admin.inbox.title")} — {selected?.name}</DialogTitle></DialogHeader>
          {selected&&(
            <div className="space-y-4 mt-2">
              <div className="rounded-2xl bg-secondary/40 p-4 text-sm"><div className="text-xs text-muted-foreground mb-1">{selected.email} · {selected.date}</div><p>{selected.message}</p></div>
              {selected.reply&&<div className="rounded-2xl bg-mint/20 border border-mint/40 p-4 text-sm"><div className="text-xs font-bold text-teal-700 mb-1">Your previous reply:</div><p>{selected.reply}</p></div>}
              <div><Label className="font-semibold text-sm">{t("admin.inbox.reply")}</Label><Textarea value={replyText} onChange={e=>setReplyText(e.target.value)} placeholder={t("admin.inbox.replyPlaceholder")} className="mt-2 rounded-2xl" rows={4}/></div>
              <Button className="w-full rounded-full shadow-playful" onClick={sendReply}><Send className="mr-2 h-4 w-4"/>{t("admin.inbox.send")}</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
