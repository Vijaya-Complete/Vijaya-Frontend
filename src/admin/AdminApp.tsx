import { useState, useEffect } from "react";
import { AdminLayout, type AdminPage } from "./components/AdminLayout";
import { Overview }  from "./pages/Overview";
import { Drawings }  from "./pages/Drawings";
import { Stories }   from "./pages/Stories";
import { Top30 }     from "./pages/Top30";
import { Top3 }      from "./pages/Top3";
import { Builder }   from "./pages/Builder";
import { Reviews }   from "./pages/Reviews";
import { Users }     from "./pages/Users";
import { Issues }    from "./pages/Issues";
import { Content }   from "./pages/Content";
import { Inbox }     from "./pages/Inbox";
import { Audit }     from "./pages/Audit";
import { Revenue }   from "./pages/Revenue";
import { getSession } from "@/lib/auth";
import "@/styles.css";
import "@/lib/i18n";

export function AdminApp() {
  const [page, setPage]   = useState<AdminPage>("overview");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const user = getSession();
    if (!user || user.role !== "admin") {
      window.location.href = "/";
      return;
    }
    setReady(true);
  }, []);

  if (!ready) return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="font-display text-3xl font-bold text-primary animate-pulse">Vijaya</div>
        <div className="text-sm text-muted-foreground mt-1">Loading editor's desk…</div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (page) {
      case "overview":  return <Overview onNav={setPage} />;
      case "drawings":  return <Drawings />;
      case "stories":   return <Stories />;
      case "top30":     return <Top30 />;
      case "top3":      return <Top3 />;
      case "builder":   return <Builder />;
      case "reviews":   return <Reviews />;
      case "users":     return <Users />;
      case "issues":    return <Issues />;
      case "content":   return <Content />;
      case "inbox":     return <Inbox />;
      case "audit":     return <Audit />;
      case "revenue":   return <Revenue />;
      default:          return <Overview onNav={setPage} />;
    }
  };

  return (
    <AdminLayout current={page} onNav={setPage}>
      {renderPage()}
    </AdminLayout>
  );
}
