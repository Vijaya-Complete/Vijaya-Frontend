import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Save, Trash2, Camera } from "lucide-react";
import { getSession, clearSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Vijaya" }] }),
  component: Profile,
});

type ProfileData = {
  name: string; email: string; kidName: string; age: string;
  ageGroup: string; school: string; guardianName: string;
  contactNumber: string; language: string; bio: string;
};

function Profile() {
  const { t, i18n } = useTranslation();
  const nav = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    name: "", email: "", kidName: "", age: "", ageGroup: "",
    school: "", guardianName: "", contactNumber: "", language: "en", bio: "",
  });

  useEffect(() => {
    const session = getSession();
    if (!session) { nav({ to: "/login" }); return; }
    const u = session;
    const profileRaw = localStorage.getItem("vijaya_profile");
    const p = profileRaw ? JSON.parse(profileRaw) : {};
    setProfile({ name: p.name ?? u.name ?? "", email: p.email ?? u.email ?? "", kidName: p.kidName ?? "", age: p.age ?? "", ageGroup: p.ageGroup ?? "", school: p.school ?? "", guardianName: p.guardianName ?? "", contactNumber: p.contactNumber ?? "", language: p.language ?? "en", bio: p.bio ?? "" });
  }, [nav]);

  const set = (field: keyof ProfileData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setProfile(prev => ({ ...prev, [field]: e.target.value }));

  const save = () => {
    localStorage.setItem("vijaya_profile", JSON.stringify(profile));
    localStorage.setItem("vijaya_user", JSON.stringify({ name: profile.name, email: profile.email }));
    i18n.changeLanguage(profile.language);
    toast.success(t("profile.saved"));
  };

  const pickAvatar = (f: File | null) => {
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (e) => setAvatar(e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const deleteAccount = () => {
    clearSession();
    nav({ to: "/" });
    toast.success("Account deleted.");
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="font-display text-3xl font-bold mb-8">{t("profile.title")}</h1>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-primary/20 border-4 border-card shadow-playful overflow-hidden grid place-items-center">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <span className="text-4xl">👤</span>}
          </div>
          <label className="absolute -bottom-1 -right-1 cursor-pointer rounded-full bg-primary p-2 shadow-lg">
            <Camera className="h-4 w-4 text-primary-foreground" />
            <input type="file" accept="image/*" className="hidden" onChange={e => pickAvatar(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>{t("profile.kidName")}</Label><Input value={profile.kidName} onChange={set("kidName")} className="mt-1 rounded-xl" /></div>
          <div><Label>{t("profile.age")}</Label><Input type="number" min={4} max={18} value={profile.age} onChange={set("age")} className="mt-1 rounded-xl" /></div>
        </div>
        <div>
          <Label>Age group</Label>
          <Select value={profile.ageGroup} onValueChange={v => setProfile(p => ({ ...p, ageGroup: v }))}>
            <SelectTrigger className="mt-1 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="5-8">{t("gallery.ages5_8")}</SelectItem>
              <SelectItem value="9-12">{t("gallery.ages9_12")}</SelectItem>
              <SelectItem value="13-17">{t("gallery.ages13_17")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>{t("profile.school")}</Label><Input value={profile.school} onChange={set("school")} className="mt-1 rounded-xl" /></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><Label>{t("profile.guardianName")}</Label><Input value={profile.guardianName} onChange={set("guardianName")} className="mt-1 rounded-xl" /></div>
          <div><Label>{t("profile.contactNumber")}</Label><Input type="tel" value={profile.contactNumber} onChange={set("contactNumber")} className="mt-1 rounded-xl" /></div>
        </div>
        <div className="border-t border-border/40 pt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Account</p>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><Label>Full name</Label><Input value={profile.name} onChange={set("name")} className="mt-1 rounded-xl" /></div>
            <div><Label>{t("auth.email")}</Label><Input type="email" value={profile.email} onChange={set("email")} className="mt-1 rounded-xl" /></div>
          </div>
        </div>
        <div>
          <Label>{t("profile.language")}</Label>
          <Select value={profile.language} onValueChange={v => setProfile(p => ({ ...p, language: v }))}>
            <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="si">සිංහල</SelectItem>
              <SelectItem value="ta">தமிழ்</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div><Label>{t("profile.bio")}</Label><Textarea rows={2} value={profile.bio} onChange={set("bio")} className="mt-1 rounded-xl" maxLength={280} /></div>

        <Button className="w-full rounded-full" onClick={save}><Save className="mr-2 h-4 w-4" />{t("profile.save")}</Button>
      </div>

      <div className="mt-6 rounded-3xl border border-destructive/20 bg-destructive/5 p-5">
        <h2 className="font-display font-bold text-destructive mb-1">{t("profile.deleteAccount")}</h2>
        <p className="text-sm text-muted-foreground mb-4">{t("profile.deleteConfirm")}</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="rounded-full"><Trash2 className="mr-2 h-4 w-4" />{t("profile.deleteAccount")}</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>{t("profile.deleteConfirm")}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
              <AlertDialogAction className="rounded-full bg-destructive hover:bg-destructive/90" onClick={deleteAccount}>Yes, delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
