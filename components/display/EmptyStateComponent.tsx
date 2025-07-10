import type { ReactNode } from "react";
import { FcFile } from "react-icons/fc";

type EmptyStateProps = {
    text: string;
    icon?: ReactNode;
}

export default function EmptyState({
    text,
    icon = <FcFile/>,
}: EmptyStateProps) {
    return (
        <section className="flex flex-col justify-center items-center py-28">
            <div className="text-7xl">{icon}</div>
            <p className="text-2xl font-semibold">{text}</p>
        </section>
    )
}