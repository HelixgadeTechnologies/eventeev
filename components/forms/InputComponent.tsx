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
  placeholder = "Enter your name",
  label = "Name",
  name,
}: InputProps) {
  return (
    <div className="space-y-1.5 md:space-y-2">
        <label htmlFor="" className="text-sm font-medium leading-6 block">{label}</label>
        <input
        type="text"
        value={value}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border border-gray-400 rounded-[6px] px-3 h-10 md:h-12 outline-none placeholder:text-gray-400 placeholder:font-light font-normal text-sm leading-6 focus:border-[#eb5017] focus:ring-1 focus:ring-[#eb5017] focus:outline-none transition duration-200 capitalize"
        autoComplete="text"
        />
    </div>
  );

}