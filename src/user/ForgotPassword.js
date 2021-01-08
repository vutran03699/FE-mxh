import React, { Component } from "react";
import { forgotPassword } from "../auth";
import forgotpassword from '../css/ForgotPassword.css'
import { Typography , TextField} from '@material-ui/core';
import Fade from 'react-reveal'
import { Button } from 'react-bootstrap';
class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };

    forgotPasswordFunction = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };

    render() {
        const { message, error } = this.state;
        return (
            <Fade left>
            <div className="main-forgot">
                <Fade top>
                    
                        <img className="img-logo"  src={require('../images/logo.png')} alt="logo"/>
                    
                    <h2 className="title-forgot" style={{fontSize: "3vw",marginTop:"10px"}}>RECOVER YOUR PASSWORD</h2>
                </Fade>
                
                
                <Fade top>
                    <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                        {error}
                    </div>
                    <div className="alert alert-danger" style={{ display: message ? "" : "none" }}>
                        {message}
                    </div>
                </Fade>
                
                
                <form>
                    
                    <div className="form-group mt-5">
                        <TextField
                            label="Email"
                            variant="outlined"
                            type="email"
                            className="form-control"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <Button
                         style={{display:"block",margin: "0 auto"}}
                        variant="outline-dark"
                        onClick={this.forgotPasswordFunction}
                        
                    >
                        Send Reset Password
                    </Button>
                    
                </form>
                
                
            </div>
            </Fade>
        );
    }
}

export default ForgotPassword;