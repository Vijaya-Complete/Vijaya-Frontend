import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Shield, ShieldOff, UserX, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const MOCK=[
  {id:"u1",name:"Senuli Perera",      age:7, school:"Visakha Vidyalaya",guardian:"Nimal Perera",    contact:"+94 77 123 4567",registered:"2026-01-10",trusted:true, active:true, submissions:5,email:"senuli@example.com"},
  {id:"u2",name:"Tharindu Rajapaksha",age:11,school:"Royal College",    guardian:"Kumara R.",       contact:"+94 71 987 6543",registered:"2026-02-14",trusted:true, active:true, submissions:3,email:"tharindu@example.com"},
  {id:"u3",name:"Pavithra Siva",      age:15,school:"Trinity College",  guardian:"Siva Nathan",     contact:"+94 76 555 0001",registered:"2026-03-01",trusted:false,active:true, submissions:1,email:"pavithra@example.com"},
  {id:"u4",name:"Aarav Kumar",        age:9, school:"Hindu College",    guardian:"Raj Kumar",       contact:"+94 70 444 2233",registered:"2026-04-05",trusted:true, active:false,submissions:2,email:"aarav@example.com"},
];

export function Users() {
  const { t } = useTranslation();
  const [q,setQ]=useState("");
  const [users,setUsers]=useState(MOCK);
  const filtered=users.filter(u=>!q||u.name.toLowerCase().includes(q.toLowerCase())||u.school.toLowerCase().includes(q.toLowerCase())||u.email.toLowerCase().includes(q.toLowerCase()));
  const toggleTrusted=(id:string)=>{setUsers(p=>p.map(u=>u.id===id?{...u,trusted:!u.trusted}:u));toast.success("Trust status updated");};
  const toggleActive=(id:string)=>{setUsers(p=>p.map(u=>u.id===id?{...u,active:!u.active}:u));toast.success("Account status updated");};

  return(
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">{t("admin.users.title")}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{users.length} registered users</p>
      </div>
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
        <Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search by name, school or email…" className="pl-10 rounded-full"/>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(u=>(
          <div key={u.id} className={`card-lift rounded-3xl border border-border/60 bg-card p-5 shadow-playful ${!u.active?"opacity-60":""}`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center font-display text-xl font-bold text-primary flex-shrink-0">{u.name[0]}</div>
              <div><div className="font-display font-bold">{u.name}</div><div className="text-xs text-muted-foreground truncate max-w-[140px]">{u.email}</div></div>
            </div>
            <div className="space-y-1.5 text-sm mb-4">
              {([[t("profile.age"),u.age],[t("profile.school"),u.school],[t("profile.guardianName"),u.guardian],["Submissions",u.submissions]] as [string,any][]).map(([k,v])=>(
                <div key={k} className="flex items-center justify-between">
                  <span className="text-muted-foreground">{k}</span>
                  <span className={`font-medium text-right max-w-[140px] truncate ${k==="Submissions"?"font-bold text-primary":""}`}>{v}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.trusted?"bg-mint/40 text-teal-700":"bg-secondary text-muted-foreground"}`}>
                {u.trusted?`✓ ${t("admin.users.trusted")}`:t("admin.users.notTrusted")}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.active?"bg-primary/10 text-primary":"bg-destructive/10 text-destructive"}`}>
                {u.active?"Active":"Inactive"}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs" onClick={()=>toggleTrusted(u.id)}>
                {u.trusted?<><ShieldOff className="mr-1 h-3.5 w-3.5"/>Revoke</>:<><Shield className="mr-1 h-3.5 w-3.5 text-primary"/>Trust</>}
              </Button>
              <Button size="sm" variant="ghost" className={`flex-1 rounded-full h-8 text-xs ${u.active?"hover:bg-destructive/10 text-destructive":"hover:bg-mint/20 text-teal-700"}`} onClick={()=>toggleActive(u.id)}>
                {u.active?<><UserX className="mr-1 h-3.5 w-3.5"/>{t("admin.users.deactivate")}</>:<><UserCheck className="mr-1 h-3.5 w-3.5"/>{t("admin.users.reactivate")}</>}
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filtered.length===0&&<div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center"><div className="text-4xl mb-3">👥</div><div className="font-display font-bold text-lg">No users found</div></div>}
    </div>
  );
}
