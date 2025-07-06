import Button from "@/components/ui/Button";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="border border-[#eb5017] rounded-md -rotate-90">
                <Image
                    src="/not-found.png"
                    alt="404 Not Found"
                    width={200}
                    height={400}
                    className="object-contain rounded-md border"
                />
            </div>
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
                <p className="text-sm text-gray-600 mb-4">The page you are looking for does not exist.</p>
                <Button content="Back to home" />
            </div>
        </div>
    )
}