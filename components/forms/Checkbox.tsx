type CheckboxProps = {
    label: string;
    name: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Checkbox({
    label,
    name,
    checked,
    onChange,
}: CheckboxProps) {
    return (
        <label className="flex items-center space-x-0.5 md:space-x-2">
            <input
                type="checkbox"
                name={name}
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 text-[#eb5017] border-gray-300 rounded focus:ring-[#eb5017] accent-[#eb5017]"
            />
            <span className="text-gray-600 text-xs whitespace-nowrap">{label}</span>
        </label>
    );
}