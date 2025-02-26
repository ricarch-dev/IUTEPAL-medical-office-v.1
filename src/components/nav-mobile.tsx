import { AlignJustify } from 'lucide-react';
import Image from 'next/image';
import logo from '@/public/image/iutepal-logo.png';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import NavLinks from './ui/nav-link';

interface NavMobileProps {
  title?: string;
}

const NavMobile = ({ title }: NavMobileProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'link'} className="text-brand-blue border-b-0 p-2.5 lg:hidden">
          <span className="sr-only">Abrir Sidebar</span>
          <AlignJustify className="size-6" aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent side={'left'} className="bg-white">
        <SheetHeader>
          <SheetTitle>
            <Image alt="Plan Seguro" className="h-20 w-full object-contain" src={logo} />
          </SheetTitle>
        </SheetHeader>
        <div className="my-5 flex grow flex-row space-x-2 md:flex-col md:space-x-0 md:space-y-2">
          <NavLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
};
export default NavMobile;
