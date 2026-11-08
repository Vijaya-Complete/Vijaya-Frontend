import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarClock } from "lucide-react";

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86400000);
  const h = Math.floor((ms % 86400000) / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return { d, h, m, s };
}

export function CountdownBanner({ issueName, deadlineIso }: { issueName: string; deadlineIso: string }) {
  const { t } = useTranslation();
  const target = new Date(deadlineIso);
  const [time, setTime] = useState(() => diff(target));
  useEffect(() => {
    const id = setInterval(() => setTime(diff(target)), 1000);
    return () => clearInterval(id);
  }, [deadlineIso]);

  const Cell = ({ n, label }: { n: number; label: string }) => (
    <div className="flex flex-col items-center rounded-2xl bg-card/80 px-3 py-2 shadow-sm min-w-14">
      <span className="font-display text-2xl font-bold text-primary tabular-nums">
        {String(n).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-primary/20 bg-gradient-to-r from-sunshine/40 via-blush/30 to-mint/30 p-5 md:flex-row md:p-6 shadow-playful">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground">
          <CalendarClock className="h-6 w-6" />
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-primary/80">
            {t("home.activeIssue")}
          </div>
          <div className="font-display text-xl font-bold">{issueName}</div>
          <div className="text-sm text-muted-foreground">{t("home.deadline")}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <Cell n={time.d} label={t("days")} />
        <Cell n={time.h} label={t("hours")} />
        <Cell n={time.m} label={t("minutes")} />
        <Cell n={time.s} label={t("seconds")} />
      </div>
    </div>
  );
}
