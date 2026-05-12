import React, { useState, useRef, useEffect, useCallback } from "react";

const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Write something...",
  error = false,
  minHeight = "160px",
  readOnly = false,
}) => {
  const editorRef = useRef(null);
  const savedRangeRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [linkPopover, setLinkPopover] = useState(false);
  const [imgPopover, setImgPopover] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [charCount, setCharCount] = useState(0);

  // Sync external value into editor (avoid cursor jump)
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value || "";
      setCharCount((el.innerText || "").length);
    }
  }, [value]);

  const saveSelection = useCallback(() => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  }, []);

  const restoreSelection = useCallback(() => {
    const range = savedRangeRef.current;
    if (!range) return;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, []);

  const notifyChange = useCallback(() => {
    const el = editorRef.current;
    if (!el) return;
    setCharCount((el.innerText || "").length);
    if (onChange) onChange(el.innerHTML);
  }, [onChange]);

  const exec = useCallback(
    (cmd, val = null) => {
      editorRef.current?.focus();
      document.execCommand(cmd, false, val);
      notifyChange();
    },
    [notifyChange],
  );

  const formatBlock = useCallback(
    (tag) => {
      const el = editorRef.current;
      if (!el) return;
      el.focus();

      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;

      const node = sel.getRangeAt(0).commonAncestorContainer;
      const element = node.nodeType === 3 ? node.parentElement : node;
      const blockTags = ["H1", "H2", "H3", "P", "BLOCKQUOTE", "PRE"];
      const current = element.closest(blockTags.join(","));

      // Toggle off if already that block
      if (current && current.tagName.toLowerCase() === tag) {
        document.execCommand("formatBlock", false, "p");
      } else {
        document.execCommand("formatBlock", false, tag);
      }
      notifyChange();
    },
    [notifyChange],
  );

  const insertCodeBlock = useCallback(() => {
    const sel = window.getSelection();
    const selectedText =
      sel && sel.rangeCount > 0 ? sel.toString() : "code here";
    document.execCommand(
      "insertHTML",
      false,
      `<pre><code>${selectedText}</code></pre>`,
    );
    notifyChange();
  }, [notifyChange]);

  const handleInsertLink = useCallback(() => {
    let url = linkUrl.trim();
    if (!url) return;
    if (!url.startsWith("http")) url = "https://" + url;
    restoreSelection();
    exec("createLink", url);
    setLinkUrl("");
    setLinkPopover(false);
  }, [linkUrl, restoreSelection, exec]);

  const handleInsertImg = useCallback(() => {
    let url = imgUrl.trim();
    if (!url) return;
    restoreSelection();
    exec("insertImage", url);
    setImgUrl("");
    setImgPopover(false);
  }, [imgUrl, restoreSelection, exec]);

  const ToolbarBtn = ({ cmd, block, onClick, title, children }) => (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault();
        if (cmd) exec(cmd);
        else if (block) formatBlock(block);
        else if (onClick) onClick();
      }}
      style={{
        background: "none",
        border: "none",
        borderRadius: 6,
        padding: "5px 7px",
        cursor: "pointer",
        color: "#4b5563",
        fontSize: 14,
        lineHeight: 1,
        display: "flex",
        alignItems: "center",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {children}
    </button>
  );

  const Divider = () => (
    <div
      style={{
        width: "1px",
        alignSelf: "stretch",
        background: "#e5e7eb",
        margin: "2px 3px",
      }}
    />
  );

  const PopoverInput = ({
    visible,
    icon,
    inputValue,
    onChangeInput,
    inputPlaceholder,
    onConfirm,
    onCancel,
  }) =>
    visible ? (
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          transform: "translateY(100%)",
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "#ffffff",
          border: "1px solid #d1d5db",
          borderRadius: 8,
          padding: "10px 12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
      >
        <span style={{ color: "#9ca3af", fontSize: 16 }}>{icon}</span>
        <input
          autoFocus
          type="url"
          value={inputValue}
          onChange={(e) => onChangeInput(e.target.value)}
          placeholder={inputPlaceholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") onConfirm();
            if (e.key === "Escape") onCancel();
          }}
          style={{
            flex: 1,
            fontSize: 13,
            padding: "5px 8px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "#f9fafb",
            color: "#111827",
            outline: "none",
          }}
        />
        <button
          type="button"
          onClick={onConfirm}
          style={{
            fontSize: 12,
            padding: "5px 10px",
            borderRadius: 6,
            border: "none",
            background: "#5044E5",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Insert
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            fontSize: 12,
            padding: "5px 10px",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            background: "none",
            color: "#6b7280",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    ) : null;

  return (
    <div
      style={{
        border: error
          ? "1.5px solid #ef4444"
          : isFocused
            ? "1.5px solid #5044E5"
            : "1px solid #d1d5db",
        borderRadius: 10,
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      {/* Toolbar */}
      {!readOnly && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            padding: "6px 8px",
            background: "#f9fafb",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <ToolbarBtn cmd="bold" title="Bold (Ctrl+B)">
            <b style={{ fontSize: 13 }}>B</b>
          </ToolbarBtn>
          <ToolbarBtn cmd="italic" title="Italic (Ctrl+I)">
            <i style={{ fontSize: 13 }}>I</i>
          </ToolbarBtn>
          <ToolbarBtn cmd="underline" title="Underline (Ctrl+U)">
            <u style={{ fontSize: 13 }}>U</u>
          </ToolbarBtn>
          <ToolbarBtn cmd="strikeThrough" title="Strikethrough">
            <s style={{ fontSize: 13 }}>S</s>
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn block="h1" title="Heading 1">
            <span style={{ fontSize: 11, fontWeight: 500 }}>H1</span>
          </ToolbarBtn>
          <ToolbarBtn block="h2" title="Heading 2">
            <span style={{ fontSize: 11, fontWeight: 500 }}>H2</span>
          </ToolbarBtn>
          <ToolbarBtn block="h3" title="Heading 3">
            <span style={{ fontSize: 11, fontWeight: 500 }}>H3</span>
          </ToolbarBtn>
          <ToolbarBtn block="p" title="Paragraph">
            <span style={{ fontSize: 11, fontWeight: 500 }}>P</span>
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn cmd="justifyLeft" title="Align left">
            ←
          </ToolbarBtn>
          <ToolbarBtn cmd="justifyCenter" title="Align center">
            ↔
          </ToolbarBtn>
          <ToolbarBtn cmd="justifyRight" title="Align right">
            →
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn cmd="insertUnorderedList" title="Bullet list">
            •–
          </ToolbarBtn>
          <ToolbarBtn cmd="insertOrderedList" title="Numbered list">
            1.
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn
            title="Insert link"
            onClick={() => {
              saveSelection();
              setImgPopover(false);
              setLinkUrl("");
              setLinkPopover((v) => !v);
            }}
          >
            🔗
          </ToolbarBtn>

          <ToolbarBtn
            title="Insert image"
            onClick={() => {
              saveSelection();
              setLinkPopover(false);
              setImgUrl("");
              setImgPopover((v) => !v);
            }}
          >
            🖼
          </ToolbarBtn>

          <ToolbarBtn block="blockquote" title="Blockquote">
            ❝
          </ToolbarBtn>

          <ToolbarBtn
            title="Code block"
            onClick={() => {
              saveSelection();
              insertCodeBlock();
            }}
          >
            <code style={{ fontSize: 12 }}>{"{}"}</code>
          </ToolbarBtn>

          <ToolbarBtn cmd="insertHorizontalRule" title="Horizontal rule">
            —
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn cmd="undo" title="Undo (Ctrl+Z)">
            ↩
          </ToolbarBtn>
          <ToolbarBtn cmd="redo" title="Redo (Ctrl+Y)">
            ↪
          </ToolbarBtn>
        </div>
      )}

      {/* Editor area */}
      <div style={{ position: "relative" }}>
        <div
          ref={editorRef}
          contentEditable={!readOnly}
          suppressContentEditableWarning
          role="textbox"
          aria-multiline="true"
          aria-label="Rich text editor"
          data-placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            notifyChange();
          }}
          onInput={notifyChange}
          onKeyDown={saveSelection}
          onMouseUp={saveSelection}
          style={{
            minHeight,
            padding: "14px 16px",
            outline: "none",
            fontSize: 15,
            lineHeight: 1.7,
            color: "#111827",
            overflowY: "auto",
          }}
          // Placeholder via CSS ::before — requires a <style> tag or a className
          // Since inline styles can't target ::before, apply a class for the placeholder:
          className="rte-inner-editor"
        />

        <PopoverInput
          visible={linkPopover}
          icon="🔗"
          inputValue={linkUrl}
          onChangeInput={setLinkUrl}
          inputPlaceholder="https://example.com"
          onConfirm={handleInsertLink}
          onCancel={() => setLinkPopover(false)}
        />

        <PopoverInput
          visible={imgPopover}
          icon="🖼"
          inputValue={imgUrl}
          onChangeInput={setImgUrl}
          inputPlaceholder="https://example.com/image.jpg"
          onConfirm={handleInsertImg}
          onCancel={() => setImgPopover(false)}
        />
      </div>

      {/* Status bar */}
      <div
        style={{
          padding: "3px 12px",
          fontSize: 12,
          color: "#9ca3af",
          borderTop: "1px solid #e5e7eb",
          textAlign: "right",
        }}
      >
        {charCount} chars
      </div>
    </div>
  );
};

export default RichTextEditor;
