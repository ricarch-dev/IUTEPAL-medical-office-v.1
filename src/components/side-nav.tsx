import Link from 'next/link';
import NavLinks from './ui/nav-link';
import logo from '@/public/image/iutepal-logo.png';
import Image from 'next/image';

export default function SideNav() {
  return (
    <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <section className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-100 px-6 pb-4">
        <Link href="/">
          <div className="flex h-20 shrink-0 items-center">
            <Image src={logo} width={40} height={32} alt="imagen logo" />
            <h2 className="ml-5 text-2xl font-bold">IUTEPAL</h2>
          </div>
        </Link>
        <div className="bg flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks />
        </div>
      </section>
    </aside>
  );
}
