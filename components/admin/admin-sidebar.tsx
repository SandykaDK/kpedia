import {
  Album,
  BarChart3,
  Disc3,
  Film,
  Group,
  HeartPulse,
  Home,
  ListTree,
  UserRound,
  Users,
  Building2,
} from "lucide-react";
import Link from "next/link";

const sections = [
  ["Dashboard", "/admin", Home],
  ["Idols", "/admin/idols", UserRound],
  ["Groups", "/admin/groups", Group],
  ["Agencies", "/admin/agencies", Building2],
  ["Discography", "/admin/albums", Disc3],
  ["Timeline", "/admin/timeline", ListTree],
  ["Media Embeds", "/admin/media", Film],
  ["Users", "/admin/users", Users],
] as const;

export function AdminSidebar() {
  return (
    <aside className="w-full shrink-0 border-b border-zinc-800 bg-zinc-950 text-zinc-100 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-5 py-5 lg:block">
        <Link className="text-xl font-bold" href="/admin">
          K<span className="text-rose-400">Pedia</span>
          <span className="ml-2 text-xs font-normal uppercase tracking-widest text-zinc-500">
            CMS
          </span>
        </Link>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:block lg:space-y-1 lg:px-3">
        {sections.map(([label, href, Icon]) => (
          <Link
            className="flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-400 transition hover:bg-white/5 hover:text-white"
            href={href}
            key={href}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
