export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Eas system",
  description: "...",
  navItems: [
    {
      label: "Нүүр",
      href: "/",
    },
    {
      label: "Бидний тухай",
      href: "/about",
    },
    {
      label: "Үнэ",
      href: "/pricing",
    },
  ],
  navMenuItems: [
    {
      label: "Нүүр",
      href: "/",
    },
    {
      label: "Бидний тухай",
      href: "/about",
    },
    {
      label: "Үнэ",
      href: "/pricing",
    },
    {
      label: "Нэвтрэх",
      href: "/login",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
