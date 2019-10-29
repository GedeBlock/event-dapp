"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const auth_1 = require("./auth");
const users_1 = require("./users");
const event_1 = require("./event");
exports.services = express.Router();
exports.services.use('/auth', auth_1.authRouter);
exports.services.use('/users', users_1.userRouter);
exports.services.use('/events', event_1.eventRouter);
