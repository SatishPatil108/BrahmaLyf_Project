import { useRef, useEffect } from "react";

const RichTextEditor = ({
  value,
  onChange,
  isSubmitted,
  bgColor,
  textColor,
  borderColor,
}) => {
  const editorRef = useRef(null);

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url)
      execCmd("createLink", url.startsWith("http") ? url : `https://${url}`);
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData(
      "text/plain",
    );
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== (value || "")) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const toolbarBtn = (label, title, onClick) => (
    <button
      key={title}
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={isSubmitted}
      className="px-2 py-1 rounded text-xs font-medium border border-transparent
        text-gray-600 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600
        disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div
        className={`flex flex-wrap items-center gap-1 px-2 py-1.5 rounded-t-lg border border-b-0
          ${bgColor?.secondary || "bg-gray-50 dark:bg-gray-800"}
          ${borderColor?.secondary || "border-gray-200 dark:border-gray-700"}`}
      >
        <select
          className="text-xs px-1.5 py-1 rounded border border-gray-200 dark:border-gray-600
            bg-transparent text-gray-600 dark:text-gray-300 cursor-pointer"
          onChange={(e) => {
            execCmd("formatBlock", e.target.value);
            e.target.value = "";
          }}
          disabled={isSubmitted}
        >
          <option value="">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="p">Normal</option>
        </select>

        <span className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
        {toolbarBtn("<b>B</b>", "Bold", () => execCmd("bold"))}
        {toolbarBtn("<i>I</i>", "Italic", () => execCmd("italic"))}
        {toolbarBtn("<u>U</u>", "Underline", () => execCmd("underline"))}
        {toolbarBtn("<s>S</s>", "Strikethrough", () =>
          execCmd("strikeThrough"),
        )}

        <span className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
        {toolbarBtn("&bull;&bull;", "Bullet list", () =>
          execCmd("insertUnorderedList"),
        )}
        {toolbarBtn("1.", "Numbered list", () => execCmd("insertOrderedList"))}

        <span className="w-px h-5 bg-gray-200 dark:bg-gray-600 mx-1" />
        {toolbarBtn("&#128279;", "Link", insertLink)}
        {toolbarBtn("Tx", "Clear formatting", () => execCmd("removeFormat"))}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!isSubmitted}
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
        className={`w-full min-h-[96px] px-4 py-3 text-sm rounded-b-lg border
          ${bgColor?.primary || "bg-white dark:bg-gray-900"}
          ${textColor?.primary || "text-gray-900 dark:text-gray-100"}
          ${borderColor?.secondary || "border-gray-200 dark:border-gray-700"}
          ${isSubmitted ? "cursor-not-allowed opacity-60" : ""}
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400`}
        data-placeholder="Type your answer here..."
      />
    </div>
  );
};

export default RichTextEditor;
