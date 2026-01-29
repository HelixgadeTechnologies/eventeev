type DividerProps = {
    text?: string;
};

export default function Divider({ text = 'OR' }: DividerProps) {
    return (
        <div className="flex items-center justify-center gap-4">
            <span className="h-px w-full bg-gray-200"></span>
            <span className="text-center text-xs text-gray-400 font-medium tracking-widest">{text}</span>
            <span className="h-px w-full bg-gray-200"></span>
        </div>
    )
}