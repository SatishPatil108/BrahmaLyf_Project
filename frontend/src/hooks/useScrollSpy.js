import { useState, useEffect } from "react";

const useScrollSpy = (tabs, sectionsRef, offset = 120) => {
  const [activeSection, setActiveSection] = useState(tabs[0]?.id ?? "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;
      let current = tabs[0]?.id ?? "";
      for (const tab of tabs) {
        const el = sectionsRef.current[tab.id];
        if (el && el.offsetTop <= scrollPosition) current = tab.id;
      }
      setActiveSection((prev) => (prev !== current ? current : prev));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [tabs, sectionsRef, offset]);

  return [activeSection, setActiveSection]; 
};

export default useScrollSpy;
