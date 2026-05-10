"use client";
import useAuthStore from '@/lib/store/authStore';
import { LayoutDashboard, Package, ShoppingCart, Wifi, WifiOff, Store, Menu, Box } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';


interface LayoutProps {
  children: React.ReactNode
}
export default function MainLayout({ children }: LayoutProps) {
  const { isAuthenticated, accessToken } = useAuthStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentStore, setCurrentStore] = useState('Toko Pusat');
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/dashboard/category', label: 'Categoris', icon: Box },
    { to: '/dashboard/inventory', label: 'Inventaris', icon: Package },
    { to: '/dashboard/pos', label: 'Kasir', icon: ShoppingCart },
  ];
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken && !isAuthenticated) {
      router.push("/login");
    }
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div onClick={() => setIsSidebarOpen(false)} className={`bg-black/20 fixed w-full h-screen lg:hidden z-40 ${isSidebarOpen ? "block" : "hidden"}`}></div>
      <aside className={`fixed h-screen bg-white border-r border-gray-200 flex flex-col overflow-hidden transaction-all duration-300 ease z-50 ${isSidebarOpen ? 'w-64' : 'w-0 lg:w-64'}`}>
        {/* Logo & Store Selector */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ModernPOS</h1>

          {/* Store Selector */}
          <div className="relative">
            <button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <Store className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 flex-1 text-left">{currentStore}</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className={
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${pathname == item.to
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Connection Status */}
        <div className="p-4 border-t border-gray-200">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isOnline ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4" />
                <span className="text-sm font-medium">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span className="text-sm font-medium">Offline Mode</span>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 min-w-0 overflow-auto ${isSidebarOpen ? 'lg:ml-64' : 'm-0 lg:ml-64'}`}>
        <div className={`fixed left-0 w-full flex lg:hidden justify-end bg-white shadow-md z-20`}>
          <button onClick={() => setIsSidebarOpen(true)} className="p-3 px-3 rounded-md">
            <Menu size={25} />
          </button>
        </div>
        <div className="mt-10 lg:mt-0"></div>
        {children}
      </main>
    </div>
  );
}
