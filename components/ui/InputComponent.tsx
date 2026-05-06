type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label: string;
  name: string
}

export default function InputComponent ({
  value,
  onChange,
  placeholder = "John Doe",
  label = "Name",
  name,
}: InputProps) {
  return (
    <div className="space-y-2">
        <label htmlFor={name} className="text-sm font-bold text-[#1B1818] block">{label}</label>
        <input
        type="text"
        id={name}
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-[#D0D5DD] rounded-xl px-4 h-11 outline-none placeholder:text-[#98A2B3] font-normal text-sm focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017]/10 transition-all duration-200"
        autoComplete="text"
        />
    </div>
  );

}