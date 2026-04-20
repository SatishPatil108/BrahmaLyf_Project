import { useRef, useEffect, useCallback } from "react";

const MAX_CHARS = 500;

const RichTextEditor = ({
  id,
  currentAnswer,
  onText,
  isSubmitted,
  bgColor,
  textColor,
  borderColor,
}) => {
  const editorRef = useRef(null);
  const fillRef = useRef(null);
  const labelRef = useRef(null);

  const getCharCount = () =>
    (editorRef.current?.innerText || "").replace(/\n$/, "").length;

  const updateProgress = useCallback(() => {
    if (!fillRef.current || !labelRef.current) return;
    const chars = getCharCount();
    const pct = Math.min((chars / MAX_CHARS) * 100, 100);
    fillRef.current.style.width = `${pct}%`;
    const isOver = chars > MAX_CHARS;
    const isWarn = chars > MAX_CHARS * 0.85;
    fillRef.current.className = `h-full rounded-sm transition-all duration-300 ${
      isOver ? "bg-red-500" : isWarn ? "bg-amber-400" : "bg-emerald-500"
    }`;
    labelRef.current.textContent = `${chars} / ${MAX_CHARS} chars`;
    labelRef.current.className = `text-xs whitespace-nowrap ${
      isOver ? "text-red-500" : "text-gray-400"
    }`;
  }, []);

  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    updateProgress();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url)
      execCmd("createLink", url.startsWith("http") ? url : `https://${url}`);
  };

  const handleInput = () => {
    onText(id, editorRef.current?.innerHTML || "");
    updateProgress();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData(
      "text/plain",
    );
    document.execCommand("insertText", false, text);
  };

  useEffect(() => {
    if (editorRef.current && currentAnswer !== undefined) {
      if (editorRef.current.innerHTML !== currentAnswer) {
        editorRef.current.innerHTML = currentAnswer || "";
      }
    }
    updateProgress();
  }, [currentAnswer, updateProgress]);

  const toolbarBtn = (label, title, onClick, extraStyle = "") => (
    <button
      key={title}
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      disabled={isSubmitted}
      className={`px-2 py-1 rounded text-xs font-medium border border-transparent
        hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-300
        disabled:opacity-40 disabled:cursor-not-allowed transition-all ${extraStyle}`}
      dangerouslySetInnerHTML={{ __html: label }}
    />
  );

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div
        className={`flex flex-wrap items-center gap-1 px-2 py-1.5 rounded-t-lg
          border-b-0 ${bgColor?.secondary || "bg-gray-50 dark:bg-gray-800"}
          border ${borderColor?.secondary || "border-gray-200 dark:border-gray-700"}`}
      >
        <select
          className="text-xs px-1.5 py-1 rounded border border-gray-200 dark:border-gray-600 bg-transparent"
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

      {/* Progress bar */}
      <div className="flex items-center gap-3 mt-2">
        <div className="flex-1 h-1 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden border border-gray-200 dark:border-gray-600">
          <div
            ref={fillRef}
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: "0%" }}
          />
        </div>
        <span
          ref={labelRef}
          className="text-xs text-gray-400 whitespace-nowrap"
        >
          0 / {MAX_CHARS} chars
        </span>
      </div>
    </div>
  );
};

export default RichTextEditor;
