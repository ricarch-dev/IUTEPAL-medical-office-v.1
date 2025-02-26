'use client';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';

interface SuccessModalProps {
  title: string;
  messageBody?: string;
  isSuccess: boolean;
  setIsSuccess: Dispatch<SetStateAction<boolean>>;
  href?: string;
  onClickAccept?: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  title,
  messageBody,
  isSuccess,
  setIsSuccess,
  href,
  onClickAccept,
}) => {
  return (
    <Dialog open={isSuccess} onOpenChange={setIsSuccess}>
      {isSuccess && (
        <DialogContent className="max-h-auto h-auto max-w-[700px] rounded-lg bg-green-200 text-green-600">
          <DialogHeader>
            <DialogTitle className="mb-3 text-3xl font-bold">{title}</DialogTitle>
          </DialogHeader>
          <div className="mt-1">{messageBody && <p className="mb-6 text-lg text-green-700">{messageBody}</p>}</div>
          <div className="flex w-full justify-end">
            {href ? (
              <Link href={href}>
                <Button className="font-bold text-white" onClick={() => setIsSuccess(false)}>
                  Aceptar
                </Button>
              </Link>
            ) : (
              <Button
                className="bg-green-800 font-bold text-white hover:bg-green-700"
                onClick={() => {
                  setIsSuccess(false);
                  if (onClickAccept) {
                    onClickAccept();
                  }
                }}
              >
                Aceptar
              </Button>
            )}
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
