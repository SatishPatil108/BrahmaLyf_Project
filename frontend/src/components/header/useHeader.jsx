import { Home, BookOpen, Mail, Command, UserCircle2Icon, Menu, BookOpenText,  } from "lucide-react";
import { useSelector } from "react-redux";

export function useHeader() {
  // Safe access: use optional chaining and default to null
  const user = useSelector((state) => state.auth?.user || null);

  const links = [
    { to: "/", label: "Home" , icon:Home },
    { to: "/categories", label: "Categories", icon:BookOpen },
    { to: "/about", label: "About", icon: Command },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  if (!user) {
    // links.push({ to: "/my-courses", label: "My Courses" }),
    links.push({ to: "/login", label: "Login", icon: Menu });
  } else {
    links.splice(2, 0, { to: "/my-courses", label: "My Courses", icon: BookOpenText });
  }
  return { links, user };

}
