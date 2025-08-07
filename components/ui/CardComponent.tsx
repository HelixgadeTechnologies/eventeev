'use client';


type CardProps = {
  children: React.ReactNode;
  height?: string;
};

export default function CardComponent({ 
    children,
    height = "fit-content"
}: CardProps) {
  return (
    <div className="w-full bg-white border border-[#B8C4CE] py-4 rounded-xl" style={{height: height}}>
        { children }
    </div>
  );
}