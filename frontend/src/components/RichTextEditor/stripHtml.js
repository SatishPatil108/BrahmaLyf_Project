/**
 * Strips HTML tags and decodes entities, returning plain text.
 * Use this before sending rich-text editor content to your API.
 */
export function stripHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return (div.textContent || div.innerText || "").trim();
}
