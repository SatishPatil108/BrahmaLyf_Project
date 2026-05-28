// Rich text renderer with bold, lists, and links
const RichTextContent = ({ content, className = "", bulletClassName = "" }) => {
  const lines = content.split("\n").filter((line) => line.trim());

  const parseInline = (text) => {
    // Parse bold **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <strong key={match.index} className="font-semibold">
          {match[1]}
        </strong>,
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length ? parts : text;
  };

  return (
    <div className="space-y-3">
      {lines.map((line, idx) => {
        const trimmed = line.trim();

        // Handle bullet points
        if (trimmed.startsWith("•")) {
          const bulletContent = trimmed.substring(1).trim();
          return (
            <div key={idx} className="flex gap-3">
              <span
                className={`font-bold flex-shrink-0 mt-0.5 ${bulletClassName}`}
              >
                •
              </span>
              <p className={`leading-relaxed flex-1 ${className}`}>
                {parseInline(bulletContent)}
              </p>
            </div>
          );
        }

        // Handle numbered lists (1., 2., etc.)
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <div key={idx} className="flex gap-3">
              <span className="text-blue-600 dark:text-blue-400 font-semibold flex-shrink-0 min-w-[24px]">
                {numberedMatch[1]}.
              </span>
              <p className={`leading-relaxed flex-1 ${className}`}>
                {parseInline(numberedMatch[2])}
              </p>
            </div>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className={`leading-relaxed ${className}`}>
            {parseInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

export default RichTextContent;
