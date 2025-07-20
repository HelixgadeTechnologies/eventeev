import Image from "next/image";

type AnalyticsCardProps = {
    title: string;
    value: number;
    percentage: number;
    icon: string;
}

export default function AnalyticsCard({
    title,
    value,
    percentage,
    icon,
}: AnalyticsCardProps) {
    return (
        <div className="w-full h-[110px] p-4 bg-white border border-[#B8C4CE] flex justify-between items-center gap-4 rounded-xl">
            <div className="space-y-2">
                <p className="text-gray-600 text-sm">{title}</p>
                <p className="font-semibold text-xl text-[#344054]">{value}</p>
                {percentage}
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