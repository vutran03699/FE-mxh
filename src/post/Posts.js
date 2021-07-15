import React, { Component } from 'react';

import { list, countTotalPosts } from './apiPost';
import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import DefaultProfile from '../images/avatar.jpg'
import { timeDifference } from './timeDifference';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button } from 'react-bootstrap';
import posts from '../css/posts.css';

class Posts extends Component {
    constructor() {
        super();
        this.state = {
            posts: [],
            skip: 0,
            hasMore: true,
            count: 0
        }
    }

    fetchData = async () => {
        if (this.state.posts.length >= this.state.count) {
            this.setState({ hasMore: false });
            return;
        }
        const data = await list(this.state.skip)
        
        if (data.error) {
            console.log(data.error)
        } else {
            var joinedArray = this.state.posts.concat(data);
            this.setState({ posts: joinedArray}, this.updateSkip);
        }
    }

    async componentDidMount() {
        const count = await countTotalPosts()
        this.setState({count: count.data})
        this.fetchData()
    }

    updateSkip = () => {
        this.setState({ skip: this.state.posts.length })
    }



    renderPosts = (posts) => {
        return (
            <div className="row" >
                <InfiniteScroll
                    dataLength={posts.length}
                    next={this.fetchData}
                    hasMore={this.state.hasMore}
                    loader={<Loading />}
                    
                >
                    { posts.map((post, i) => {
                        const posterId = post.postedBy ? post.postedBy._id : "";
                        const posterName = post.postedBy ? post.postedBy.name : " Unknown";
                        return (
                            <div id="main-post"  key={i} className="main-content  card col-md-12 col-12 mb-5" >
                                <div className="card-header">
                                    <div className="post-group">
                                        <img
                                            className="img-cover mb-1 mr-2"
                                            src={`${process.env.REACT_APP_API_URL}/user/photo/${posterId}`}
                                            onError={i => (i.target.src = DefaultProfile)}
                                            alt={posterName}
                                        />
                                            <Link className="post-name-link" to={`/user/${posterId}`}>
                                                {posterName}
                                                
                                            </Link>

                                    </div>
                                    <p className="pull-right mt-2 mb-0">
                                        <span className="ml-2">
                                            <i className="far fa-clock"></i>{" " + timeDifference(new Date(), new Date(post.created))}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p className="card-text">{post.body}</p>
                                </div>
                                
                                <Link to={`/post/${post._id}`}>
                                    <img
                                        className="card-img-top"
                                        src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
                                        alt={post.title}
                                    />
                                </Link>
                                <div className="card-body">
                                    
                                    <Link
                                        to={`/post/${post._id}`}
                                        className="post-link">
                                            <Button variant="outline-dark" block>
                                                Read More
                                            </Button>
                                        
                                    </Link>
                                </div>

                            </div>

                        );
                    })}
                </InfiniteScroll>
            </div>
        );
    };

    render(){
        const {posts} = this.state;
        return(
                <div className="container">
                    {!posts.length ? (
                        <Loading />
                    ) : (
                            this.renderPosts(posts)
                        )}
                </div>
        );
    }
}

export default Posts;