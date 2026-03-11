import {
  ArrowLeftRight,
  BarChart3,
  LogOut,
  Menu,
  Shield,
  ShoppingCart,
  UserCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../lib/axios";
import { clearUser } from "../../redux/slices/userSlice";

const NAV_LINKS = [
  { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
  { path: "/purchases", label: "Purchases", icon: ShoppingCart },
  { path: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { path: "/assignments", label: "Assignments", icon: UserCheck },
];

const ROLE_COLOR = {
  admin: "text-red-400",
  base_commander: "text-blue-400",
  logistics: "text-green-400",
};

const ROLE_LABEL = {
  admin: "Admin",
  base_commander: "Base Commander",
  logistics: "Logistics Officer",
};

const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { userData } = useSelector((s) => s.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/api/auth/logout");
    } catch {}
    dispatch(clearUser());
    navigate("/login");
  };

  const NavLink = ({ path, label, icon: Icon, mobile = false }) => {
    const isActive = location.pathname === path;
    return (
      <button
        onClick={() => {
          navigate(path);
          setMenuOpen(false);
        }}
        className={`
          flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-150
          ${
            mobile
              ? `w-full px-4 py-3 rounded-xl text-left
               ${isActive ? "bg-amber-500/10 text-amber-400 border-l-2 border-amber-500" : "text-gray-500 border-l-2 border-transparent hover:text-gray-300"}`
              : `px-3 py-1.5 rounded-lg border-b-2
               ${isActive ? "bg-amber-500/10 text-amber-400 border-amber-500" : "text-gray-500 border-transparent hover:text-gray-300"}`
          }
        `}
      >
        <Icon size={15} />
        {label}
      </button>
    );
  };

  return (
    <>
      <header className="sticky top-0 z-40 h-15 border-b border-gray-800 bg-[#06090f] px-5 flex items-center justify-between gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Shield size={16} className="text-slate-900 fill-slate-900" />
          </div>
          <span className="text-sm font-black tracking-widest text-slate-100">
            MAMS
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.path} {...l} />
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Secure dot */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
            <span className="text-[10px] text-gray-600 tracking-widest">
              SECURE
            </span>
          </div>

          <div className="hidden sm:block w-px h-6 bg-gray-800" />

          {/* User info */}
          <div className="hidden sm:block text-right">
            <p className="text-sm font-bold text-slate-100 leading-tight">
              {userData?.name}
            </p>
            <p className="text-[11px] leading-tight">
              <span
                className={`font-semibold ${ROLE_COLOR[userData?.role] ?? "text-gray-400"}`}
              >
                {ROLE_LABEL[userData?.role] ?? userData?.role}
              </span>
              {userData?.assignedBase && (
                <span className="text-gray-600">
                  {" "}
                  · {userData.assignedBase.split(" - ")[1]}
                </span>
              )}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-800 text-xs font-semibold text-gray-500 cursor-pointer hover:border-red-500/40 hover:text-red-400 transition-all duration-150"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Logout</span>
          </button>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center cursor-pointer"
          >
            {menuOpen ? (
              <X size={15} className="text-gray-400" />
            ) : (
              <Menu size={15} className="text-gray-400" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-[60px] left-0 right-0 z-39 bg-[#0b1120] border-b border-gray-800 px-4 py-3 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <NavLink key={l.path} {...l} mobile />
          ))}
          <div className="h-px bg-gray-800 my-2" />
          <div className="px-4 py-2">
            <p className="text-sm font-bold text-slate-100">{userData?.name}</p>
            <p
              className={`text-xs font-semibold ${ROLE_COLOR[userData?.role] ?? "text-gray-400"}`}
            >
              {ROLE_LABEL[userData?.role] ?? userData?.role}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default TopBar;
