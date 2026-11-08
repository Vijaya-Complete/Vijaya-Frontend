import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Package, FileText, MapPin, CreditCard, Building2, Truck, CheckCircle2, ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/buy")({
  head: () => ({ meta: [{ title: "Buy Magazine — Vijaya" }] }),
  component: BuyPage,
});

// ── Pricing constants ────────────────────────────────────────────
const PRICE_PHYSICAL    = 350;
const PRICE_PDF         = 150;
const DELIVERY_COLOMBO  = 300;
const DELIVERY_OUTSIDE  = 500;

const ISSUES = ["Issue 47 (Latest)", "Issue 46", "Issue 45", "Issue 44"];
type Format  = "physical"|"pdf";
type Payment = "card"|"bank"|"cod";
type Step    = 1|2|3|4;

const fmt = (n: number) => `Rs. ${n.toLocaleString()}`;
const STEPS = ["Choose","Details","Payment","Confirm"];

function BuyPage() {
  const { t } = useTranslation();
  const [step,    setStep]    = useState<Step>(1);
  const [issue,   setIssue]   = useState(ISSUES[0]);
  const [format,  setFormat]  = useState<Format>("physical");
  const [copies,  setCopies]  = useState(1);
  const [zone,    setZone]    = useState<"colombo"|"outside">("colombo");
  const [addr,    setAddr]    = useState({ name:"", email:"", phone:"", line1:"", line2:"", city:"", district:"" });
  const [payment, setPayment] = useState<Payment>("card");
  const [card,    setCard]    = useState({ number:"", expiry:"", cvv:"", holder:"" });
  const [placed,  setPlaced]  = useState(false);

  const deliveryFee = format==="physical" ? (zone==="colombo" ? DELIVERY_COLOMBO : DELIVERY_OUTSIDE) : 0;
  const subtotal    = format==="physical" ? PRICE_PHYSICAL * copies : PRICE_PDF;
  const total       = subtotal + deliveryFee;
  const sa = (k:string) => (e:React.ChangeEvent<HTMLInputElement>) => setAddr(p=>({...p,[k]:e.target.value}));

  const next = () => {
    if (step===2 && !addr.email.trim()) return toast.error(t("buy.email")+" required");
    if (step===2 && format==="physical" && !addr.line1.trim()) return toast.error(t("buy.addressLine1")+" required");
    setStep(s => (s+1) as Step);
  };
  const placeOrder = () => {
    if (payment==="card" && (!card.number||!card.expiry||!card.cvv)) return toast.error("Please fill in all card details");
    setPlaced(true);
  };

  // ── Success screen ──────────────────────────────────────────────
  if (placed) return (
    <div className="mx-auto max-w-lg px-6 py-16 text-center">
      <div className="text-6xl mb-4">🎉</div>
      <h1 className="font-display text-3xl font-bold mb-2">{t("buy.success.title")}</h1>
      <p className="text-muted-foreground mb-2">{t("buy.success.body")}</p>
      <p className="text-sm text-muted-foreground mb-6">A confirmation has been sent to <strong>{addr.email}</strong>.</p>
      <div className="rounded-3xl border border-border/60 bg-card p-5 text-left mb-6 shadow-playful">
        <div className="font-display font-bold mb-3">Order summary</div>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Issue</span><span>{issue}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Format</span><span className="capitalize">{format}</span></div>
          {format==="physical"&&<div className="flex justify-between"><span className="text-muted-foreground">Copies</span><span>{copies}</span></div>}
          {format==="physical"&&<div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{fmt(deliveryFee)}</span></div>}
          <div className="flex justify-between border-t border-border/40 pt-2 mt-2 font-bold"><span>Total paid</span><span className="text-primary">{fmt(total)}</span></div>
        </div>
      </div>
      <Button asChild className="rounded-full w-full shadow-playful"><a href="/">{t("buy.success.home")}</a></Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary mb-3">
          <ShoppingBag className="h-4 w-4"/> {t("buy.title")}
        </div>
        <h1 className="font-display text-3xl font-bold">{t("buy.subtitle")}</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {STEPS.map((label,i)=>{
          const n=(i+1) as Step; const active=step===n; const done=step>n;
          return(
            <div key={label} className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1">
                <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-bold transition-all ${done?"bg-mint text-teal-800":active?"bg-primary text-primary-foreground shadow-playful":"bg-secondary text-muted-foreground"}`}>
                  {done?"✓":n}
                </div>
                <span className={`text-xs font-semibold hidden sm:block ${active?"text-primary":"text-muted-foreground"}`}>{label}</span>
              </div>
              {i<STEPS.length-1&&<div className={`h-0.5 w-8 rounded-full mb-4 transition-all ${done?"bg-primary":"bg-border"}`}/>}
            </div>
          );
        })}
      </div>

      {/* ── STEP 1: Issue + Format ─────────────────────────────── */}
      {step===1&&(
        <div className="space-y-5">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <h2 className="font-display text-lg font-bold mb-4">{t("buy.chooseIssue")}</h2>
            <div className="grid gap-2">
              {ISSUES.map(iss=>(
                <button key={iss} onClick={()=>setIssue(iss)}
                  className={`flex items-center justify-between rounded-2xl border-2 px-4 py-3 text-left transition-all ${issue===iss?"border-primary bg-primary/5 shadow-playful":"border-border/60 hover:border-primary/30"}`}>
                  <span className="font-semibold text-sm">{iss}</span>
                  {issue===iss&&<CheckCircle2 className="h-5 w-5 text-primary"/>}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <h2 className="font-display text-lg font-bold mb-4">{t("buy.chooseFormat")}</h2>
            <div className="grid grid-cols-2 gap-4">
              {([["physical","📦",t("buy.physical"),t("buy.physicalDesc"),PRICE_PHYSICAL,"per copy"],["pdf","📄",t("buy.pdf"),t("buy.pdfDesc"),PRICE_PDF,"one-time"]] as const).map(([val,,label,desc,price,unit])=>(
                <button key={val} onClick={()=>setFormat(val as Format)}
                  className={`card-lift rounded-2xl border-2 p-5 text-center transition-all ${format===val?"border-primary bg-primary/5 shadow-playful":"border-border/60 hover:border-primary/30"}`}>
                  <div className="text-3xl mb-2">{val==="physical"?"📦":"📄"}</div>
                  <div className="font-display font-bold">{label}</div>
                  <div className="text-xs text-muted-foreground mt-1">{desc}</div>
                  <div className="mt-3 font-bold text-primary">{fmt(price)}</div>
                  <div className="text-xs text-muted-foreground">{unit}</div>
                </button>
              ))}
            </div>

            {format==="physical"&&(
              <div className="mt-5 space-y-4 border-t border-border/40 pt-5">
                {/* Copies counter */}
                <div>
                  <Label>{t("buy.copies")}</Label>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={()=>setCopies(c=>Math.max(1,c-1))} className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-secondary transition font-bold text-lg">−</button>
                    <span className="font-display text-2xl font-bold w-8 text-center">{copies}</span>
                    <button onClick={()=>setCopies(c=>Math.min(10,c+1))} className="h-9 w-9 rounded-full border border-border grid place-items-center hover:bg-secondary transition font-bold text-lg">+</button>
                    <span className="text-sm text-muted-foreground ml-1">max 10</span>
                  </div>
                </div>
                {/* Delivery zone */}
                <div>
                  <Label>{t("buy.deliveryZone")}</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {([["colombo",t("buy.colombo"),fmt(DELIVERY_COLOMBO)],["outside",t("buy.outside"),fmt(DELIVERY_OUTSIDE)]] as const).map(([val,label,fee])=>(
                      <button key={val} onClick={()=>setZone(val as "colombo"|"outside")}
                        className={`rounded-2xl border-2 px-4 py-3 text-left transition-all ${zone===val?"border-primary bg-primary/5":"border-border/60 hover:border-primary/30"}`}>
                        <div className="font-semibold text-sm">{label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">Delivery: {fee}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price summary */}
          <div className="rounded-2xl bg-secondary/50 border border-border/60 px-5 py-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {format==="physical"?`${copies} × ${fmt(PRICE_PHYSICAL)}${deliveryFee?` + ${fmt(deliveryFee)} delivery`:""}`:"PDF download"}
            </div>
            <div className="font-display text-xl font-bold text-primary">{fmt(total)}</div>
          </div>
          <Button className="w-full rounded-full shadow-playful" onClick={next}>{t("buy.next")} <ArrowRight className="ml-2 h-4 w-4"/></Button>
        </div>
      )}

      {/* ── STEP 2: Contact + Address ──────────────────────────── */}
      {step===2&&(
        <div className="space-y-5">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><MapPin className="h-5 w-5 text-primary"/>{t("buy.yourDetails")}</h2>
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>{t("buy.fullName")} *</Label><Input value={addr.name} onChange={sa("name")} className="mt-1 rounded-xl" placeholder="Nimal Perera"/></div>
                <div><Label>{t("buy.email")} *</Label><Input type="email" value={addr.email} onChange={sa("email")} className="mt-1 rounded-xl" placeholder="you@example.com"/></div>
              </div>
              <div><Label>{t("buy.phone")}</Label><Input type="tel" value={addr.phone} onChange={sa("phone")} className="mt-1 rounded-xl" placeholder="+94 77 000 0000"/></div>
              {format==="physical"&&(
                <div className="border-t border-border/40 pt-4 space-y-3">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Truck className="h-3.5 w-3.5"/>{t("buy.deliveryAddress")}</div>
                  <div><Label>{t("buy.addressLine1")} *</Label><Input value={addr.line1} onChange={sa("line1")} className="mt-1 rounded-xl" placeholder="No. 123, Flower Road"/></div>
                  <div><Label>{t("buy.addressLine2")}</Label><Input value={addr.line2} onChange={sa("line2")} className="mt-1 rounded-xl" placeholder="Apartment, floor, etc."/></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><Label>{t("buy.city")} *</Label><Input value={addr.city} onChange={sa("city")} className="mt-1 rounded-xl" placeholder="Colombo"/></div>
                    <div><Label>{t("buy.district")}</Label><Input value={addr.district} onChange={sa("district")} className="mt-1 rounded-xl" placeholder="Western"/></div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={()=>setStep(1)}><ArrowLeft className="mr-2 h-4 w-4"/>{t("buy.back")}</Button>
            <Button className="flex-1 rounded-full shadow-playful" onClick={next}>{t("buy.next")} <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        </div>
      )}

      {/* ── STEP 3: Payment ────────────────────────────────────── */}
      {step===3&&(
        <div className="space-y-5">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2"><CreditCard className="h-5 w-5 text-primary"/>{t("buy.paymentMethod")}</h2>
            <div className="grid gap-3 mb-5">
              {([
                {id:"card" as Payment,icon:<CreditCard className="h-5 w-5"/>,label:t("buy.card"),desc:t("buy.cardDesc"),disabled:false},
                {id:"bank" as Payment,icon:<Building2  className="h-5 w-5"/>,label:t("buy.bank"),desc:t("buy.bankDesc"),disabled:false},
                {id:"cod"  as Payment,icon:<Truck       className="h-5 w-5"/>,label:t("buy.cod"), desc:t("buy.codDesc"), disabled:format==="pdf"},
              ]).map(m=>(
                <button key={m.id} onClick={()=>!m.disabled&&setPayment(m.id)} disabled={m.disabled}
                  className={`flex items-center gap-4 rounded-2xl border-2 px-4 py-3 text-left transition-all ${m.disabled?"opacity-40 cursor-not-allowed border-border/40":payment===m.id?"border-primary bg-primary/5 shadow-playful":"border-border/60 hover:border-primary/30"}`}>
                  <div className={`h-10 w-10 rounded-2xl grid place-items-center flex-shrink-0 ${payment===m.id?"bg-primary text-primary-foreground":"bg-secondary text-muted-foreground"}`}>{m.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{m.label}</div>
                    <div className="text-xs text-muted-foreground">{m.desc}{m.disabled?" — not available for PDF":""}</div>
                  </div>
                  {payment===m.id&&<CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0"/>}
                </button>
              ))}
            </div>

            {payment==="card"&&(
              <div className="space-y-3 border-t border-border/40 pt-4">
                <div><Label>{t("buy.cardNumber")}</Label><Input value={card.number} onChange={e=>setCard(c=>({...c,number:e.target.value}))} className="mt-1 rounded-xl font-mono" placeholder="1234 5678 9012 3456" maxLength={19}/></div>
                <div><Label>{t("buy.cardHolder")}</Label><Input value={card.holder} onChange={e=>setCard(c=>({...c,holder:e.target.value}))} className="mt-1 rounded-xl" placeholder="NIMAL PERERA"/></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>{t("buy.expiry")}</Label><Input value={card.expiry} onChange={e=>setCard(c=>({...c,expiry:e.target.value}))} className="mt-1 rounded-xl font-mono" placeholder="MM/YY" maxLength={5}/></div>
                  <div><Label>{t("buy.cvv")}</Label><Input type="password" value={card.cvv} onChange={e=>setCard(c=>({...c,cvv:e.target.value}))} className="mt-1 rounded-xl font-mono" placeholder="•••" maxLength={4}/></div>
                </div>
              </div>
            )}
            {payment==="bank"&&(
              <div className="rounded-2xl bg-secondary/50 border border-border/60 p-4 text-sm space-y-1.5 mt-2">
                <div className="font-bold mb-2">{t("buy.bankDetails")}</div>
                {[["Bank","Bank of Ceylon"],["Branch","Colombo Main"],["Account Name","Vijaya Magazine"],["Account No.","1234567890"]].map(([k,v])=>(
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-semibold">{v}</span></div>
                ))}
                <p className="text-xs text-muted-foreground mt-3">{t("buy.bankNote")}</p>
              </div>
            )}
            {payment==="cod"&&(
              <div className="rounded-2xl bg-sunshine/20 border border-sunshine/40 p-4 text-sm mt-2">
                <p className="font-semibold mb-1">{t("buy.codNote")}</p>
                <p className="text-muted-foreground text-xs">{t("buy.codDesc2")}</p>
              </div>
            )}
          </div>

          {/* Order recap */}
          <div className="rounded-2xl border border-border/60 bg-card px-5 py-4 space-y-2">
            <div className="font-display font-bold mb-2">Order summary</div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">{issue} — {format==="physical"?"Physical":"PDF"}</span><span>{fmt(subtotal)}</span></div>
            {deliveryFee>0&&<div className="flex justify-between text-sm"><span className="text-muted-foreground">Delivery ({zone==="colombo"?"Colombo":"Outside Colombo"})</span><span>{fmt(deliveryFee)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-border/40 pt-2 mt-1"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={()=>setStep(2)}><ArrowLeft className="mr-2 h-4 w-4"/>{t("buy.back")}</Button>
            <Button className="flex-1 rounded-full shadow-playful" onClick={next}>{t("buy.review")} <ArrowRight className="ml-2 h-4 w-4"/></Button>
          </div>
        </div>
      )}

      {/* ── STEP 4: Confirm ────────────────────────────────────── */}
      {step===4&&(
        <div className="space-y-5">
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-playful">
            <h2 className="font-display text-lg font-bold mb-5">{t("buy.confirmOrder")}</h2>
            <div className="space-y-3 text-sm">
              {/* Magazine details */}
              <div className="rounded-2xl bg-secondary/40 p-4 space-y-2">
                <div className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-2">Magazine</div>
                <div className="flex justify-between"><span className="text-muted-foreground">Issue</span><span className="font-semibold">{issue}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Format</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${format==="physical"?"bg-sunshine/40 text-sunshine-foreground":"bg-primary/10 text-primary"}`}>
                    {format==="physical"?"📦 Physical":"📄 PDF"}
                  </span>
                </div>
                {format==="physical"&&<>
                  <div className="flex justify-between"><span className="text-muted-foreground">Copies</span><span className="font-semibold">{copies}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Zone</span><span className="font-semibold">{zone==="colombo"?"Colombo":"Outside Colombo"}</span></div>
                </>}
              </div>
              {/* Contact */}
              <div className="rounded-2xl bg-secondary/40 p-4 space-y-2">
                <div className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-2">Contact</div>
                <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="font-semibold">{addr.name||"—"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-semibold">{addr.email}</span></div>
                {addr.phone&&<div className="flex justify-between"><span className="text-muted-foreground">Phone</span><span className="font-semibold">{addr.phone}</span></div>}
                {format==="physical"&&addr.line1&&(
                  <div className="flex justify-between gap-4">
                    <span className="text-muted-foreground flex-shrink-0">Address</span>
                    <span className="font-semibold text-right">{[addr.line1,addr.line2,addr.city,addr.district].filter(Boolean).join(", ")}</span>
                  </div>
                )}
              </div>
              {/* Payment */}
              <div className="rounded-2xl bg-secondary/40 p-4 space-y-2">
                <div className="font-bold text-muted-foreground text-xs uppercase tracking-wider mb-2">Payment</div>
                <div className="flex justify-between"><span className="text-muted-foreground">Method</span><span className="font-semibold">{payment==="card"?"Credit / Debit Card":payment==="bank"?"Bank Transfer":"Cash on Delivery"}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{fmt(subtotal)}</span></div>
                {deliveryFee>0&&<div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>{fmt(deliveryFee)}</span></div>}
                <div className="flex justify-between font-bold text-base border-t border-border/40 pt-2 mt-1"><span>Total</span><span className="text-primary">{fmt(total)}</span></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-center text-muted-foreground px-4">{t("buy.terms")}</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 rounded-full" onClick={()=>setStep(3)}><ArrowLeft className="mr-2 h-4 w-4"/>{t("buy.back")}</Button>
            <Button className="flex-1 rounded-full shadow-playful" onClick={placeOrder}><CheckCircle2 className="mr-2 h-4 w-4"/>{t("buy.placeOrder")}</Button>
          </div>
        </div>
      )}
    </div>
  );
}
