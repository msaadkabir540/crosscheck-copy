const EllipsisText = ({ backClass, text, maxWords = 30 }) => {
  
  const isOverflowing = text?.length > maxWords;

  
  const truncatedText = isOverflowing ? text.slice(0, maxWords) + "..." : text;

  return (
    <p className={backClass + ` ${isOverflowing ? "ellipsis" : ""}`}>
      {truncatedText}
    </p>
  );
};

export default EllipsisText;
