import { useState, useRef, useEffect } from "react";
import { LogOut, User, KeyRound, Settings, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useHeader } from "./useHeader";
import { useNavigate } from "react-router-dom";
import defaultImg from "@/assets/user.png"
import { clearUserError } from "@/store/feature/user/userSlice";
import { useDispatch } from "react-redux";
import CustomButton from "@/components/CustomButton";
const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const UserMenu = () => {
    const { user } = useHeader();
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState(null);
    const menuRef = useRef();
    const btnRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isMobile = window.innerWidth < 768;

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target) &&
                !btnRef.current.contains(e.target)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && open) {
                setOpen(false);
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open]);

    if (!user) return null;

    // Calculate absolute position
    const toggleMenu = (e) => {
        e?.stopPropagation();
        setOpen(!open);

        if (!open && btnRef.current) {
            const rect = btnRef.current.getBoundingClientRect();

            // Calculate correct positions
            setCoords({
                top: isMobile ? rect.top : rect.bottom + 8,
                right: window.innerWidth - rect.right - 10,
                width: 250,
            });
        }
    };

    const handleMenuItemClick = (path) => {
        dispatch(clearUserError());
        navigate(path);
        setOpen(false);
    };

    const handleLogout = () => {
        dispatch(clearUserError());
        navigate("/logout");
        setOpen(false);
    };

    return (
        <>
            {/* User Profile Button */}
            <div className="relative">
                <button
                    ref={btnRef}
                    onClick={toggleMenu}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    aria-label="User menu"
                    aria-expanded={open}
                >
                    <div className="relative">
                        <img
                            src={`${BASE_URL}${user.profile_picture_url}`}
                            alt={user.name || "User"}
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-300 dark:border-gray-700 group-hover:border-indigo-500 transition-colors"
                            onError={(e) => {
                                e.target.src = defaultImg;
                                e.target.onerror = null;
                            }}
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>

                    {/* Desktop: Show name */}
                    <div className="hidden lg:block text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                            {user.name || "User"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                            {user.email || ""}
                        </p>
                    </div>

                    <ChevronDown
                        className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                </button>
            </div>

            {/* Dropdown Menu */}
            {open && coords && createPortal(
                <div
                    ref={menuRef}
                    className="fixed z-[9999] bg-white dark:bg-gray-900 shadow-2xl rounded-xl py-2 w-56 border border-gray-200 dark:border-gray-800"
                    style={{
                        top: coords.top,
                        right: coords.right,
                        width: coords.width,
                    }}
                    role="menu"
                >
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 mb-2">
                        <div className="flex items-center gap-3">
                            <img
                                src={`${BASE_URL}${user.profile_picture_url}`}
                                alt={user.name || "User"}
                                className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                                onError={(e) => {
                                    e.target.src = defaultImg;
                                    e.target.onerror = null;
                                }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {user.name || "User"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email || ""}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-1 px-2">
                        <button
                            onClick={() => handleMenuItemClick("/view-profile")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                            role="menuitem"
                        >
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            View Profile
                        </button>

                        <button
                            onClick={() => handleMenuItemClick("/edit-profile")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                            role="menuitem"
                        >
                            <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            Edit Profile
                        </button>

                        <button
                            onClick={() => handleMenuItemClick("/change-password")}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300 
                                     hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-left"
                            role="menuitem"
                        >
                            <KeyRound className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            Change Password
                        </button>

                        {/* Divider */}
                        <div className="border-t border-gray-100 dark:border-gray-800 my-2"></div>

                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 dark:text-red-400 
                                     hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-left"
                            role="menuitem"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile Close Hint */}
                    {isMobile && (
                        <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                Tap outside to close
                            </p>
                        </div>
                    )}
                </div>,
                document.body
            )}
        </>
    );
};

export default UserMenu;