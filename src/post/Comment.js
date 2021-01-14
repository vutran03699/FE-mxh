import React, { Component } from 'react';
import { comment, uncomment } from './apiPost';
import { isAuthenticated } from '../auth';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import Picker from 'emoji-picker-react';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import {timeDifference} from './timeDifference';
import { Button } from 'react-bootstrap';
import { Typography , TextField, Input, IconButton} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import Loading from '../loading/Loading';

import '../css/Comment.css';

class Comment extends Component {
    constructor() {
        super()
        this.state = {
            text: "",
            error: "",
            chosenEmoji: null,
            showPicker: false,
            loading: false
        }
    }

    handleChange = e => {
        this.setState({ text: e.target.value, error: "" })
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0) {
            this.setState({
                error: "Nhận xét không được để trống"
            })
            return false
        }
        if (text.length > 150) {
            this.setState({
                error: "Nhận xét không được dài hơn 150 ký tự"
            })
            return false
        }
        return true
    }

    addComment = e => {
        e.preventDefault();
        if (!isAuthenticated()) {
            this.setState({
                error: "Vui lòng Đăng nhập trước để để lại bình luận"
            });
            return false
        }
        if (this.isValid()) {
            this.setState({loading: true})
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            const postId = this.props.postId;
            const commentText = { text: this.state.text }

            comment(userId, token, postId, commentText)
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                    } else {
                        this.setState({
                            text: "",
                            showPicker: false,
                            loading: false
                        });
                        // gửi cập nhật/danh sách mới của ý kiến để các thành phần comment trc
                        this.props.updateComments(data.comments);
                    }
                });
        }
    };

    deleteComment = (comment) => {
        this.setState({loading: true})
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        const postId = this.props.postId;

        uncomment(userId, token, postId, comment)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({loading: false})
                    // gửi cập nhật/danh sách mới của ý kiến để các thành phần comment trc
                    this.props.updateComments(data.comments);
                }
            });
    };

    deleteConfirmed = (comment) => {
        confirmAlert({
            title: 'Bạn có chắc không ?',
            message: 'bạn muốn xóa bình luận này ?',
            buttons: [
                {
                    label: 'Có',
                    onClick: () => this.deleteComment(comment)
                },
                {
                    label: 'Không',
                }
            ]
        });
    }

    onEmojiClick = (event, emojiObject) => {
        let comment = this.state.text;
        comment = comment + emojiObject.emoji;
        this.setState({
            chosenEmoji: emojiObject,
            text: comment
        })
    }

    render() {
        const { text, error, showPicker, loading } = this.state;
        const { comments } = this.props;

        return(
            <div className="comment-post">
                { loading ? (
                    <Loading />
                ) : (
                    <div>
                            
                            <p style={{display:"flex",justifyContent:"space-between",fontWeight:"bold",fontSize:"16px"}}>
                                Để lại bình luận <span>{comments.length} bình luận</span>
                            </p>
                       <div style={{position:"absolute",zIndex:"10",top:"589px",right:"0"}}>
                        {showPicker ? <Picker onEmojiClick={this.onEmojiClick} /> : ""}
                       </div>
                        
                        <div className="panel-body">
                        
                            <form onSubmit={this.addComment}>
                                <div className="input-group">
                                    <Input
                                        style={{marginTop:"5px"}}
                                        fullWidth
                                        placeholder="Write your comments"
                                        onChange={this.handleChange}
                                        value={text}
                                        endAdornment={
                                            <InputAdornment style={{cursor:"point"}} position="end" onClick={() => this.setState({ showPicker: !showPicker })}>
                                                <IconButton>
                                                    <SentimentSatisfiedOutlinedIcon />
                                                </IconButton>
                                            </InputAdornment>
                                          }
                                    />
                                </div>
                                               
                            </form>
                            
                            <div className="alert alert-danger mt-5" style={{ display: error ? "" : "none" }}>
                                {error}
                            </div>


                            <br />
                            <div className="clearfix"></div>
                            <hr />
                                <ul className="media-list" >
                                {comments.reverse().map((comment, i) => (
                                    <li key={i} className="media">
                                        <Link to={`/user/${comment.postedBy._id}`} >
                                            <img 
                                                src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                                                onError={i => (i.target.src = DefaultProfile)}
                                                alt={comment.postedBy.name}
                                                className="rounded-circle z-depth-2 mr-2"
                                            />
                                        </Link>
                                        <div className="media-body">
                                            <span className="text-muted pull-right">
                                                <small className="text-muted">
                                                    <i className="far fa-clock"></i>{" "+timeDifference(new Date(), new Date(comment.created))}
                                                </small>
                                                <br />
                                                <span>
                                                    {isAuthenticated().user && isAuthenticated().user._id === comment.postedBy._id && (
                                                        <>
                                                            <span onClick={() => this.deleteConfirmed(comment)} className="text-danger float-right mr-2 mt-2 " style={{ cursor: "pointer" }}>
                                                                <i className="fas fa-trash"></i>
                                                            </span>
                                                        </>
                                                    )}
                                                </span>
                                            </span>
                                        <Link to={`/user/${comment.postedBy._id}`} >
                                            <strong className="text-success">{comment.postedBy.name}</strong>
                                        </Link>
                                            <p>
                                                {comment.text}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                </div>
                )}
        </div>
        );
    }
}

export default Comment;