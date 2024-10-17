import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }]
  ],
  base: "/fup-node/",
  title: "FupNode Documentation",
  description: "Documentation for the fup-node package",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: "./images/logo.png",
    nav: [
      { text: "Home", link: "/" },
      { text: "Documentation", link: "/documentation/general-config" },
      { text: "API Examples", link: "/api-examples" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Get started", link: "/get-started" },
          { text: "API Examples", link: "/api-examples" },
        ],
      },
      {
        text: "Documentation",
        items: [
          { text: "General configuration", link: "/documentation/general-config" },
          { text: "Upload file", link: "/documentation/upload-file" },
          { text: "Upload multiple files", link: "/documentation/upload-multiple-files" },
          { text: "Get files", link: "/documentation/get-files" },
          { text: "Usage in the frontend", link: "/documentation/frontend" }
        ],
      },
      {
        text: "Middlewares",
        items: [
          { text: "About middlewares", link: "/middlewares/middlewares" },
        ],
      },
      {
        text: "Middlewares created",
        items: [
          { text: "Middleware watermark", link: "/middlewares/watermark" },
          { text: "Middleware optimization", link: "/middlewares/optimization" },
          { text: "Middleware encryption", link: "/middlewares/encryption" },
        ],
      },
      {
        text: "Utilities",
        items: [
          { text: "Fast test utility", link: "/utilities/fup-node-tester" },
        ],
      }
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/daniel1zzz" },
      { icon: "x", link: "https://x.com/daniel1zzz"}
    ],
  },
});
