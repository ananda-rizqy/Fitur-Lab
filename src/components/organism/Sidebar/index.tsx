import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  IconMap,
  IconHome,
  IconDeviceAirtag,
  IconHistory,
  IconChevronUp,
  IconSchool,
  IconAlertTriangle,
  IconBoxSeam,
  IconFileCheck,
  IconDoorEnter,
  IconClock,
  IconArrowBackUp,
  IconFilePlus,
  IconCalendarTime,
  IconTool,
  IconUser,
  IconUserCheck,
} from "@tabler/icons-react";
 
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem,
} from "../../ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu.tsx";
import { ShuffleIcon } from "lucide-react";

interface UserData {
  id: number;
  email: string;
  avatar?: string;
  kelas: string;
  name?: string;
  role?: string;
}

const items = [
  { title: "Home", url: "/dashboard", icon: IconHome },
  {
    title: "Device Management",
    url: "/device-management",
    icon: IconDeviceAirtag,
    roles: ["tendik"],
  },
  { title: "Map", url: "/map", icon: IconMap },
  { title: "History", url: "/history", icon: IconHistory },
  {
    title: "Class",
    url: "/class",
    icon: IconSchool,
    roles: ["mahasiswa"],
  },
  {
    title: "Ketersediaan Alat",
    url: "/ketersediaan-alat",
    icon: IconBoxSeam,
    roles: ["tendik", "mahasiswa", "dosen"],
  },
  {
    title: "Laporan Penggunaan Aset",
    url: "/laporan-aset",
    icon: IconCalendarTime,
    roles: ["tendik", "dosen"],
  },
  {
    title: "Manajemen Tendik",
    url: "/manajemen-tendik",
    icon: IconUser,
    roles: ["dosen"],
  },
  {
    title: "Persetujuan Pinjam",
    url: "/persetujuan-pinjam",
    icon: IconFileCheck,
    roles: ["tendik"],
  },
  {
    title: "Riwayat Peminjaman Alat",
    url: "/staff/riwayat-peminjaman-alat",
    icon: IconTool,
    roles: ["tendik"],
  },
  {
    title: "Riwayat Peminjaman Ruang",
    url: "/riwayat-peminjaman-ruang",
    icon: IconDoorEnter,
    roles: ["tendik"],
  },
  {
    title: "Riwayat Peminjaman Alat",
    url: "/riwayat-alat",
    icon: IconTool,
    roles: ["dosen"],
  },
  {
    title: "Riwayat Peminjaman Ruang",
    url: "/riwayat-ruang",
    icon: IconDoorEnter,
    roles: ["dosen"],
  },
  {
    title: "Laporan Kerusakan",
    url: "/laporan-kerusakan",
    icon: IconAlertTriangle,
    roles: ["tendik"],
  },
  {
    title: "Pengajuan Pinjam Alat",
    url: "/pengajuan-pinjam-alat",
    icon: IconFilePlus,
    roles: ["mahasiswa"],
  },
  {
    title: "Peminjaman Aktif",
    url: "/peminjaman-aktif",
    icon: IconClock,
    roles: ["mahasiswa"],
  },
  {
    title: "Pengembalian Alat",
    url: "/pengembalian-alat",
    icon: IconArrowBackUp,
    roles: ["mahasiswa"],
  },
  {
    title: "Penggunaan Ruang Lab",
    url: "/penggunaan-ruang-lab",
    icon: IconDoorEnter,
    roles: ["mahasiswa"],
  },
  {
    title: "Riwayat Penggunaan Alat",
    url: "/riwayat-peminjaman-alat",
    icon: IconCalendarTime,
    roles: ["mahasiswa"],
  },
  {
    title: "Riwayat Penggunaan Ruang",
    url: "/riwayat-penggunaan-ruang",
    icon: IconCalendarTime,
    roles: ["mahasiswa"],
  },
];

