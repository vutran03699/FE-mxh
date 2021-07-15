import React, { Component } from "react";
import { resetPassword } from "../auth";
import { Button } from 'react-bootstrap';
import { TextField } from '@material-ui/core';

import resetpassword from '../css/resetpassword.css'
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            message: "",
            error: ""
        };
    }

    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };

    render() {
        const { message, error } = this.state;
        return (
            <div className="container btn-gg-social">
                <h2 className="mt-5 mb-5">Reset your Password</h2>

                <div className="alert alert-danger" style={{ display: error ? "" : "none" }}>
                    {error}
                </div>
                <div className="alert alert-danger" style={{ display: message ? "" : "none" }}>
                    {message}
                </div>
                <form>
                    <div className="form-group mt-5">
                        <TextField
                            label="Your new password"
                            autoFocus={true}
                            variant="outlined"
                            type="password"
                            className="form-control"
                            value={this.state.newPassword}
                            name="newPassword"
                            onChange={e =>
                                this.setState({
                                    newPassword: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    <Button
                        variant="outline-dark"
                        onClick={this.resetPassword}
                        className=""
                        block
                    >
                        Reset Password
                    </Button>
                </form>
            </div>
        );
    }
}

export default ResetPassword;