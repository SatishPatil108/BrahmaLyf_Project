import { useSelector } from "react-redux";

// useAdminNavbar.js
const useAdminNavbar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Coaches", path: "/admin/coaches" },
    { name: "Courses", path: "/admin/courses" },
    { name: "Musics", path: "/admin/musics" },
    { name: "Domains", path: "/admin/domains" },
    { name: "FAQs", path: "/admin/frequently-asked-questions" },
    { name: "Inquiries", path: "/admin/inquiries" },
  ];
  const { adminLoginSuccess } = useSelector((state) => state.auth);
  return { navItems, adminLoginSuccess };
};

export default useAdminNavbar;