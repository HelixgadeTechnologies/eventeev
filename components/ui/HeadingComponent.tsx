type HeadingProps = {
    heading: string;
    subtitle?: string;
    isBigger?: boolean;
    className?: string;
}

export default function Heading({ heading, subtitle, isBigger = false, className, }: HeadingProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <p className={`text-gray-900 font-semibold ${isBigger ? 'text-xl' : 'text-lg'}`}>{heading}</p>
            {subtitle && <p className={`text-gray-500 font-normal ${isBigger ? 'text-base' : 'text-sm'}`}>{subtitle}</p>}
        </div>
    )
}