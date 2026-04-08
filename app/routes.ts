import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("actions/list-membership", "routes/list-membership.ts"),
  route("actions/save-print", "routes/save-print.ts"),
  route("account", "routes/account.tsx"),
  route("catalog", "routes/catalog.tsx"),
  route("library", "routes/library.tsx"),
  route("prints/:slug/files/:fileIndex/download", "routes/print-download.ts"),
  route("prints/:slug", "routes/print-detail.tsx"),
  route("generators/:slug", "routes/generator-detail.tsx")
] satisfies RouteConfig;
