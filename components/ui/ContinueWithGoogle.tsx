import { FcGoogle } from "react-icons/fc";

export default function ContinueWithGoogle() {
    return (
        <div className="rounded-xl h-12 w-full px-6 flex items-center justify-center border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm group">
            <FcGoogle className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-base font-bold">Continue with Google</span>
        </div>
    )
}