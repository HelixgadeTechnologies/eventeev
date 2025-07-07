import Sidebar from "@/components/display/Sidebar";
import Avatar from "@/components/ui/Avatar";
import NotificationsComponent from "@/components/ui/NotificationsTab";

export default function EventsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <div className="flex flex-col md:flex-row md:overflow-hidden min-h-screen">
      {/* Sidebar wrapper */}
      <div className="{`flex-none transition-all duration-300 ease-in-out w-64">
        <Sidebar />
      </div>

      {/* Main content */}
      <div
        className={`flex-grow p-6 md:overflow-y-auto`}
      >
        <div className="flex justify-end items-center gap-3 bg-white">
            <NotificationsComponent />
            <Avatar src="" name="esther chinda" />
        </div>
        {children}
      </div>
    </div>
  );
}