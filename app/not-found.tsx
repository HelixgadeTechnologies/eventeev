import Button from "@/components/ui/Button";
// import Image from "next/image";

export default function NotFound() {
  return (
    // <div className="flex flex-col items-center justify-center h-screen">
    //     <div className="border border-[#eb5017] rounded-md -rotate-90">
    //         <Image
    //             src="/not-found.png"
    //             alt="404 Not Found"
    //             width={200}
    //             height={400}
    //             className="object-contain rounded-md border"
    //         />
    //     </div>
    //     <div className="text-center">
    //         <h1 className="text-3xl font-bold mb-2">404 - Page Not Found</h1>
    //         <p className="text-sm text-gray-600 mb-4">The page you are looking for does not exist.</p>
    //         <Button content="Back to home" />
    //     </div>
    // </div>
    <div
      className="relative flex size-full min-h-screen flex-col bg-white/70 group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:px-4 @[480px]:py-3">
                <div
                  className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-white rounded-xl min-h-[218px]"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA9b7uQlKYqykeDXOBKGzbhfhWxJ-SqIF9thndUYGQy1WgJ__pJbkVf-a7K1OecjC86_kkWVSdSgQYFtCR1bYqFPInnJ_9likP3XS8WUA69t-8vgbh2sYTy2rCwI6a2Cacv1WUymDlfKHgko8baTsTxZwXLmHtzW0MwCMR0difFCW6TawwH-E6YV0Bv8LCL4JSOFfccnS9KG-jdVlWzsfTom6HCsc2-7YctZ5CELfHCe4c8JNd4fJGFLiWLm3T27FCOZj3bJqoDB8w")',
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                ></div>
              </div>
            </div>
            <h2 className="text-[#181311] tracking-light text-[18px] md:text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">
              Oops! It seems this page took an unexpected detour.
            </h2>
            <div className="flex justify-center mx-auto ">
              <Button content="Back to home" href="/" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
