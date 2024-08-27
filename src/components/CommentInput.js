import React, { useState } from "react";
import { storage, firestore } from "../firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MentionsInput, Mention } from "react-mentions";
import SignIn from "./SignIn";
import SignOut from "./SignOut";
// import defaultMentionStyle from "./mentionStyles";
import "./CommentInput.css";

const CommentInput = ({ onNewComment }) => {
  const [comment, setComment] = useState("");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");

  const getUserList = async (searchTerm) => {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(usersRef);

    const usersList = querySnapshot.docs
      .map((doc) => doc.data())
      .filter((user) =>
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((user) => ({
        id: user.id,
        display: user.displayName,
      }));

    return usersList;
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        const storageRef = ref(storage, `comments/${Date.now()}-${file.name}`);
        const uploadTask = await uploadBytesResumable(storageRef, file);
        const fileUrl = await getDownloadURL(uploadTask.ref);
        setFile(fileUrl);
      } catch (error) {
        console.log("Error uploading file:", error);
        setError("Failed to upload the file. Please try again.");
      }
    }
  };

  const extractMentionUsers = (commentText) => {
    const mentionPattern = /@(\w+)/g;
    const mentionedUsers = [];
    let match;

    while ((match = mentionPattern.exec(commentText)) !== null) {
      mentionedUsers.push(match[1]);
    }

    return mentionedUsers;
  };

  const handleSubmit = async () => {
    if (!comment || !user) {
      setError("Please sign in and write a comment.");
      return;
    }

    const mentionedUsers = extractMentionUsers(comment);

    const newComment = {
      text: comment,
      user: {
        displayName: user.displayName,
        photoURL: user.photoURL,
      },
      imageUrl: file || "",
      createdAt: serverTimestamp(),
      reactions: {},
      taggedUsers: mentionedUsers,
    };

    await addDoc(collection(firestore, "comments"), newComment);
    onNewComment(newComment);
    setComment("");
    setFile(null);
  };

  // const handleReplySubmit = async (commentId, replyText) => {
  //   if (!replyText || !user) {
  //     setError("Please sign in and write a reply.");
  //     return;
  //   }

  //   const mentionedUsers = extractMentionUsers(replyText);

  //   const newReply = {
  //     text: replyText,
  //     user: {
  //       displayName: user.displayName,
  //       photoURL: user.photoURL,
  //     },
  //     createdAt: serverTimestamp(),
  //     reactions: {},
  //     taggedUsers: mentionedUsers,
  //   };

  //   await addDoc(
  //     collection(firestore, `comments/${commentId/replies}`),
  //     newReply
  //   );
  // };

  return (
    <div>
      {!user ? (
        <div className="sign-in-btn-layout">
          <SignIn onSignIn={setUser} />
        </div>
      ) : (
        <div className="signed-in-container">
          <div className="sign-out-btn-layout">
            <SignOut onSignOut={() => setUser(null)} />
          </div>
          <ReactQuill
            value={comment}
            onChange={setComment}
            // placeholder="Write a comment.."
            // modules={{
            //   mention: {
            //     mentionDenotationChars: ["@"],
            //     source: async (searchTerm, renderList) => {
            //       const users = await getUserList(searchTerm);
            //       renderList(users);
            //     },
            //   },
            // }}
          />
          <input type="file" onChange={handleFileUpload} />
          <button onClick={handleSubmit}>Send</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default CommentInput;
