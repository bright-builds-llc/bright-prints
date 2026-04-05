import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("catalog", "routes/catalog.tsx"),
  route("prints/:slug", "routes/print-detail.tsx"),
  route("generators/:slug", "routes/generator-detail.tsx")
] satisfies RouteConfig;
