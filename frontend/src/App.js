import React, { useState , useEffect, useContext} from "react";
import Register from "./components/Register";
import Header from "./components/Header";
import Table from "./components/Table";
import { UserContext } from "./context/UserContext";
import Login from "./components/Login";

const App = () => {
  const [message, setMessage] = useState("");
  const [token,] = useContext(UserContext);

  const getWelcomeMessage = async () =>{
    const req = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch("/api", req);
    const data = await res.json()

    if (!res.ok) {
      console.log("Something Error")
    }else{
      setMessage(data.message)
    }
  };

  useEffect(() => {
    getWelcomeMessage();
  }, []);

  return (
    <>
      <Header title={message} />
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {
            !token ? (
              <div className="columns">
                <Register /> <Login />
              </div>
            ) : (
              <Table />
            )
          }
        </div>
        <div className="column"></div>

      </div>
    </>
  );
}

export default App;
