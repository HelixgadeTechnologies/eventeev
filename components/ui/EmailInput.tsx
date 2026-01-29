import { IconType } from "react-icons";

type InputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  name: string;
  type?: string;
  Icon?: IconType;
}

export default function InputComponent ({
  value,
  onChange,
  placeholder = "johndoe90@gmail.com",
  label,
  name,
  type = "text",
  Icon,
}: InputProps) {
  return (
    <div className="space-y-2">
        {label && <label htmlFor={name} className="text-sm font-bold text-[#1B1818] block">{label}</label>}
        <div className="relative font-sans">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98A2B3] text-xl">
              <Icon />
            </div>
          )}
          <input
            type={type}
            id={name}
            value={value}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full border border-[#D0D5DD] rounded-xl h-11 outline-none placeholder:text-[#98A2B3] font-normal text-sm focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017]/10 transition-all duration-200 ${Icon ? 'pl-11 pr-4' : 'px-4'}`}
            autoComplete="email"
          />
        </div>
    </div>
  );
}