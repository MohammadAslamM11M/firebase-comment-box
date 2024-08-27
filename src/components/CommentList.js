import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebaseConfig";
import "./CommentList.js";

const CommentList = ({ currentPage }) => {
  const [comments, setComments] = useState([]);
  const [replies, setReplies] = useState([]);
  const [sortOrder, setSortOrder] = useState("latest");

  useEffect(() => {
    const q = query(
      collection(firestore, "comments"),
      orderBy(sortOrder === "latest" ? "createdAt" : "reactionCount", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [sortOrder]);

  const startIndex = (currentPage - 1) * 8;
  const currentComments = comments.slice(startIndex, startIndex + 8);

  return (
    <div>
      <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
        <option value="latest">Latest</option>
        <option value="popular">Popular</option>
      </select>
      {currentComments.map((comment) => (
        <div key={comment.id}>
          <div dangerouslySetInnerHTML={{ __html: comment.text }} />
          {comment.imageUrl && (
            <img
              style={{
                width: "6rem",
                height: "6rem",
                objectFit: "cover",
                borderRadius: "10px",
              }}
              src={comment.imageUrl}
              alt="comment-img"
            />
          )}
          <p>
            posted By {comment.userName || "Unkown User"} -{" "}
            {new Date(comment.createdAt?.seconds * 1000).toLocaleString()}
          </p>
          <p>
            Reactions:{" "}
            {comment.reactions
              ? Object.keys(comment.reactions).length
              : 0 && (
                  <div>
                    Tagged Users:{" "}
                    {comment.taggedUsers.map((user) => (
                      <span key={user.id}>@{user.displayName}</span>
                    ))}
                  </div>
                )}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CommentList;
