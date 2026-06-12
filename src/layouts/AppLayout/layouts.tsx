import { MySidebar } from "../../components/organism/Sidebar";
import { SidebarProvider, SidebarTrigger } from "../../components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <MySidebar />
      <main className="w-full">
        <SidebarTrigger className="fixed top-2 ml-5" />
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
}
