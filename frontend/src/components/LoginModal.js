import React from "react";
import { useState } from "react/cjs/react.development";

const LeadModal = ({active, handleModal, token, id, setErrorMessage}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [note, setNote] = useState("");
    const cleanFormData = () => {
        setFirstName("");
        setLastName("");
        setCompany("");
        setEmail("");
        setNote("");

    };

    const handleCreateLead = async (e) => {
        e.preventDefault();
        const reqOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+ token,
            },
            body: JSON.stringify({first_name: firstName, last_name: lastName, company: company, email: email , note: note}),
        };
        const res = await fetch("/api/leads" , reqOptions);
        if(!res.ok){
            setErrorMessage("Something went wrong shen creating lead");
        } else {
            cleanFormData();
            handleModal();
        }
    };

    return(
        <div className={`modal ${active && "is-active" }`}>
            <div className="modal-background" onClick={handleModal}> </div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">{ id ? "Update Lead" : "Create Lead"} </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">First Name</label>
                            <div className="control">
                                <input type="text" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Last Name</label>
                            <div className="control">
                                <input type="text" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Company</label>
                            <div className="control">
                                <input type="text" placeholder="Enter Company" value={company} onChange={(e) => setCompany(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="control">
                                <input type="text" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} className="input" required />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Note</label>
                            <div className="control">
                                <input type="text" placeholder="Enter Note" value={note} onChange={(e) => setNote(e.target.value)} className="input" required />
                            </div>
                        </div>
                    </form>
                </section>
                <footer className="modal-card-foot has-background-primary-light">
                    {id ? (<button className="button is-info" > Update </button>) : (<button className="button is-primary" onClick={ handleCreateLead } >Create</button> )}
                    <button  className="button" onClick={handleModal}>Cancel</button>
                </footer>
            </div>
        </div>
    );
};

export default LeadModal;