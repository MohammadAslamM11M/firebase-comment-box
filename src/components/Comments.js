import React, { useState } from "react";
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import PaginatedCommentList from "./PaginatedCommentList";
import "./Comments.css";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleNewComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="comment-box-container">
      <CommentInput onNewComment={handleNewComment} />
      <CommentList comments={comments} currentPage={currentPage} />
      <PaginatedCommentList
        totalComments={comments.length}
        commentsPerPage={8}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default Comments;
