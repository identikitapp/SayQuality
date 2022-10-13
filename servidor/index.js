require('dotenv').config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const app = express();

const privateKey = fs.readFileSync('sslcert/privkey.pem', 'utf8');
const certificate = fs.readFileSync('sslcert/fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };
const httpsServer = https.createServer(credentials, app);

const { WebSocketServer } = require("ws");
const wss = new WebSocketServer({ noServer: true });

httpsServer.on('upgrade', function upgrade(request, socket, head) {
    if (request.headers.upgrade != "websocket") {
        socket.destroy();
    };

    if (request.url == "/chats") {
        require("./middlewares/websocketAuthentication.js")(request, (req) => {
            wss.handleUpgrade(req, socket, head, function done(ws) {
                wss.emit('connection', ws, request);
            });
        });
    } else {
        socket.destroy();
    };

});

wss.on("connection", require("./middlewares/websocketChat"));

app.use(express.urlencoded({ extended: true }));
app.use(["/forms", "/chats", "/courses", "/users"], express.json({limit: "1mb"}));
app.use(["/images"], express.text({type: "image/png", limit: "8mb", defaultCharset: "binary"}));
app.use(cors());

app.use(require("./middlewares/error.js"));

app.use(require("./middlewares/headerCheck.js"));

app.use(require("./middlewares/authentication.js"));

app.use("/users", require("./routes/users.js"));
app.use("/courses", require("./routes/courses.js"));
app.use("/chats", require("./routes/chats.js"));
app.use("/images", require("./routes/images.js"));
app.use("/forms", require("./routes/forms.js"));

/*app.get('/', function (req, res) {
});*/

app.all("*", function (req, res) {
    res.status(404).json({ "status": "error", "message": "La ruta no existe." });
});

//crear servidor https

httpsServer.listen(process.env.HTTPPort, process.env.HTTPHost, () => {
    console.log("Servidor en funcionamiento");
});