import React, { useState } from "react";
import { Button } from "./ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";

interface DeleteEventModalProps {
    children: React.ReactNode;
    onDelete: (id: string) => Promise<void>;
    id: string;
}

export const DeleteEventModal: React.FC<DeleteEventModalProps> = ({ children, onDelete, id }) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Eliminar evento</DialogTitle>
                </DialogHeader>
                <p>¿Estás seguro de que deseas eliminar este evento?</p>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" >Cancelar</Button>
                    </DialogClose>
                    <Button variant="destructive" onClick={() => onDelete(id)} id={id}>Eliminar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};