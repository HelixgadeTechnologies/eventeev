import Sidebar from "@/components/display/Sidebar";
import Navigation from "@/components/display/Navigation";
import Breadcrumb from "@/components/ui/BreadcrumbComponent";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-64 flex-none transition-all duration-300 ease-in-out">
        <Sidebar />
      </div>

      {/* Main content */}
      <section className="flex-grow flex flex-col overflow-hidden">
        <Navigation />
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50">
          <Breadcrumb />
          <div className="py-3">
            {children}
          </div>
        </div>
      </section>
    </div>
  );
}
