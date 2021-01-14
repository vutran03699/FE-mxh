import { Button } from '@material-ui/core';
import React, { Component } from 'react';
import { follow, unfollow } from './apiUser';


class FollowProfileButton extends Component{

    followClick = () => {
        this.props.onButtonClick(follow);
    };

    unfollowClick = () => {
        this.props.onButtonClick(unfollow);
    };

    render(){
        return(
            <>
                { !this.props.following ? 
                    (
                        <Button onClick={this.followClick} variant="outlined" className="">Follow</Button>
                    ) : (
                        <Button onClick={this.unfollowClick} variant="outlined" className="">UnFollow</Button>
                    )
                } 
            </>
        );
    }
}

export default FollowProfileButton;