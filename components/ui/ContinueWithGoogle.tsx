import { FcGoogle } from "react-icons/fc";
import { useTranslations } from "next-intl";

export default function ContinueWithGoogle() {
    const t = useTranslations('Auth');
    
    const handleGoogleLogin = () => {
        const API_BASE_URL = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:5000' 
            : 'https://eventeevapi.onrender.com';
        
        window.location.href = `${API_BASE_URL}/api/auth/google`;
    };
    
    return (
        <div 
            onClick={handleGoogleLogin}
            className="rounded-xl h-12 w-full px-6 flex items-center justify-center border border-[#D0D5DD] bg-white text-[#344054] hover:bg-gray-50 transition-all duration-200 cursor-pointer shadow-sm group"
        >
            <FcGoogle className="text-2xl mr-3 group-hover:scale-110 transition-transform" />
            <span className="text-base font-bold">{t('continueWithGoogle')}</span>
        </div>
    )
}