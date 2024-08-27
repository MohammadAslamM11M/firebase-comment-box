import React from "react";

const PaginatedCommentList = ({
  totalComments,
  commentsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalComments / commentsPerPage);

  if (totalPages === 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div>
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          className={number === currentPage ? "active" : ""}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default PaginatedCommentList;
