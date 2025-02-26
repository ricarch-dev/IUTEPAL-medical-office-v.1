'use client';
import RealTimeDate from '@/src/components/datetime';
import IconNotification from '@/src/components/icon-notification';
import NavMobile from '@/src/components/nav-mobile';
import { ProfileDropdown } from '@/src/components/profile-dropdown';
import SideNav from '@/src/components/side-nav';
import { Separator } from '@/src/components/ui/separator';
import { links } from '@/src/lib/routes';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentLink = links.find((link) => link.href === pathname);
  const pageTitle = currentLink ? currentLink.name : 'Dashboard';
  return (
    <>
      {/* Static sidebar for desktop */}
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <SideNav />

      <section className="lg:pl-72">
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          {/* Mobile sidebar */}
          <NavMobile />

          <Separator className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <h2 className="mt-4 flex-1 text-2xl font-semibold">{pageTitle}</h2>
            <RealTimeDate />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <IconNotification />

              <Separator className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

              {/* Profile dropdown */}
              <ProfileDropdown />
            </div>
          </div>
        </div>

        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </section>
    </>
  );
}
