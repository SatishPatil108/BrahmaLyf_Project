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
  // Safe access: use optional chaining and default to null
  const user = useSelector((state) => state.auth?.user || null);

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/contact", label: "Contact", icon: Mail },
    { to: "/free-trial", label: "Free Trial", icon: FileSpreadsheetIcon },
  ];

  if (!user) {
    links.push({ to: "/login", label: "Login", icon: Menu });
  } else {
    links.splice(2, 0, {
      to: "/my-courses",
      label: "Courses",
      icon: BookOpenText,
    });
    links.push({ to: "/notes", label: "Notes", icon: NotebookTabs });
  }
  return { links, user };
}
