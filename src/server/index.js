const express = require("express");
const app = express();
const axios = require("axios");
const server = require("http").createServer(app);
const io = require("socket.io").listen(server);
const dotenv = require('dotenv').config();
const models = require("../models");

server.listen(3000, () => console.log('Server listen 3000'));

io.on("connection", (socket) => {

    console.log("a user connected: " + socket.id);

    socket.on("INIT_APP", (data) => {

        const { email, telephone, messages } = data;

        models.User.findOneAndUpdate({ email }, { $setOnInsert: { email, telephone, messages } }, 
            { upsert: true, new: true }).then(user => {

            if (user.messages != null) {

                socket.emit("NEW_MESSAGE_SERVER", { ...user._doc, type: "INIT_APP", messages: user.messages }); 
            
            }
            else {

                var initChat = ['olá', 'Hey', 'Opa', 'Oi', 'Eae'];

                var numberRandom = parseInt(Math.random() * 5);

                axios.post(`http://127.0.0.1:5000/${initChat[numberRandom]}`)
                .then(res => {
                    socket.emit("NEW_MESSAGE_SERVER", { ...user._doc, type: "INIT_APP",
                    messages: { originMessage: "server", textMessage: res.data.texto_respondido } }); 
                })
                .catch(err => console.log(err.message));
         
            }


        }).catch(error => console.log('Error => ' + error.message));

    });

    socket.on("NEW_MESSAGE_CLIENT", (data) => {

        axios.post(`http://127.0.0.1:5000/${data.message}`)
        .then(res => {
            socket.emit("NEW_MESSAGE_SERVER", { type: "NEW_MESSAGE", originMessage: "server", textMessage: res.data.texto_respondido });
        })
        .catch(err => console.log(err.message));

    });
    
    socket.on("UPDATE_USER", (user) => {  

        const { _id, email, telephone, messages } = user;

        models.User.updateOne({ _id }, { email, telephone, messages })
        .then(() => console.log("Usuário Atualizado"))
        .catch(error => console.log('Error => ' + error.message));

    });

});