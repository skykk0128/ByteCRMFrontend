import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";
import CommentCard from "./components/CommentCard";
import CommentForm from "./components/CommentForm";
import "./CommentBox.scss";


class CommentBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showComments: false,
      showCommentForm: false,
      comments: this.props.comments
    };
    this.handleShowCommentFormClick = this.handleShowCommentFormClick.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
  }

  handleShowCommentFormClick() {
    this.setState(prevState =>({
      showCommentForm: !prevState.showCommentForm
    }));
  }

  
  addComment(author, content, timestamp) {
    const comment = {
      id: this.state.comments.length + 1,
      author,
      content,
      timestamp
    };
    this.setState({ comments: this.state.comments.concat([comment]) }); 
  }

  deleteComment(index){
    const arr = this.state.comments;
    arr.splice(index, 1)
    this.setState({comments: arr});
  }

  updateComment(newContent, index){
    const arr = this.state.comments;
    arr[index].content = newContent;
    this.setState({comments: arr})
  }
  
  handleClick() {
    this.setState({
      showComments: !this.state.showComments
    });
  }
  
  getComments() {    
    return this.state.comments.map((comment, i) => { 
      return (
        <CommentCard 
          key={i}
          index={i}
          //id={comment.id}
          author={comment.author} 
          content={comment.content} 
          timestamp={comment.timestamp}
          key={comment.id} 
          onDelete={this.deleteComment}
          onUpdate={this.updateComment}
        />
      ); 
    });
  }
  
  getCommentsTitle(commentCount) {
    if (commentCount === 0) {
      return 'No comments yet';
    } else {
      return `Comments (${commentCount}) `;
    }
  }
  
  render () {
    const commentsFromNote = this.props.comments;
    const comments = this.getComments(commentsFromNote);
    let commentNodes;
    let buttonText = <FontAwesomeIcon icon={faChevronRight} />;
    
    if (this.state.showComments) {
      buttonText = <FontAwesomeIcon icon={faChevronDown} />;
      commentNodes = <div className="comment-list">{comments}</div>;
    }
    
    return(
      <div>
        <div className="comment-box-top">
          <button 
            onClick={this.handleClick.bind(this)}
            className="accordion-label"
          >
            {buttonText} {this.getCommentsTitle(comments.length)} 
          </button>
          <div className="comment-items">
            {commentNodes}
          </div>
        </div>
        <div className={this.state.showCommentForm ? "accordion-collapse" : "accordion-collapse accordion-close"}>
          <CommentForm addComment={this.addComment.bind(this)}/>
        </div>
        
        <div className="add-comment-container">
          <div className="add-comment-icon">
            <FontAwesomeIcon icon={faCommentDots} />
          </div>
          <button onClick={this.handleShowCommentFormClick.bind(this)} className="add-comment-button">Add Comment</button>
        </div>
      </div>  
    );
  } 
} 


export default CommentBox;
