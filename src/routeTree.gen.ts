/* eslint-disable */
// @ts-nocheck
// Auto-managed route tree. Re-generated on `npm run dev`.

import { Route as RootImport } from "./routes/__root";
import { Route as IndexImport } from "./routes/index";
import { Route as AboutImport } from "./routes/about";
import { Route as ContactImport } from "./routes/contact";
import { Route as DashboardImport } from "./routes/dashboard";
import { Route as DrawingsImport } from "./routes/drawings";
import { Route as DrawingsIdImport } from "./routes/drawings.$id";
import { Route as ForgotPasswordImport } from "./routes/forgot-password";
import { Route as LoginImport } from "./routes/login";
import { Route as MagazineImport } from "./routes/magazine";
import { Route as NotificationsImport } from "./routes/notifications";
import { Route as ProfileImport } from "./routes/profile";
import { Route as ResetPasswordImport } from "./routes/reset-password";
import { Route as SearchImport } from "./routes/search";
import { Route as SignupImport } from "./routes/signup";
import { Route as StoriesImport } from "./routes/stories";
import { Route as StoriesIdImport } from "./routes/stories.$id";
import { Route as SubmitImport } from "./routes/submit";
import { Route as SubmitDrawingImport } from "./routes/submit.drawing";
import { Route as SubmitStoryImport } from "./routes/submit.story";
import { Route as Top3Import } from "./routes/top3";
import { Route as AdminImport } from "./routes/admin/index";
import { Route as AdminOverviewImport } from "./routes/admin/overview";
import { Route as AdminIssuesImport } from "./routes/admin/issues";
import { Route as AdminDrawingsImport } from "./routes/admin/drawings";
import { Route as AdminStoriesImport } from "./routes/admin/stories";
import { Route as AdminTop30Import } from "./routes/admin/top30";
import { Route as AdminTop3Import } from "./routes/admin/top3";
import { Route as AdminBuilderImport } from "./routes/admin/builder";
import { Route as AdminReviewsImport } from "./routes/admin/reviews";
import { Route as AdminUsersImport } from "./routes/admin/users";
import { Route as AdminContentImport } from "./routes/admin/content";
import { Route as AdminInboxImport } from "./routes/admin/inbox";
import { Route as AdminAuditImport } from "./routes/admin/audit";

// Public routes — children of root
const IndexRoute        = IndexImport.update({ path: "/", getParentRoute: () => RootImport } as any);
const AboutRoute        = AboutImport.update({ path: "/about", getParentRoute: () => RootImport } as any);
const ContactRoute      = ContactImport.update({ path: "/contact", getParentRoute: () => RootImport } as any);
const DashboardRoute    = DashboardImport.update({ path: "/dashboard", getParentRoute: () => RootImport } as any);
const DrawingsRoute     = DrawingsImport.update({ path: "/drawings", getParentRoute: () => RootImport } as any);
const DrawingsIdRoute   = DrawingsIdImport.update({ path: "/$id", getParentRoute: () => DrawingsRoute } as any);
const ForgotRoute       = ForgotPasswordImport.update({ path: "/forgot-password", getParentRoute: () => RootImport } as any);
const LoginRoute        = LoginImport.update({ path: "/login", getParentRoute: () => RootImport } as any);
const MagazineRoute     = MagazineImport.update({ path: "/magazine", getParentRoute: () => RootImport } as any);
const NotificationsRoute= NotificationsImport.update({ path: "/notifications", getParentRoute: () => RootImport } as any);
const ProfileRoute      = ProfileImport.update({ path: "/profile", getParentRoute: () => RootImport } as any);
const ResetPasswordRoute= ResetPasswordImport.update({ path: "/reset-password", getParentRoute: () => RootImport } as any);
const SearchRoute       = SearchImport.update({ path: "/search", getParentRoute: () => RootImport } as any);
const SignupRoute        = SignupImport.update({ path: "/signup", getParentRoute: () => RootImport } as any);
const StoriesRoute      = StoriesImport.update({ path: "/stories", getParentRoute: () => RootImport } as any);
const StoriesIdRoute    = StoriesIdImport.update({ path: "/$id", getParentRoute: () => StoriesRoute } as any);
const SubmitRoute       = SubmitImport.update({ path: "/submit", getParentRoute: () => RootImport } as any);
const SubmitDrawingRoute= SubmitDrawingImport.update({ path: "/submit/drawing", getParentRoute: () => RootImport } as any);
const SubmitStoryRoute  = SubmitStoryImport.update({ path: "/submit/story", getParentRoute: () => RootImport } as any);
const Top3Route         = Top3Import.update({ path: "/top3", getParentRoute: () => RootImport } as any);

// Admin layout route + nested children
const AdminRoute        = AdminImport.update({ path: "/admin", getParentRoute: () => RootImport } as any);
const AdminOverviewRoute= AdminOverviewImport.update({ path: "/overview", getParentRoute: () => AdminRoute } as any);
const AdminIssuesRoute  = AdminIssuesImport.update({ path: "/issues", getParentRoute: () => AdminRoute } as any);
const AdminDrawingsRoute= AdminDrawingsImport.update({ path: "/drawings", getParentRoute: () => AdminRoute } as any);
const AdminStoriesRoute = AdminStoriesImport.update({ path: "/stories", getParentRoute: () => AdminRoute } as any);
const AdminTop30Route   = AdminTop30Import.update({ path: "/top30", getParentRoute: () => AdminRoute } as any);
const AdminTop3Route    = AdminTop3Import.update({ path: "/top3", getParentRoute: () => AdminRoute } as any);
const AdminBuilderRoute = AdminBuilderImport.update({ path: "/builder", getParentRoute: () => AdminRoute } as any);
const AdminReviewsRoute = AdminReviewsImport.update({ path: "/reviews", getParentRoute: () => AdminRoute } as any);
const AdminUsersRoute   = AdminUsersImport.update({ path: "/users", getParentRoute: () => AdminRoute } as any);
const AdminContentRoute = AdminContentImport.update({ path: "/content", getParentRoute: () => AdminRoute } as any);
const AdminInboxRoute   = AdminInboxImport.update({ path: "/inbox", getParentRoute: () => AdminRoute } as any);
const AdminAuditRoute   = AdminAuditImport.update({ path: "/audit", getParentRoute: () => AdminRoute } as any);

