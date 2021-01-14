import React, { Component } from 'react';

import Loading from '../loading/Loading';

import { read, update, updateUser } from "./apiUser";
import { isAuthenticated } from "../auth";
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.jpg';
import { Typography , TextField, Input} from '@material-ui/core';
import {Button} from 'react-bootstrap';


class EditProfle extends Component {

    constructor() {
        super();
        this.state = {
            id: "",
            name: "",
            email: "",
            about: "",
            password: "",
            loading: false,
            redirectToProfile: false,
            error: "",
            fileSize: 0
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
            .then(data => {
                if (data.error) {
                    this.setState({ redirectToProfile: true })
                } else {
                    this.setState({ 
                        id: data._id,
                        name: data.name,
                        email: data.email,
                        error: "" ,
                        about: data.about
                    });
                }
            })
    }

    componentDidMount() {
        this.userData = new FormData()
        const userId = this.props.match.params.userId;
        this.init(userId);
    }

    isValid = () => {
        const { name, email, password, fileSize } = this.state;
        const userId = this.props.match.params.userId;
        if(userId !== isAuthenticated().user._id){
            this.setState({ error: "You are not authorized to do this !!", loading: false });
            return false;
        }

        if (fileSize > 1000000) {
            this.setState({ error: "File size should be less than 1 MB", loading: false });
            return false;
        }

        if (name.length === 0) {
            this.setState({ error: "Name is required", loading: false });
            return false;
        }
        //test regular expression with 'test' keyword
        if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            this.setState({ error: "Please enter a valid email address.", loading: false });
            return false;
        }
        if (password.length >= 1 && password.length <= 5) {
            this.setState({ error: "Password must be at least 6 characters long", loading: false });
            return false;
        }
        return true;
    }

    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        this.userData.set(e.target.name, value);
        this.setState({
            error: "",
            [e.target.name]: value,
            fileSize
        });
    };

    clickSubmit = e => {
        e.preventDefault();
        this.setState({ loading: true })
        if (this.isValid()) {
            //const { name, email, password } = this.state;
            //const user = { name, email, password: password || undefined };
            // console.log(user);
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
            update(userId, token, this.userData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        updateUser(data, () => {    
                            this.setState({
                                redirectToProfile: true
                            });
                        })
                    }
                });
        }

    };

    signupForm = (name, email, password, loading, about) => (
        <form>
            <div className="form-group">
                
                <Input
                    onChange={this.handleChange}
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Name"
                    onChange={this.handleChange}
                    name="name"
                    type="text"
                    className="form-control"
                    value={name}
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Email"
                    onChange={this.handleChange}
                    type="email"
                    name="email"
                    className="form-control"
                    value={email}
                />
            </div>
            <div className="form-group">
                <TextField
                    multiline
                    label="About"
                    onChange={this.handleChange}
                    type="text"
                    name="about"
                    className="form-control"
                    value={about}
                />
            </div>
            <div className="form-group">
                <TextField
                    label="Password"
                    onChange={this.handleChange}
                    type="password"
                    name="password"
                    className="form-control"
                    value={password}
                />
            </div>
            
            <Button variant="outline-dark" block  onClick={this.clickSubmit}  >Update</Button>
        </form>
    );

    render() {

        const { id, name, email, password, loading, redirectToProfile, error, about } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`}></Redirect>
        }
        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile ;

        return (
            <div className="container" 
            style=
            {{backgroundColor:"white",
            width:"60%",
            boxShadow:"20px 20px 50px rgba(0,0,0,0.5)",
            padding:"20px",
            borderRadius:"16px"
            }}>
                
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <img 
                    style={{ display: loading ? "none" : "" , height: "200px", width: "auto" }} 
                    className="img-thumbnail" 
                    style={{boxShadow:"20px 20px 50px rgba(0,0,0,0.5)",marginLeft:"auto",marginRight:"auto", display:"block",borderRadius:"100%"}}
                    src={photoUrl} 
                    onError={i => (i.target.src = DefaultProfile)}
                    alt={name} 
                />
                {loading ? (
                    <Loading />
                ) : (
                    this.signupForm(name, email, password, loading, about)
                )}
            </div>
        );
    }
}

export default EditProfle;