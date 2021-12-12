import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import ErrorMessage from "./ErrorMessage";
import LeadModal from "./LoginModal";
import { UserContext } from "../context/UserContext";

const Table = () => {
    const [token] = useContext(UserContext);
    const [leads, setLeads] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [id , setId] = useState(null);
    
    const getLeads = async () => {
        const reqOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer "+ token,
            },
        };
        const res = await fetch("/api/leads", reqOptions);
        if(!res.ok) {
            setErrorMessage("Something Wrong");
        }else {
            const data = await res.json();
            setLeads(data);
            setLoaded(true);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        const requestOptions = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        };
        const response = await fetch(`/api/leads/${e.target.value}`, requestOptions);
        if (!response.ok) {
          setErrorMessage("Failed to delete lead");
        }
        getLeads();
    };

    


    const handleModal = () => {
        setActiveModal(!activeModal);
        getLeads();
        setId(null);
    };

    useEffect(() => {
        getLeads();
    }, []);

    return(
        <>
            <LeadModal active={activeModal} handleModal={handleModal} token={token} id={id} setErrorMessage={setErrorMessage}/>
            <button className="button is-fullwidth mb-5 is-primary" onClick={() => setActiveModal(true)}>Created Lead</button>
            <ErrorMessage message={errorMessage} />
            { loaded && leads ? (
                <table className="table is-fullwidth"> 
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Company Name</th>
                            <th>Email</th>
                            <th>Note</th>
                            <th>Last Updated</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { leads.map((lead) => (
                            <tr key={ lead.id }> 
                                <td>{lead.first_name}</td>
                                <td>{lead.last_name}</td>
                                <td>{lead.company}</td>
                                <td>{lead.email}</td>
                                <td>{lead.note}</td>
                                <td>{moment(lead.date_last_updated).format("MMM Do YY")}</td>
                                <td>
                                    <button className="button mr-2 is-info is-light"> Update </button>
                                    <button className="button mr-2 is-danger is-light" value={lead.id} onClick={handleDelete} > Deleted </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ): ( <p>Anjay</p> ) }
        </>
    )
};

export default Table;