// Add children to their parents
DrawingsRoute.addChildren([DrawingsIdRoute]);
StoriesRoute.addChildren([StoriesIdRoute]);

AdminRoute.addChildren([
  AdminOverviewRoute, AdminIssuesRoute, AdminDrawingsRoute, AdminStoriesRoute,
  AdminTop30Route, AdminTop3Route, AdminBuilderRoute, AdminReviewsRoute,
  AdminUsersRoute, AdminContentRoute, AdminInboxRoute, AdminAuditRoute,
]);

export const routeTree = RootImport.addChildren([
  IndexRoute, AboutRoute, ContactRoute, DashboardRoute,
  DrawingsRoute, ForgotRoute, LoginRoute, MagazineRoute,
  NotificationsRoute, ProfileRoute, ResetPasswordRoute,
  SearchRoute, SignupRoute, StoriesRoute, SubmitRoute, SubmitDrawingRoute, SubmitStoryRoute,
  Top3Route, AdminRoute,
]);

declare module "@tanstack/react-router" {
  interface FileRoutesByPath {
    "/": { id: "/"; path: "/"; fullPath: "/" };
    "/about": { id: "/about"; path: "/about"; fullPath: "/about" };
    "/contact": { id: "/contact"; path: "/contact"; fullPath: "/contact" };
    "/dashboard": { id: "/dashboard"; path: "/dashboard"; fullPath: "/dashboard" };
    "/drawings": { id: "/drawings"; path: "/drawings"; fullPath: "/drawings" };
    "/drawings/$id": { id: "/drawings/$id"; path: "/$id"; fullPath: "/drawings/$id" };
    "/forgot-password": { id: "/forgot-password"; path: "/forgot-password"; fullPath: "/forgot-password" };
    "/login": { id: "/login"; path: "/login"; fullPath: "/login" };
    "/magazine": { id: "/magazine"; path: "/magazine"; fullPath: "/magazine" };
    "/notifications": { id: "/notifications"; path: "/notifications"; fullPath: "/notifications" };
    "/profile": { id: "/profile"; path: "/profile"; fullPath: "/profile" };
    "/reset-password": { id: "/reset-password"; path: "/reset-password"; fullPath: "/reset-password" };
    "/search": { id: "/search"; path: "/search"; fullPath: "/search" };
    "/signup": { id: "/signup"; path: "/signup"; fullPath: "/signup" };
    "/stories": { id: "/stories"; path: "/stories"; fullPath: "/stories" };
    "/stories/$id": { id: "/stories/$id"; path: "/$id"; fullPath: "/stories/$id" };
    "/submit": { id: "/submit"; path: "/submit"; fullPath: "/submit" };
    "/submit/drawing": { id: "/submit/drawing"; path: "/drawing"; fullPath: "/submit/drawing" };
    "/submit/story": { id: "/submit/story"; path: "/story"; fullPath: "/submit/story" };
    "/top3": { id: "/top3"; path: "/top3"; fullPath: "/top3" };
    "/admin": { id: "/admin"; path: "/admin"; fullPath: "/admin" };
    "/admin/overview": { id: "/admin/overview"; path: "/overview"; fullPath: "/admin/overview" };
    "/admin/issues": { id: "/admin/issues"; path: "/issues"; fullPath: "/admin/issues" };
    "/admin/drawings": { id: "/admin/drawings"; path: "/drawings"; fullPath: "/admin/drawings" };
    "/admin/stories": { id: "/admin/stories"; path: "/stories"; fullPath: "/admin/stories" };
    "/admin/top30": { id: "/admin/top30"; path: "/top30"; fullPath: "/admin/top30" };
    "/admin/top3": { id: "/admin/top3"; path: "/top3"; fullPath: "/admin/top3" };
    "/admin/builder": { id: "/admin/builder"; path: "/builder"; fullPath: "/admin/builder" };
    "/admin/reviews": { id: "/admin/reviews"; path: "/reviews"; fullPath: "/admin/reviews" };
    "/admin/users": { id: "/admin/users"; path: "/users"; fullPath: "/admin/users" };
    "/admin/content": { id: "/admin/content"; path: "/content"; fullPath: "/admin/content" };
    "/admin/inbox": { id: "/admin/inbox"; path: "/inbox"; fullPath: "/admin/inbox" };
    "/admin/audit": { id: "/admin/audit"; path: "/audit"; fullPath: "/admin/audit" };
  }
}

// ── Buy route (appended) ──────────────────────────────────────────
// Import at top of file is not possible here; we patch the module exports below.
// The TanStack Router CLI will regenerate this file correctly on `npm run dev`.
// For now the route is declared in buy.tsx itself via createFileRoute("/buy").
