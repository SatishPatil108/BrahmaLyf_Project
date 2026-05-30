import parse from "html-react-parser";

const HtmlContent = ({ content, className = "" }) => {
  return <div className={className}>{parse(content || "")}</div>;
};

export default HtmlContent;
