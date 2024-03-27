"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
var http = require('http');
var ws = require('ws');
var express = require('express');
var app = express();
// const expressWs = require('express-ws')(app)
var bcrypt = require('bcrypt');
var save = require('../DB/save').save;
var getUserByName = require('./DB/getUser').getUserByName;
var authMiddleware = require("./middleware/auth");
var jwt = require('jsonwebtoken');
var cors = require('cors');
app.use(cors());
app.use(express.json());
require('dotenv').config();
var _a = require('pg'), Pool = _a.Pool, Client = _a.Client;
var log = require('console').log;
var client = new Client({
    connectionString: process.env.DATABASE_URL_CLIENT
});
function authenticate_(req, res, next) {
    console.log("authenticating");
    var authHeader = req.headers['Authorization'];
    var token = authHeader && authHeader.split(' ')[1];
    if (token == null)
        return res.send(401);
    jwt.verify(token, process.env.SECRET_KEY, function (err, user) {
        if (err) {
            return res.send(401);
        }
        req.user = user;
    });
    next();
}
function authWebSocket(req) {
    var params = new URLSearchParams(req.url);
    var token = params.get('/?clientId');
    console.log("TOKEN :", token.toLocaleLowerCase());
    if (token === 'null') {
        return false;
    }
    jwt.verify(token, process.env.SECRET_KEY, function (err, user) {
        if (err) {
            return false;
        }
    });
    return true;
}
//app.use('api/v1/auth',authRouter);
app.use('api/v1/auth', authMiddleware);
// app.use('/',authenticate_)
app.use('/api/users', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("GETTING USER");
        console.log(req.body);
        req.num = 3;
        req.user = { name: req.body.name, hashedPass: req.body.password };
        next();
        return [2 /*return*/];
    });
}); });
app.post('/api/users/signUp', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_1, password, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_1 = req.user;
                password = user_1.hashedPass;
                return [4 /*yield*/, bcrypt.hash(password, 10, function (err, hash) {
                        return __awaiter(this, void 0, void 0, function () {
                            var seqUser, token;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (err) {
                                            throw err;
                                        }
                                        seqUser = { name: user_1.name, hashedPass: hash };
                                        return [4 /*yield*/, save(seqUser)];
                                    case 1:
                                        _a.sent();
                                        token = jwt.sign(user_1, process.env.SECRET_KEY);
                                        //const token = 4
                                        return [2 /*return*/, res.status(201).json({ success: true, access_token: token })];
                                }
                            });
                        });
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.log(error_1);
                res.status(500).send();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.post('/api/users/login', function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var user, hashed_pass;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                user = req.user;
                console.log(user);
                return [4 /*yield*/, getUserByName(user.name)
                    //console.log(hashed_pass);
                ];
            case 1:
                hashed_pass = _a.sent();
                //console.log(hashed_pass);
                if (hashed_pass) {
                    bcrypt.compare(user.hashedPass, hashed_pass, function (err, res_) {
                        console.log("COMPARING : ", user.hashedPass, hashed_pass);
                        //console.log(res_);
                        if (err) {
                            // console.log("err:" ,err);
                            // console.log("rr");
                            return res.status(500).json({ success: false, message: 'something went wrong when comparing passwords' });
                        }
                        if (res_) {
                            // Send JWT 
                            var token = jwt.sign(user, process.env.SECRET_KEY);
                            return res.status(201).json({ success: true, access_token: token });
                        }
                        else {
                            // response is OutgoingMessage object that server response http request
                            return res.status(401).json({ success: false, message: 'passwords do not match' });
                        }
                    });
                }
                else {
                    return [2 /*return*/, res.status(401).json({ success: false, message: 'User does not exist' })];
                }
                return [2 /*return*/];
        }
    });
}); });
//CreateTable()
var pool = new Pool({
    connectionString: process.env.DATABASE_URL_POOL,
    ssl: {
        require: true,
    },
});
function getPostgresVersion() {
    return __awaiter(this, void 0, void 0, function () {
        var client, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pool.connect()];
                case 1:
                    client = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 5]);
                    return [4 /*yield*/, client.query('SELECT version()')];
                case 3:
                    response = _a.sent();
                    console.log(response.rows[0]);
                    return [3 /*break*/, 5];
                case 4:
                    client.release();
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
getPostgresVersion();
var wsServer = new ws.Server({ noServer: true, clientTracking: true });
var msgs = ["m1", "m2"];
var sockets = [];
var mapIdSocks = {};
wsServer.on('connection', function (socket, req) { return __awaiter(void 0, void 0, void 0, function () {
    var params;
    return __generator(this, function (_a) {
        params = new URLSearchParams(req.url);
        //console.log(socket);
        //console.log(socket);
        mapIdSocks[params.get('/?clientID')] = socket;
        socket.clientId = params.get('/?clientID');
        sockets.push(socket);
        //    await getPostgresVersion()
        msgs.forEach(function (msg) { return socket.send("".concat(msg)); });
        //console.log(server.clients)
        socket.on('message', function (message) {
            //console.log(message);
            //console.log(server.clients);
            msgs.push(message);
            socket.send("".concat(message));
            sockets.forEach(function (socket_v) {
                if (socket_v != socket) {
                    console.log(socket.clientId);
                    socket_v.send("".concat(message));
                }
            });
            // server.clients.forEach((socket)=>{
            //     socket.send(`${message}`)
            // })
            console.log(msgs);
            //key.send(`${message}`)
            // console.log('MSG: ',b.toString());
            // socket.send(`${message}`)
        });
        return [2 /*return*/];
    });
}); });
// socket.addEventListener("message", ({ data }) => {
//     const li = document.createElement('li')
//     li.textContent = data
//     document.querySelector('ul').appendChild(li)
// })
wsServer.on('close', function (socket) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log(socket.clientId);
        return [2 /*return*/];
    });
}); });
var server = app.listen(3000);
console.log(server.address());
server.on('upgrade', function (request, socket, head) {
    console.log("REQ: ", request.url);
    wsServer.handleUpgrade(request, socket, head, function (socket) {
        console.log("Upgrading to websocket");
        //console.log(socket);
        var params = new URLSearchParams(request.url);
        var authed = authWebSocket(request);
        console.log("authed: ", authed);
        if (!authed) {
            // \r\n\r\n: These are control characters used in HTTP to
            // denote the end of the HTTP headers section.
            console.log("JWT FAILED", authed);
            socket.close();
            return;
        }
        wsServer.emit('connection', socket, request);
    });
});
function main() {
    return 0;
}
exports.main = main;
