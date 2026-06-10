import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const router = createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent", // Preload code and data when hovering over links
    defaultPreloadStaleTime: 30000, // Preload stale time (30 seconds)
  });

  return router;
};
