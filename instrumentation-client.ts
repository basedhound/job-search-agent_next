import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://eu.posthog.com",
  capture_exceptions: true,
  capture_dead_clicks: false,
  debug: process.env.NODE_ENV === "development",
});