export function MySidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userData, setUserData] = useState<UserData | null>(null);

  const checkStatus = () => {
    const authJson = localStorage.getItem("auth");
    if (authJson) {
      const authData = JSON.parse(authJson);
      setUserData(authData.user);
    } else {
      setUserData(null);
    }
  };

  useEffect(() => {
    checkStatus();
  }, [location.pathname]);

  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.includes(userData?.role?.toLowerCase() || "");
  });

  const mainItems = filteredItems.filter((i) =>
    ["Home", "Map", "History", "Class"].includes(i.title),
  );
  const adminItems = filteredItems.filter(
    (i) => !["Home", "Map", "History", "Class"].includes(i.title),
  );

  const logOut = () => {
    localStorage.clear();
    window.location.replace("/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950"
    >
      <div className="py-4 px-2 border-b-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate("/dashboard")}
              className="hover:bg-zinc-100 dark:hover:bg-zinc-900 border-2 border-transparent hover:border-zinc-950 rounded-none transition-all"
            >
              <div className="flex aspect-square size-6 items-center justify-center rounded-none bg-zinc-950 dark:bg-zinc-900 border-2 border-zinc-950 dark:border-zinc-700 text-white ">
                <IconDeviceAirtag size={20} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-2 font-mono">
                <span className="truncate font-black text-zinc-900 dark:text-zinc-50">
                  Localization App
                </span>
                <span className="truncate text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                  Sistem Manajemen
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>

      <SidebarContent className="px-2 bg-white dark:bg-zinc-950 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className=" text-sm font-mono font-black tracking-widest text-zinc-900 dark:text-zinc-500">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.title}
                    className={`border-2 rounded-none transition-all font-mono text-xs font-black ${
                      isActive
                        ? "bg-blue-500! data-[active=true]:bg-blue-600 data-[active=true]:text-white text-white dark:text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none hover:bg-blue-500! hover:text-white"
                        : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-950 dark:hover:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center py-2 px-3 w-full h-full"
                    >
                      <item.icon size={18} className="shrink-0 text-current" />
                      <span className="ml-3 text-current">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        {adminItems.length > 0 && (
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className=" text-sm font-mono font-black tracking-widest text-zinc-900 dark:text-zinc-500">
              Manajemen Alat
            </SidebarGroupLabel>

            <SidebarMenu>
              {adminItems.map((item) => {
                const isActive = location.pathname === item.url;

                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`border-2 rounded-none transition-all font-mono text-xs font-black ${
                        isActive
                          ? "bg-blue-500! data-[active=true]:bg-blue-600 data-[active=true]:text-white text-white dark:text-white border-zinc-950 dark:border-zinc-700 shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none hover:bg-blue-500! hover:text-white"
                          : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-zinc-950 dark:hover:border-zinc-800 text-zinc-800 dark:text-zinc-200"
                      }`}
                    >
                      <Link
                        to={item.url}
                        className="flex items-center py-2 px-3 w-full h-full"
                      >
                        <item.icon
                          size={18}
                          className="shrink-0 text-current"
                        />
                        <span className="ml-3 text-current">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>

      <div className="p-2 border-t-2 border-zinc-950 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="w-full bg-white dark:bg-zinc-950 border-2 border-zinc-950 dark:border-zinc-800 rounded-none transition-all shadow-[2px_2px_0px_0px_rgba(9,9,11,1)] dark:shadow-none px-2"
                >
                  <div className="relative flex shrink-0">
                    <img
                      src={
                        userData?.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${userData?.name || "User"}&backgroundColor=18181b`
                      }
                      alt="Profile"
                      className="relative w-8 h-8 rounded-none object-cover border-2 border-zinc-950 dark:border-zinc-800 shadow-none shrink-0"
                    />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight ml-3 group-data-[collapsible=icon]:hidden font-mono">
                    <span className="truncate font-black text-zinc-900 dark:text-zinc-100">
                      {userData?.name || "User"}
                    </span>
                    <span className="truncate text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                      {userData?.kelas}
                    </span>
                  </div>
                  <IconChevronUp className="ml-auto size-4 text-zinc-400 group-data-[collapsible=icon]:hidden shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="right"
                align="end"
                sideOffset={12}
                className="w-64 mb-2 p-2 border-2 border-zinc-950 dark:border-zinc-800 bg-white dark:bg-zinc-950 font-mono text-xs rounded-none shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none"
              >
                <DropdownMenuLabel className="font-normal px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                      {userData?.name}
                    </p>
                    <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold">
                      {userData?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
                <DropdownMenuItem
                  onClick={() => navigate("/settings")}
                  className="cursor-pointer py-2 px-4 rounded-none focus:bg-zinc-100 dark:focus:bg-zinc-900 font-black text-zinc-800 dark:text-zinc-200"
                >
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-200 dark:bg-zinc-800" />
                <DropdownMenuItem
                  onClick={logOut}
                  className="cursor-pointer py-2 px-4 rounded-none text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-950/40 font-black tracking-widest"
                >
                  <span>LOGOUT</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </div>
    </Sidebar>
  );
}
