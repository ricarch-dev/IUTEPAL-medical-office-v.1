import { Card, CardTitle } from "@/src/components/ui/card";
import { links } from "@/src/lib/routes";
import Link from "next/link";

export default function Page() {
  return (
    <section className="gap-5 m-auto grid grid-cols-2 w-full h-full">
      {links.slice(1).map((link, index) => {
        const LinkIcon = link.icon;
        return (
          <Link key={index} href={link.href}>
            <Card className="bg-slate-100 cursor-pointer hover:bg-sky-100 transition-all duration-500 py-10 space-y-2">
              <LinkIcon className="w-40 h-14 flex items-center justify-center m-auto text-primary" />
              <CardTitle className="text-2xl font-semibold text-center">{link.name}</CardTitle>
            </Card>
          </Link>
        )
      })}
    </section>
  )
}
