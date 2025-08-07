import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src?: string;
  name: string;
  href?: string;
  isBigger?: boolean;
};

const bgColors = [
  "bg-red-500",
  "bg-green-500",
  "bg-blue-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
  "bg-peach-500",
];

function getInitials(fullName?: string) {
  if (!fullName) return "";

  const parts = fullName.trim().split(/\s+/); // split on spaces
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const second = parts[1]?.charAt(0).toUpperCase() || "";

  return first + second;
}


function getColorFromName(name?: string) {
  if (!name) return bgColors[0];
  const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return bgColors[charCodeSum % bgColors.length];
}

export default function Avatar({ src, name, href = "/profile", isBigger }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <Link href={href}>
      {src ? (
        <div className={`${isBigger ? 'h-10 w-10 md:h-[50px] md:w-[50px]' : 'h-[30px] w-[30px] md:h-10 md:w-10'} rounded-full overflow-hidden`}>
          <Image
            src={src}
            alt="Profile picture"
            width={40}
            height={40}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      ) : (
        <div
          className={`${isBigger ? 'h-10 w-10 md:h-[50px] md:w-[50px]' : 'h-[30px] w-[30px] md:h-10 md:w-10'} rounded-full flex justify-center items-center text-xs md:text-sm font-medium text-white ${bgColor}`}
        >
          <span>{initials}</span>
        </div>
      )}
    </Link>
  );
}
