import React, { useState, useRef } from "react";
import { Typography, TextField, Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { commentPost } from "../../actions/posts";

import useStyles from "./styles";

const CommentSection = ({ post }) => {
  const classes = useStyles();
  const [comments, setComments] = useState(post?.comments);
  const [comment, setComment] = useState("");
  const user = JSON.parse(localStorage.getItem("profile"));
  const dispatch = useDispatch();
  const commentsRef = useRef();

  const handleClick = async (e) => {
    const finalComment = `${user.firstName} ${user.lastName}: ${comment}`;
    const newComments = await dispatch(commentPost(finalComment, post._id));
    setComment("");
    setComments(newComments);
    commentsRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className={classes.commentsOuterContainer}>
      <div className={classes.commentsInnerContainer}>
        <Typography gutterBottom variant="h6">
          Comments
        </Typography>
        {comments?.map((c, i) => (
          <Typography key={i} gutterBottom variant="subtitle1">
            <strong>{c.split(": ")[0]}: </strong>
            {c.split(": ")[1]}
          </Typography>
        ))}
        <div ref={commentsRef} />
      </div>
      {user?.token && (
        <div style={{ width: "60%" }}>
          <Typography gutterBottom variant="h6">
            Write a comment
          </Typography>
          <TextField
            fullWidth
            minRows={4}
            variant="outlined"
            label="Comment"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></TextField>
          <Button
            style={{ marginTop: "10px" }}
            fullWidth
            disabled={!comment}
            variant="contained"
            onClick={handleClick}
            color="primary"
          >
            Comment
          </Button>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
