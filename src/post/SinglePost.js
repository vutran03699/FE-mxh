import React, { Component } from 'react';

import { singlePost, remove, like, unlike } from './apiPost';
import { Link, Redirect } from 'react-router-dom';
import Loading from '../loading/Loading';
import { isAuthenticated } from "../auth";

import Comment from './Comment';
import DefaultProfile from '../images/avatar.jpg'
import {timeDifference} from './timeDifference';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Singlepost from '../css/Singlepost.css'


class SinglePost extends Component {
    constructor() {
        super();
        this.state = {
            post: '',
            redirectToHome: false,
            redirectToSignin: false,
            like: false,
            likes: 0,
            comments: [],
            loading: false
        }
    }

    checkLike = (likes) => {
        const  userId = isAuthenticated() && isAuthenticated().user._id;
        let match = likes.indexOf(userId) !== -1; //true if user found
        return match;
    };

    componentDidMount() {
        const postId = this.props.match.params.postId;
        singlePost(postId)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ 
                        post: data, 
                        likes: data.likes.length, 
                        like: this.checkLike(data.likes),
                        comments: data.comments
                    });
                }
            });
    };

    updateComments = comments => {
        this.setState({ comments });
    };

    likeToggle = () => {
        this.setState({ loading: true })
        if(!isAuthenticated()){
            this.setState({ redirectToSignin: true, loading: false })
            return false; //so that rest of code isn't executed
        }
        let callApi = this.state.like ? unlike : like;
        const userId = isAuthenticated().user._id;
        const postId = this.state.post._id;
        const token = isAuthenticated().token;
        callApi(userId, token, postId)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                this.setState({
                    like: !this.state.like,
                    likes: data.likes.length,
                    loading: false
                });
            }
        });
    };

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token)
        .then(data => {
            if(data.error){
                console.log(data.error)
            } else {
                this.setState({redirectToHome: true})
            }   
        })
    }

    deleteConfirmed = () => {
        confirmAlert({
            title: 'Are you sure ?',
            message: 'you want to delete this post.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.deletePost()
                },
                {
                    label: 'No',
                }
            ]
        });
    }
    

    renderPost = (post) => {
        const posterId = post.postedBy ? post.postedBy._id : "";
        const posterName = post.postedBy ? post.postedBy.name : " Unknown";

        const { like, likes, redirectToSignin, redirectToHome, comments } = this.state;

        if(redirectToHome){
            return <Redirect to='/'></Redirect>
        } else if(redirectToSignin){
            return <Redirect to='/signin'></Redirect>
        }
        return(
            <div className="card col-md-12 mb-5 main-content"  >
                <div className="card-header">  
                    <div className="info-user">
                        <img 
                            className="mb-1 mr-2"
                            style={{ height: "40px", width: "40px", borderRadius: "50%"  }} 
                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                            onError={i => (i.target.src = DefaultProfile)} 
                            alt={posterName}
                            />
                        <Link to={`/user/${posterId}`} style={{fontSize: "20px",color:"black"}}>
                                {posterName}
                        </Link>

                    </div>
                    
                    {isAuthenticated().user && isAuthenticated().user._id === post.postedBy._id && (
                        <>
                            <PopupState style={{}} >
                                {(popupState) => (
                                    <React.Fragment>
                                        <MoreVertIcon variant="text" color="inherit" {...bindTrigger(popupState)} style={{position:"absolute",right:"0",margin:"10px"}}/>   
                                        <Menu {...bindMenu(popupState)} style={{marginBottom:"5px"}}>
                                            <MenuItem onClick={popupState.close}>
                                            <Link className="edit-post" to={`/post/edit/${post._id}`} >
                                                Edit Post
                                            </Link>
                                            </MenuItem>
                                            <MenuItem onClick={popupState.close}>
                                            <Link className="back-to-post" to={`/`}>
                                                Back to posts
                                            </Link>
                                            </MenuItem>
                                            <MenuItem onClick={popupState.close}>
                                            <p className="delete-post" onClick={this.deleteConfirmed}  >
                                                Delete Post
                                            </p>
                                            </MenuItem>
                                        
                                        </Menu>
                                    </React.Fragment>
                                )}
                            </PopupState>          
                        </>
                    )}
                
                    
                   
                   
                    
                    
                </div>
                    <p style={{ fontSize:"12px",marginLeft:"33px",marginTop:"-13px" }} >
                        <span className="ml-2">
                            <i className="far fa-clock"></i>{" "+timeDifference(new Date(), new Date(post.created))}
                        </span>
                    </p>
                    
                    
                    
                    <p style={{marginTop:"-10px"}}>{post.body}</p>
                <Link to={`/post/${post._id}`}>
                    <img 
                        className="card-img-top" 
                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                        alt={post.title}
                    />
                </Link>
                <div className="options-post">
                {like ? (
                        <div className="option-item">
                            <i onClick={this.likeToggle} className="fa fa-heart" style={{color: "red", cursor: "pointer"}} aria-hidden="true"></i>
                            
                        </div>
                    ) : (
                        <div className="option-item">
                            <i onClick={this.likeToggle} className="fa fa-heart-o" style={{ cursor: "pointer"}} aria-hidden="true"></i>
                             
                        </div>
                    )}
                    <div className="option-item">
                    <i className="far fa-comments ml-3"></i>
                    </div>
                    <div className="option-item">
                        <span style={{fontSize: "15px",fontWeight:"bold"}} className="ml-3" >{likes} Likes </span>
                    </div>
                    
                    
                </div>
                   
                
                <div className="card-body">
                    
                    
                    
                    <Comment postId={post._id} comments={comments.reverse()} updateComments={this.updateComments} />
                </div>
            </div>
        );
    }

    render() {
        const { post, loading } = this.state;
        return (
            <div className="container">
                {(!post || loading) ? (
                    <Loading />
                ) : (
                    this.renderPost(post)
                )}
                
                
            </div>
        );
    }
}

export default SinglePost;