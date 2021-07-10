import React, { Component } from 'react';

import { findPeople, follow } from './apiUser';
import DefaultProfile from '../images/avatar.jpg';
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/index';

import Loading from '../loading/Loading';
import { Button } from '@material-ui/core';

import findpeople from '../css/findpeople.css'

class FindPeople extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            error: "",
            open: false,
            followMessage: "",
            loading: false
        }
    }

    componentDidMount() {
        this.setState({loading: true})
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;
        findPeople(userId, token)
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                } else {
                    this.setState({ users: data, loading: false });
                }
            })
    }

    clickFollow = (user, i) => {
        this.setState({loading: true})
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        follow(userId, token, user._id)
            .then(data => {
                if (data.error) {
                    this.setState({ error: data.error })
                } else {
                    let toFollow = this.state.users;
                    toFollow.splice(i, 1);
                    this.setState({
                        users: toFollow,
                        open: true,
                        followMessage: `Following ${user.name}`,
                        loading: false
                    })
                }
            })
    };

    renderUsers = (users) => (
        <div className="row" style={{justifyContent:"center"}}>
            {users.map((user, i) => (
                <div key={i} className="card col-lg-3 col-md-4 col-12" style={{ padding: "0", margin: "15px"}} >
                    <img 
                        style={{  }}
                        height= "250"
                        width= "250"
                        className="card-img-top"
                        src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
                        onError={i => (i.target.src = DefaultProfile)}
                        alt={user.name}
                    />
                    <div className="card-body">
                        <h5 className="card-title" style={{textAlign:"center"}}>{user.name}</h5>
                    </div>
                    <div className="card-body fpb_group">
                        <Link
                        style={{textDecoration:"none"}}
                            to={`/user/${user._id}`}
                            className="fpb_link-view">
                                <Button variant="outlined">
                                View Profile
                                </Button>
                            
                        </Link>
                        <Button
                        
                        variant="outlined"
                        onClick={() => this.clickFollow(user, i)} className=" pull-right">
                            Follow
                        </Button>
                    </div>
                </div>
            ))}
        </div>

            );

    render(){
        const {users, open, followMessage, loading} = this.state;
        return(
            <div className="container">
                <h2 className="mt-5 mb-5">Find People</h2>
                {open && (
                    <div className="alert alert-success text-center">
                        {followMessage}
                    </div>
                )}
                {loading ? (
                    <Loading />
                ) : (
                    this.renderUsers(users)
                )}
            </div>
        );
    }
}

export default FindPeople;