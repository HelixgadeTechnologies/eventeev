import Image from "next/image";

type AnalyticsCardProps = {
    title: string;
    value: number;
    percentage: number;
    icon: string;
    text?: string;
    isCurrency?: boolean;
}

export default function AnalyticsCard({
    title,
    value,
    percentage,
    icon,
    text,
    isCurrency = false,
}: AnalyticsCardProps) {
    return (
        <div className="w-full h-[120px] p-5 bg-white/95 backdrop-blur-xl border border-gray-100 flex justify-between items-center gap-4 rounded-[28px] shadow-sm hover:shadow-lg transition-all duration-300 group">
            <div className="flex flex-col flex-1">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{title}</p>
                <p className="font-black text-2xl text-[#1B1818] tracking-tight leading-none mb-2">
                    {isCurrency && <span className="text-gray-400 font-bold mr-0.5">₦</span>}
                    {value.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-[#26890C] font-black text-[10px]">
                        <div className="h-3 w-3 overflow-hidden relative opacity-70">
                            <Image
                                src={"/icons/chart-up.svg"}
                                alt="Chart"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span>{percentage}%</span>
                    </div>
                    {text && <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{text}</p>}
                </div>
            </div>
            <div className="h-12 w-12 rounded-2xl flex justify-center items-center bg-gray-50/80 border border-gray-100 group-hover:scale-110 group-hover:bg-white transition-all shadow-sm">
                <div className="relative h-6 w-6">
                    <Image
                        src={icon}
                        alt="Icon"
                        fill
                        className="object-contain opacity-80"
                    />
                </div>
            </div>
        </div>
    )
}