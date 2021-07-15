import React, { Component } from 'react';

import { signup } from "../auth";

import { Link } from 'react-router-dom';
import Loading from '../loading/Loading';
import SocialLogin from "./SocialLogin";

import register from '../css/register.css'
import { Typography , TextField} from '@material-ui/core';
import Fade from 'react-reveal';
import { Alert } from '@material-ui/lab';
import { Button } from 'react-bootstrap';
import Grid from '@material-ui/core/Grid';

class Signup extends Component {
    constructor(){
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            error: "",
            open: false,
            loading: false,
            recaptcha: true
        }
    }

    recaptchaHandler = e => {
        this.setState({ error: "" });
        let userDay = e.target.value.toLowerCase();
        let dayCount;

        if (userDay === "sunday") {
            dayCount = 0;
        } else if (userDay === "monday") {
            dayCount = 1;
        } else if (userDay === "tuesday") {
            dayCount = 2;
        } else if (userDay === "wednesday") {
            dayCount = 3;
        } else if (userDay === "thursday") {
            dayCount = 4;
        } else if (userDay === "friday") {
            dayCount = 5;
        } else if (userDay === "saturday") {
            dayCount = 6;
        }

        if (dayCount === new Date().getDay()) {
            this.setState({ recaptcha: true });
            return true;
        } else {
            this.setState({
                recaptcha: false
            });
            return false;
        }
    };


    handleChange = e => {
        this.setState({
            error: "",
            open: false,
            [e.target.name]: e.target.value
        });
    };


    clickSubmit = e => {
        e.preventDefault();
        this.setState({loading: true})
        const { name, email, password } = this.state;
        const user = { name, email, password };
        // console.log(user);
        if (this.state.recaptcha) {
            signup(user)
            .then(data => {
                if(data.error){
                    this.setState({error: data.error, loading: false});
                } else {
                    this.setState({
                        name: "",
                        email: "",
                        password: "",
                        error: "",
                        open: true,
                        loading: false
                    });
                }
            });
        } else {
            this.setState({
                loading: false,
                error: "What day is today? Please write a correct answer!"
            });
        }
        
    };


    signupForm = (name, email, password, loading, recaptcha) => (
        <form style={{ display: loading ? "none" : "" }}>
            <div className="form-group">
                
                <TextField 
                    label="Name"
                    variant="outlined"
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
                    variant="outlined"
                    onChange={this.handleChange} 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={email} 
                />
            </div>
            <div className="form-group">
                
                <TextField
                    label="Password" 
                    variant="outlined"
                    onChange={this.handleChange} 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    value={password} 
                />
            </div>
           
            <Button onClick={this.clickSubmit} 
                    className="btn-signup" 
                    variant="outline-dark"
                    block
                    >
                    Sign Up
            </Button>
        </form>
    );


    render(){
        const { name, email, password, error, open, loading, recaptcha } = this.state;
        return (
            <Grid className="wrapper" container spacing={0} >
                 <Grid item lg={7} sm={6} xs={12}>
                    <div className="left-register">
                            <Fade top>
                                <img className="img-logo" src={require('../images/logo.png')} alt="logo"/>  
                            </Fade>
                            
                            <Fade left>
                                <Typography className="title-welcome" variant="h4" color="inherit">
                                    Welcome to the Social App !
                                </Typography>
                            </Fade>
                            <Fade up>
                                <Typography variant="subtitle1" color="inherit" className="max-w-512 mt-16 sign-up-des">
                                    Ứng dụng vô địch siêu cấp vũ trụ 
                                </Typography>
                            </Fade>
                    </div>
                 </Grid>
                 <Grid item lg={5} sm={6}  xs={12}>
                    <Fade right>
                        <div className="right-register" >
                            <h2 className="title-register">Sign Up</h2>
                            
                            
                            
                            <hr />
                            <Alert className="alert alert-danger" style={{ display: error ? "" : "none" }} severity="error">
                                {error}
                            </Alert>
                            <Alert className="alert alert-info" style={{ display: open ? "" : "none" }} severity="info">
                                New account is successfully created. Please <Link to='/signin'>Sign In</Link>.
                            </Alert>
                            
                            {this.signupForm(name, email, password, loading, recaptcha)}
                            { loading ? (
                                <Loading />
                            ) : (
                                ""
                            )}
                            <hr />
                            <div className="sign-up-or">Or</div>
                            <div className="google-login">
                                <SocialLogin for="signup" />
                            </div>
                            
                        </div>
                    </Fade>
                 </Grid>
                
            </Grid>
        );
    }
}

export default Signup;