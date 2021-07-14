import React, { Component } from 'react';

import { read, getChatList } from './apiUser';
import { isAuthenticated } from "../auth";

import '../css/Chat.css'
import DefaultProfile from '../images/avatar.jpg';

import Loading from '../loading/Loading';
import { Link } from 'react-router-dom';

import chatdef from '../css/chatdef.css'

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            sender: {},
            chatList: [],
            loading: false,
        };
    }
    

    init = async (userId) => {
        const token = isAuthenticated().token;
        const user = await read(userId, token);
        if (user.error) {
            console.log(user.error)
        } else {
            return user;
        }
    };

    async componentWillMount() {
        this.setState({ loading: true });
        const senderId = this.props.match.params.userId;
        const chatList = await getChatList(senderId)
        
        if(chatList.error){
            console.log(chatList.error)
        } else {
            this.setState({ loading: false, chatList: chatList })
        }
    }

    async componentDidMount() {
        const senderId = this.props.match.params.userId;
        const sender = await this.init(senderId);
        this.setState({ sender });
    }

    render() {
        const { chatList, sender, loading } = this.state;
        return (
            
            <div className="container-fluid">
                <div className="page-title">
                    <div className="row gutters">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            
                        </div>
                    </div>
                </div>
                <div className="loading-chat">
                    { loading ? 
                        (<Loading />) 
                        : 
                        ("")
                    }

                </div>
                <div className="content-wrapper" style={{ display: loading ? "none" : "" }}>
                    <div className="row gutters">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <div className="card card-chat m-0">
                                <div className="row no-gutters">
                                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                                        <div className="users-container">
                                            {/* <div className="chat-search-box">
                                                <div className="input-group">
                                                    <input className="form-control" placeholder="Search" />
                                                    <div className="input-group-btn">
                                                        <button type="button" className="btn btn-info">
                                                            <i className="fa fa-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div> */}
                                            <ul className="users" style={{ display: loading ? "none" : "" }} >
                                                { chatList.length === 0 ? (
                                                    <p className="text-center p-2">
                                                        <strong>No chats found. </strong>
                                                        <br />
                                                        Go to someone's profile from 
                                                        <Link to="/findpeople"> Find people </Link>
                                                        tab or from your 
                                                        <Link to={`/user/${isAuthenticated().user._id}`} > followers/following </Link>
                                                        tab and click message button to start chatting.
                                                    </p>
                                                ) : ("") }
                                                { chatList.map((user, i) => (
                                                    <a key={i} href={`/chat/${sender._id}/${user._id}`}>
                                                        <li className="person" data-chat="person1">
                                                            <div className="user">
                                                                <img 
                                                                    src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                                                                    alt={user.name}
                                                                    onError={i => (i.target.src = DefaultProfile)} 
                                                                />
                                                            </div>
                                                            <p className="name-time">
                                                                <span className="name">{ user.name }</span>
                                                            </p>
                                                        </li>
                                                    </a>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9" >
                                        <div className="selected-user">
                                            <span>To: <span className="name"></span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Chat;
