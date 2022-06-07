import "./App.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001/");

function App() {
  const [username, setUser] = useState("");
  const [room, setRoom] = useState("");
  const [Message, setMessage] = useState("");
  const [MessageN, setMessageN] = useState([]);
  const [Chat, setChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setChat(true);
    }
  };

  const sendMessage = async () => {
    if (setMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: Message,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageN((list) => [...list, messageData]);
      Message("");
    }
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageN((list) => [...list, data]);
    });
  }, [socket]);
  axios
    .get("http://localhost:3001/")
    .then((res) => {})
    .catch((err) => {
      console.log(err);
    });

  return (
    <div className="App">
      {Chat ? (
        <>
          <div> Live Chat</div>
          <div className="Container">
            {MessageN.map((res) => {
              return (
                <div
                  className="message"
                  id={username === res.author ? "you" : "other"}
                >
                  <div>
                    <div className="message-content">
                      <p>{res.message}</p>
                    </div>
                    <div className="message-meta">
                      <p id="time">{res.time}</p>
                      <p id="author">{res.author}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <input
            type="text"
            placeholder="hey.."
            className="BarraChat"
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />

          <button onClick={sendMessage}>&#9658;</button>
          <div>
            <button
              onClick={() => {
                setChat(false);
                setRoom("");
                setMessageN([""]);
              }}
            >
              Sair do chat
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="Container">
            <div className="Card row mb-3">
              <h3>Entrar no chat</h3>
              <div className="ContainerCard">
                <div className="Input">
                  <input
                    type="text"
                    placeholder="Digite o seu nome."
                    onChange={(event) => setUser(event.target.value)}
                    className="form-control"
                  ></input>
                </div>
                <div className="Input">
                  <input
                    type="text"
                    placeholder="Digite o numero da sala"
                    className="form-control"
                    onChange={(event) => setRoom(event.target.value)}
                  ></input>
                </div>
                <button onClick={joinRoom} className="btn btn-outline-light">
                  Entrar no chat
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
