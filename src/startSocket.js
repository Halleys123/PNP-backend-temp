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
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
exports.startSocket = startSocket;
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const app_1 = require("./app");
const utils_1 = require("@himanshu_guptaorg/utils");
global.connectedUsers = new Map();
const server = (0, http_1.createServer)(app_1.app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['my-custom-header'],
        credentials: true,
    },
});
exports.io = io;
function startSocket() {
    server.listen(process.env.SOCKET_PORT);
    io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!socket.handshake.query.token)
                throw 'notAllowed';
            let decodedJwt = (yield (0, utils_1.jwtVerification)(socket.handshake.query.token.split(' ')[1], process.env.REFRESH_TOKEN_SECRET));
            let userId = decodedJwt._id;
            console.log('AddedAUser');
            global.connectedUsers.set(userId, socket.id);
            io.to(global.connectedUsers.get(userId)).emit('userId', userId);
            console.log(global.connectedUsers);
            socket.on('disconnect', (token) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (!token)
                        throw 'notAllowed';
                    decodedJwt = (yield (0, utils_1.jwtVerification)(socket.handshake.query.token.split(' ')[1], process.env.REFRESH_TOKEN_SECRET));
                    userId = decodedJwt._id;
                    global.connectedUsers.delete(userId);
                    console.log('deletedAUser');
                    console.log(global.connectedUsers);
                }
                catch (err) {
                    console.log(err);
                }
            }));
        }
        catch (err) {
            console.log('err!!!!!!!!!!!!!!');
        }
    }));
}
