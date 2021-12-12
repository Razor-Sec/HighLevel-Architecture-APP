import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import ErrorMessage from "./ErrorMessage";

const Register = () =>{
    const [email, setEmail] = useState("");
    const [password, setpassword] = useState("");
    const [confirmationPassword, setconfirmationPassword] = useState("");
    const [errorMessage, seterrorMessage] = useState("");

    const [, setToken] = useContext(UserContext);

    const submitReg = async () => {
        const req = {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({email: email, hashed_password: password }),
        };

        const res = await fetch("/api/users" , req);
        const data = await res.json();

        if(!res.ok) {
            seterrorMessage(data.detail);
        }else {
            setToken(data.access_token);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(password === confirmationPassword && password.length > 2) {
            submitReg();
        }else {
            seterrorMessage("Make sure that password match and greater than 2")
        };
    }

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={email} 
                        onChange={ (e) => setEmail(e.target.value) }
                        className="input"
                        required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                        <div className="control">
                            <input 
                            type="password" 
                            placeholder="Enter your password" 
                            value={password} 
                            onChange={ (e) => setpassword(e.target.value) }
                            className="input"
                            required
                            />
                        </div>
                </div>
                <div className="field">
                    <label className="label">Confirm Password</label>
                        <div className="control">
                            <input 
                            type="password" 
                            placeholder="Enter your confirm password" 
                            value={confirmationPassword} 
                            onChange={ (e) => setconfirmationPassword(e.target.value) }
                            className="input"
                            required
                            />
                        </div>
                </div>
                <ErrorMessage message={errorMessage}/>
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
            </form>
        </div>
    )
};

export default Register;