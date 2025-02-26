'use client';
import { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { Button } from './ui/button';

interface ErrorModalProps {
  title: string;
  messageBody?: string;
  isError: boolean;
  setIsError: Dispatch<SetStateAction<boolean>>;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ title, messageBody, isError, setIsError }) => {
  return (
    <Dialog open={isError} onOpenChange={setIsError}>
      {isError && (
        <DialogContent className="max-h-auto h-auto max-w-[700px] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold text-destructive">{title}</DialogTitle>
            <Separator />
          </DialogHeader>
          <div className="mt-1">{messageBody && <p className="mb-6 text-xl text-destructive">{messageBody}</p>}</div>
          <div className="flex w-full justify-end">
            <Button className="font-bold text-white" onClick={() => setIsError(false)}>
              Aceptar
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
};
