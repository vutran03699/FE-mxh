import React from 'react';
import { Link } from 'react-router-dom';
import notfoundpage from '../css/notfoundpage.css'

const NotFounh = () => (
    <div>
        <div className="container">
            <h1 className="first-four">4</h1>
            <div className="cog-wheel1">
                <div className="cog1">
                    <div className="top" />
                    <div className="down" />
                    <div className="left-top" />
                    <div className="left-down" />
                    <div className="right-top" />
                    <div className="right-down" />
                    <div className="left" />
                    <div className="right" />
                </div>
            </div>
            <div className="cog-wheel2">
                <div className="cog2">
                    <div className="top" />
                    <div className="down" />
                    <div className="left-top" />
                    <div className="left-down" />
                    <div className="right-top" />
                    <div className="right-down" />
                    <div className="left" />
                    <div className="right" />
                </div>
            </div>
            <h1 className="second-four">4</h1>
            <p className="wrong-para">Uh Oh! Page not found!</p>
        </div>

        <Link to="/">Go Home</Link>
    </div>
);
export default NotFounh();