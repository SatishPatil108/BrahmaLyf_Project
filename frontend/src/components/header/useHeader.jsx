import {
  Home,
  BookOpen,
  Mail,
  Command,
  UserCircle2Icon,
  Menu,
  BookOpenText,
  NotebookTabs,
  FileSpreadsheetIcon,
} from "lucide-react";
import { useSelector } from "react-redux";

export function useHeader() {
  const user = useSelector((state) => state.auth?.user || null);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/contact", label: "Contact", icon: Mail },
    { to: "/trial-resources", label: "Trial", icon: FileSpreadsheetIcon },
    { to: "/categories", label: "Categories", icon: BookOpen },

  ];

  if (!user) {
    links.push({ to: "/login", label: "Login", icon: Menu });
  } else {
    links.splice(2, 0, {
      to: "/my-courses",
      label: "Enrolled",
      icon: BookOpenText,
    });
    links.push({ to: "/notes", label: "Notes", icon: NotebookTabs });
  }
  return { links, user };
}
