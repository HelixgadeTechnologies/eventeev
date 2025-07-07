import Image from "next/image";
import Link from "next/link";

type AvatarProps = {
  src?: string;
  name?: string;
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
  const parts = fullName.trim().split(" ");
  const first = parts[0]?.charAt(0).toUpperCase() || "";
  const last = parts[1]?.charAt(0).toUpperCase() || "";
  return first + last;
}

function getColorFromName(name?: string) {
  if (!name) return bgColors[0];
  const charCodeSum = name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return bgColors[charCodeSum % bgColors.length];
}

export default function Avatar({ src, name }: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getColorFromName(name);

  return (
    <Link href="/user/profile/all">
      {src ? (
        <div className="h-[40px] w-[40px] rounded-full overflow-hidden">
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
          className={`h-10 w-10 rounded-full flex justify-center items-center text-sm font-medium text-white ${bgColor}`}
        >
          <span>{initials}</span>
        </div>
      )}
    </Link>
  );
}
