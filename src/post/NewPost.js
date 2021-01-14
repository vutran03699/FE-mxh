import React, { Component } from 'react';

import { create } from "./apiPost";
import { isAuthenticated } from "../auth";
import Loading from '../loading/Loading';
import { Redirect } from 'react-router-dom';
import { Typography , TextField, Input} from '@material-ui/core';
import { Button } from 'react-bootstrap';
import '../css/newpost.css'



class NewPost extends Component {

    constructor() {
        super();
        this.state = {
           
            body: "",
            photo: "",
            error: "",
            user: {},
            fileSize: 0,
            loading: false,
            redirectToProfile: false
        };
    }

    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user});
    }

    isValid = () => {
        const {  body, fileSize, photo } = this.state;
        if (fileSize > 1000000) {
            this.setState({ error: "Kích thước tệp phải nhỏ hơn 1 MB", loading: false });
            return false;
        }
        if(photo.length === 0){
            this.setState({ error: "Thiếu Ảnh", loading: false });
            return false;
        }
        // if (title.length === 0) {
        //     this.setState({ error: "Thiếu tiêu đề", loading: false });
        //     return false;
        // }
        if (body.length === 0) {
            this.setState({ error: "Thiếu nội dung", loading: false });
            return false;
        }
        return true;
    }

    handleChange = e => {
        const value = e.target.name === 'photo' ? e.target.files[0] : e.target.value;
        const fileSize = e.target.name === 'photo' ? e.target.files[0].size : 0;
        //Form Data method set
        this.postData.set(e.target.name, value);
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
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            create(userId, token, this.postData)
                .then(data => {
                    if (data.error) {
                        this.setState({ error: data.error, loading: false });
                    } else {
                        this.setState({ 
                          //  title: "",
                            body: "",
                            photo: "",
                            loading: false,
                            redirectToProfile: true
                        });
                        //console.log("NEW POST ",data);
                    }
                });
        }
    };

    newPostForm = ( body) => (
        <form>
            <div className="form-group">
                <Input
                    label="Photo"
                    onChange={this.handleChange}
                    name="photo"
                    type="file"
                    accept="image/*"
                    className="form-control"
                />
            </div>
           
            <div className="form-group">
                <TextField
                    label="Status"
                    multiline
                    onChange={this.handleChange}
                    type="text"
                    name="body"
                    className="form-control"
                    value={body}
                />
            </div>

            <Button onClick={this.clickSubmit} variant="outline-dark" block>Create Post</Button>
        </form>
    );

    render() {

        const {  body, user, loading, error, redirectToProfile } = this.state;
        if (redirectToProfile) {
            return <Redirect to={`/user/${user._id}`}></Redirect>
        }

        return (
            <div className="main-newPost" >
                <h2 className="mt-5 mb-5" style={{textAlign:"center"}}>Create a new post</h2>
                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                {loading ? (
                    <Loading />
                ) : (
                    this.newPostForm( body)
                )}
            </div>
        );
    }
}

export default NewPost;