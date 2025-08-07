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
        <div className="w-full h-[110px] p-4 bg-white border border-[#B8C4CE] flex justify-between items-center gap-4 rounded-xl">
            <div className="space-y-2">
                <p className="text-gray-600 text-sm">{title}</p>
                <p className="font-semibold text-xl text-[#344054]">{isCurrency && '₦'}{value}</p>
                <div className="flex items-center gap-1.5">
                    <div className="bg-green-50 rounded-[10px] p-1 flex gap-0.5 text-green-700">
                        <div className="h-3 w-3 overflow-hidden relative">
                            <Image
                            src={"/icons/chart-up.svg"}
                            alt="Chart"
                            fill
                            className="object-cover"
                            />
                        </div>
                        <span className="text-xs">{percentage}%</span>
                    </div>
                    <p className="text-xs text-green-700">{text}</p>
                </div>
            </div>
            <div className="h-10 w-10 rounded-full flex justify-center items-center border border-[#B8C4CE]">
                <Image
                src={icon}
                alt="Icon"
                height={18}
                width={18}
                />
            </div>
        </div>
    )
}