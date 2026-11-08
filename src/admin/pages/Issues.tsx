import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Pencil, Archive, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

type Issue={id:string;name:string;description:string;deadline:string;publishDate:string;maxDrawings:number;maxArticles:number;status:"open"|"closed"|"published"};
const MOCK:Issue[]=[
  {id:"1",name:"Issue 47",description:"Our summer creativity issue",deadline:"2026-06-15",publishDate:"2026-07-01",maxDrawings:5,maxArticles:5,status:"open"},
  {id:"2",name:"Issue 46",description:"April edition",deadline:"2026-05-10",publishDate:"2026-05-25",maxDrawings:5,maxArticles:5,status:"published"},
  {id:"3",name:"Issue 45",description:"March edition",deadline:"2026-04-10",publishDate:"2026-04-25",maxDrawings:5,maxArticles:5,status:"published"},
];
const SS:Record<string,string>={open:"bg-mint/40 text-teal-700",closed:"bg-secondary text-muted-foreground",published:"bg-primary/10 text-primary"};
const BL={name:"",description:"",deadline:"",publishDate:"",maxDrawings:"5",maxArticles:"5"};

export function Issues() {
  const {t}=useTranslation();
  const [issues,setIssues]=useState(MOCK);
  const [open,setOpen]=useState(false);
  const [editing,setEditing]=useState<Issue|null>(null);
  const [form,setForm]=useState(BL);
  const s=(k:string)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setForm(p=>({...p,[k]:e.target.value}));
  const openNew=()=>{setEditing(null);setForm(BL);setOpen(true);};
  const openEdit=(i:Issue)=>{setEditing(i);setForm({name:i.name,description:i.description,deadline:i.deadline,publishDate:i.publishDate,maxDrawings:String(i.maxDrawings),maxArticles:String(i.maxArticles)});setOpen(true);};
  const save=()=>{
    if(!form.name.trim())return toast.error("Name required");
    if(editing){setIssues(p=>p.map(i=>i.id===editing.id?{...i,...form,maxDrawings:+form.maxDrawings,maxArticles:+form.maxArticles}:i));toast.success("Issue updated!");}
    else{setIssues(p=>[{id:crypto.randomUUID(),...form,maxDrawings:+form.maxDrawings,maxArticles:+form.maxArticles,status:"open"},...p]);toast.success("Issue created!");}
    setOpen(false);
  };

  return(
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div><h1 className="font-display text-3xl font-bold">{t("admin.issueManagement.title")}</h1><p className="text-sm text-muted-foreground mt-0.5">{issues.length} issues</p></div>
        <Button className="rounded-full shadow-playful" onClick={openNew}><Plus className="mr-2 h-4 w-4"/>{t("admin.issueManagement.create")}</Button>
      </div>
      <div className="space-y-4">
        {issues.map(issue=>(
          <div key={issue.id} className="card-lift rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="font-display text-2xl font-bold">{issue.name}</h2>
                  <span className={`rounded-full px-3 py-0.5 text-xs font-bold capitalize ${SS[issue.status]}`}>{t(`admin.issueManagement.status.${issue.status}`)}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{issue.description}</p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1"><Calendar className="h-3.5 w-3.5"/>{t("admin.issueManagement.deadline")}: <strong className="text-foreground ml-1">{issue.deadline}</strong></span>
                  <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1"><Clock className="h-3.5 w-3.5"/>{t("admin.issueManagement.publishDate")}: <strong className="text-foreground ml-1">{issue.publishDate}</strong></span>
                  <span className="rounded-full bg-secondary px-3 py-1">{t("admin.issueManagement.maxDrawings")}: <strong className="text-foreground">{issue.maxDrawings}</strong></span>
                  <span className="rounded-full bg-secondary px-3 py-1">{t("admin.issueManagement.maxArticles")}: <strong className="text-foreground">{issue.maxArticles}</strong></span>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button size="sm" variant="outline" className="rounded-full" onClick={()=>openEdit(issue)}><Pencil className="mr-1.5 h-3.5 w-3.5"/>Edit</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground"><Archive className="mr-1.5 h-3.5 w-3.5"/>{t("admin.issueManagement.archive")}</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-3xl max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-xl">{editing?"Edit Issue":t("admin.issueManagement.create")}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div><Label>{t("admin.issueManagement.name")}</Label><Input value={form.name} onChange={s("name")} className="mt-1 rounded-xl"/></div>
            <div><Label>{t("admin.issueManagement.description")}</Label><Textarea value={form.description} onChange={s("description")} className="mt-1 rounded-xl" rows={2}/></div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>{t("admin.issueManagement.deadline")}</Label><Input type="date" value={form.deadline} onChange={s("deadline")} className="mt-1 rounded-xl"/></div>
              <div><Label>{t("admin.issueManagement.publishDate")}</Label><Input type="date" value={form.publishDate} onChange={s("publishDate")} className="mt-1 rounded-xl"/></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>{t("admin.issueManagement.maxDrawings")}</Label><Input type="number" min={1} max={20} value={form.maxDrawings} onChange={s("maxDrawings")} className="mt-1 rounded-xl"/></div>
              <div><Label>{t("admin.issueManagement.maxArticles")}</Label><Input type="number" min={1} max={20} value={form.maxArticles} onChange={s("maxArticles")} className="mt-1 rounded-xl"/></div>
            </div>
            <Button className="w-full rounded-full" onClick={save}>{t("admin.issueManagement.save")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
