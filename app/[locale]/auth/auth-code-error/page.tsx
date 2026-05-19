import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineExclamationCircle, HiOutlineArrowLeft, HiOutlineMail } from 'react-icons/hi2';

export default function AuthCodeError() {
  return (
    <section className="h-screen w-full flex items-center justify-center bg-login relative">
      <div className="w-[90%] md:w-[420px] space-y-4 p-6 bg-white rounded-2xl shadow-xl">

        <div className="flex justify-center mb-2">
          <Image src="/logo-white.svg" alt="Eventeev" width={110} height={44} className="invert" />
        </div>

        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center">
            <HiOutlineExclamationCircle className="text-3xl text-red-500" />
          </div>
          <h1 className="text-xl font-black text-[#1B1818] uppercase tracking-tight">
            Authentication Error
          </h1>
          <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs">
            The code provided is invalid or has expired. This can happen if the link was already used or has timed out.
          </p>
        </div>

        <div className="bg-[#FFF4ED] rounded-xl p-4 border border-orange-100 space-y-2">
          <h2 className="text-[10px] font-black text-[#eb5017] uppercase tracking-widest">What happened?</h2>
          <ul className="space-y-1.5">
            {[
              'The link has already been used',
              'The link has expired',
              'There was an error during authentication',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-[#C27E33] font-medium">
                <span className="mt-0.5 w-1 h-1 rounded-full bg-[#eb5017] shrink-0 mt-1.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 pt-1">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl bg-[#1B1818] text-white font-black text-xs uppercase tracking-widest hover:bg-[#2d2525] transition-all active:scale-95"
          >
            <HiOutlineArrowLeft />
            Try Signing In Again
          </Link>
          <Link
            href="/sign-up"
            className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-xl border border-[#D0D5DD] text-[#344054] font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
          >
            <HiOutlineMail />
            Create New Account
          </Link>
        </div>

        <p className="text-center text-[10px] text-gray-400 font-medium">
          Still having trouble?{' '}
          <a href="mailto:support@eventeev.com" className="text-[#eb5017] font-bold custom-underline">
            Contact support
          </a>
        </p>

      </div>
    </section>
  );
}
