"use client";

import Modal from "../ui/Modal";

type AddProps = {
    isOpen: boolean;
    onClose:  () => void;
}

export default function AddTickets({
    isOpen,
    onClose,
}: AddProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            add
        </Modal>
    )
}