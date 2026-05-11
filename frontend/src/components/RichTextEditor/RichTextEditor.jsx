import { useRef, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const RichTextEditor = ({
  value,
  onChange,
  isSubmitted,
  bgColor,
  textColor,
  borderColor,
}) => {
  const editorRef = useRef(null);
  const { theme } = useTheme();

  // Complete theme configuration
  const themeConfig = {
    dark: {
      // Toolbar styles
      toolbar: {
        background: "bg-gray-800",
        border: "border-gray-700",
        text: "text-gray-300",
      },
      // Select dropdown styles
      select: {
        background: "bg-gray-800",
        border: "border-gray-700",
        text: "text-gray-300",
        hover: "hover:bg-gray-700",
        focus: "focus:ring-blue-500",
      },
      // Button styles
      button: {
        text: "text-gray-300",
        hoverBg: "hover:bg-gray-700",
        hoverBorder: "hover:border-gray-600",
        disabled: "disabled:opacity-40",
      },
      // Divider
      divider: "bg-gray-700",
      // Editor styles
      editor: {
        background: "bg-gray-900",
        text: "text-gray-100",
        border: "border-gray-700",
        placeholder: "placeholder:text-gray-500",
        focus: "focus:ring-blue-500",
      },
    },
    light: {
      // Toolbar styles
      toolbar: {
        background: "bg-gray-50",
        border: "border-gray-200",
        text: "text-gray-600",
      },
      // Select dropdown styles
      select: {
        background: "bg-white",
        border: "border-gray-300",
        text: "text-gray-700",
        hover: "hover:bg-gray-50",
        focus: "focus:ring-blue-500",
      },
      // Button styles
      button: {
        text: "text-gray-600",
        hoverBg: "hover:bg-gray-100",
        hoverBorder: "hover:border-gray-300",
        disabled: "disabled:opacity-40",
      },
      // Divider
      divider: "bg-gray-200",
      // Editor styles
      editor: {
        background: "bg-white",
        text: "text-gray-900",
        border: "border-gray-200",
        placeholder: "placeholder:text-gray-400",
        focus: "focus:ring-blue-500",
      },
    },
  };

  const config = themeConfig[theme] || themeConfig.light;

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
      className={`px-2 py-1 rounded text-xs font-medium border border-transparent
        ${config.button.text} ${config.button.hoverBg} ${config.button.hoverBorder}
        ${config.button.disabled} cursor-not-allowed transition-all`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div
        className={`flex flex-wrap items-center gap-1 px-2 py-1.5 rounded-t-lg border border-b-0
          ${bgColor?.secondary || config.toolbar.background}
          ${borderColor?.secondary || config.toolbar.border}`}
      >
        <select
          className={`text-xs px-1.5 py-1 rounded border
            ${config.select.border} ${config.select.background} ${config.select.text}
            ${config.select.hover} cursor-pointer focus:outline-none focus:ring-1 ${config.select.focus}
            disabled:opacity-40 disabled:cursor-not-allowed transition-all`}
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

        <span className={`w-px h-5 ${config.divider} mx-1`} />
        {toolbarBtn("<b>B</b>", "Bold", () => execCmd("bold"))}
        {toolbarBtn("<i>I</i>", "Italic", () => execCmd("italic"))}
        {toolbarBtn("<u>U</u>", "Underline", () => execCmd("underline"))}
        {toolbarBtn("<s>S</s>", "Strikethrough", () =>
          execCmd("strikeThrough"),
        )}

        <span className={`w-px h-5 ${config.divider} mx-1`} />
        {toolbarBtn("• •", "Bullet list", () =>
          execCmd("insertUnorderedList"),
        )}
        {toolbarBtn("1.", "Numbered list", () => execCmd("insertOrderedList"))}

        <span className={`w-px h-5 ${config.divider} mx-1`} />
        {toolbarBtn("🔗", "Insert Link", insertLink)}
        {toolbarBtn("Tx", "Clear formatting", () => execCmd("removeFormat"))}
      </div>

      {/* Editor Content */}
      <div
        ref={editorRef}
        contentEditable={!isSubmitted}
        onInput={handleInput}
        onPaste={handlePaste}
        suppressContentEditableWarning
        className={`w-full min-h-[96px] px-4 py-3 text-sm rounded-b-lg border
          ${bgColor?.primary || config.editor.background}
          ${textColor?.primary || config.editor.text}
          ${borderColor?.secondary || config.editor.border}
          ${isSubmitted ? "cursor-not-allowed opacity-60" : `focus:outline-none focus:ring-1 ${config.editor.focus}`}
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400
          ${config.editor.placeholder}
          transition-all duration-200
          prose prose-sm max-w-none dark:prose-invert`}
        data-placeholder="Type your answer here..."
      />
    </div>
  );
};

export default RichTextEditor;