import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, Shield, ShieldOff, UserX, UserCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "Users — Admin" }] }),
  component: AdminUsers,
});

type User = { id:string; name:string; age:number; school:string; guardian:string; contact:string; registered:string; trusted:boolean; active:boolean; submissions:number; email:string };

const MOCK: User[] = [
  { id:"u1", name:"Senuli Perera",      age:7,  school:"Visakha Vidyalaya", guardian:"Nimal Perera",    contact:"+94 77 123 4567", registered:"2026-01-10", trusted:true,  active:true,  submissions:5, email:"senuli@example.com"   },
  { id:"u2", name:"Tharindu Rajapaksha",age:11, school:"Royal College",     guardian:"Kumara Rajapaksha",contact:"+94 71 987 6543", registered:"2026-02-14", trusted:true,  active:true,  submissions:3, email:"tharindu@example.com" },
  { id:"u3", name:"Pavithra Siva",      age:15, school:"Trinity College",   guardian:"Siva Nathan",    contact:"+94 76 555 0001", registered:"2026-03-01", trusted:false, active:true,  submissions:1, email:"pavithra@example.com" },
  { id:"u4", name:"Aarav Kumar",        age:9,  school:"Hindu College",     guardian:"Raj Kumar",      contact:"+94 70 444 2233", registered:"2026-04-05", trusted:true,  active:false, submissions:2, email:"aarav@example.com"    },
];

function AdminUsers() {
  const { t } = useTranslation();
  const [q, setQ] = useState("");
  const [users, setUsers] = useState(MOCK);

  const filtered = users.filter(u =>
    !q || u.name.toLowerCase().includes(q.toLowerCase()) ||
    u.school.toLowerCase().includes(q.toLowerCase()) ||
    u.email.toLowerCase().includes(q.toLowerCase())
  );

  const toggleTrusted = (id: string) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, trusted: !u.trusted } : u));
    toast.success("Trust status updated");
  };
  const toggleActive = (id: string) => {
    setUsers(p => p.map(u => u.id === id ? { ...u, active: !u.active } : u));
    toast.success("Account status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">{t("admin.users.title")}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name, school or email…" className="pl-10 rounded-full" />
      </div>

      {/* User cards — mobile-friendly card layout instead of table */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map(u => (
          <div key={u.id} className={`card-lift rounded-3xl border border-border/60 bg-card p-5 shadow-playful transition-all ${!u.active ? "opacity-60" : ""}`}>
            {/* Avatar + name */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 grid place-items-center font-display text-xl font-bold text-primary flex-shrink-0">
                {u.name[0]}
              </div>
              <div>
                <div className="font-display font-bold">{u.name}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[140px]">{u.email}</div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-1.5 text-sm mb-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Age</span>
                <span className="font-medium">{u.age}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">School</span>
                <span className="font-medium text-right max-w-[140px] truncate">{u.school}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Guardian</span>
                <span className="font-medium text-right max-w-[140px] truncate">{u.guardian}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Submissions</span>
                <span className="font-bold text-primary">{u.submissions}</span>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.trusted ? "bg-mint/40 text-teal-700" : "bg-secondary text-muted-foreground"}`}>
                {u.trusted ? "✓ Trusted" : "New user"}
              </span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${u.active ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                {u.active ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1 rounded-full h-8 text-xs" onClick={() => toggleTrusted(u.id)}>
                {u.trusted
                  ? <><ShieldOff className="mr-1 h-3.5 w-3.5" /> Revoke trust</>
                  : <><Shield className="mr-1 h-3.5 w-3.5 text-primary" /> Trust</>}
              </Button>
              <Button size="sm" variant="ghost" className={`flex-1 rounded-full h-8 text-xs ${u.active ? "hover:bg-destructive/10 text-destructive" : "hover:bg-mint/20 text-teal-700"}`} onClick={() => toggleActive(u.id)}>
                {u.active
                  ? <><UserX className="mr-1 h-3.5 w-3.5" /> Deactivate</>
                  : <><UserCheck className="mr-1 h-3.5 w-3.5" /> Reactivate</>}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-3xl border border-dashed border-border bg-card py-16 text-center">
          <div className="text-4xl mb-3">👥</div>
          <div className="font-display font-bold text-lg">No users found</div>
        </div>
      )}
    </div>
  );
}
