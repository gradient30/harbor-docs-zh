import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Harbor 中文手册";
const BASE = import.meta.env.BASE_URL || "/";
const IS_PAGES = BASE !== "/";

const THEME_BOOT = `(function(){try{var t=localStorage.getItem("harbor-handbook-theme");if(t!=="light"&&t!=="dark"&&t!=="color")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content:
          "Harbor 官方文档中文版：任意 Agent、任意模型、任意任务、任意沙箱。官网更新即时对照，每次同步单独记日志。",
      },
      { name: "theme-color", content: "#0b1c24" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: `${BASE}favicon.svg` },
      { rel: "stylesheet", href: appCss },
      ...(IS_PAGES
        ? []
        : [
            { rel: "manifest" as const, href: "/__grok/manifest.webmanifest" },
            { rel: "apple-touch-icon" as const, href: "/__grok/icon-180.png" },
          ]),
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Noto+Sans+SC:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="zh-CN" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  ),
});
