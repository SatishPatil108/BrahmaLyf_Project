import { useState } from "react";

const usePagination = (initialPage = 1, initialPageSize = 5) => {
  const [pageNo, setPageNo] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  return {
    pageNo,
    pageSize,
    setPageNo,
    setPageSize,
  };
};
export default usePagination;