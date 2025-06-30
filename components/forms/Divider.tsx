type DividerProps = {
    text?: string;
};

export default function Divider({ text =  'Or' }: DividerProps) {
    return (
        <div className="flex items-center justify-center gap-2.5">
            <span className="h-1 w-full border-t border-gray-300"></span>
            <span className="text-center text-sm text-gray-500 leading-6 ">{text}</span>
            <span className="h-1 w-full border-t border-gray-300"></span>
        </div>
    )
}