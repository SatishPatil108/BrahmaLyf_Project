// Utility — strips all inline styles from HTML, keeps tags clean
export const cleanHtml = (html) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  tmp.querySelectorAll("*").forEach((el) => el.removeAttribute("style"));
  return tmp.innerHTML;
};