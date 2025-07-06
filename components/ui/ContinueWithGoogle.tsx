import { FcGoogle } from "react-icons/fc";

export default function ContinueWithGoogle() {
    return (
        <div className="rounded-[8px] h-11 w-full px-5 md:px-6 leading-6 hover:cursor-pointer border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors duration-300">
            <FcGoogle className="inline-block mr-2 text-2xl" />
            <span className="text-sm font-semibold">Continue with Google</span>
        </div>
    )
}