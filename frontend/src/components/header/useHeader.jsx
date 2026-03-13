import { Home, BookOpen, Mail, Command, UserCircle2Icon, Menu, BookOpenText, NotebookTabs,  } from "lucide-react";
import { useSelector } from "react-redux";

export function useHeader() {
  // Safe access: use optional chaining and default to null
  const user = useSelector((state) => state.auth?.user || null);

  const links = [
    { to: "/", label: "Home" , icon:Home },
    { to: "/about", label: "About", icon: Command },
    { to: "/contact", label: "Contact", icon: Mail },
  ];

  if (!user) {
    links.push({ to: "/login", label: "Login", icon: Menu });
  } else {
    links.splice(2, 0, { to: "/my-courses", label: "Courses", icon: BookOpenText });
    links.push({ to: "/notes", label: "Notes", icon: NotebookTabs });

  }
  return { links, user };

}
