import { useEffect } from "react";

let injected = false;

const CSS = `
  .bg-grid-pattern-light {
    background-image:
      linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .bg-grid-pattern-dark {
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;

const useGridPatternStyles = () => {
  useEffect(() => {
    if (injected) return;
    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);
    injected = true;
  }, []);
};

export default useGridPatternStyles;
