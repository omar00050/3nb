require("dotenv").config();

const express = require("express");
const app = express();

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});

app.use("/ping", (req, res) => {
  res.send(new Date());
});

app.listen(9080, () => {
  console.log("Express is ready.".blue.bold);
});

const fs = require("fs")
const {
  Client,
  Collection,
  Intents,
} = require("discord.js");

const config = require("./config.json");
require("colors");
const baseClient = require("./client/baseClient");

const client = new baseClient()



client.setMaxListeners(250);
require("events").defaultMaxListeners = 250;

const { createLogger, transports, format } = require("winston");
const path = require("path");

const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({
      filename: path.join(__dirname, "Logs", "Errors.json"),
    }),
  ],
});


fs.readdirSync(`./handlers`).forEach((handler) => {
  require(`./handlers/${handler}`)(client);
});


client.login(config.token || process.env.token).then(() => {
  client.user.setStatus("idle");
  client.user.setActivity("use /help", { type: "PLAYING" })
}).catch((err) => {
  console.log(err.message);
});


client.on("error", (error) => {
  console.error("Discord.js error:", error);
  logger.error("Discord.js error:", error);
});

client.on("warn", (warning) => {
  console.warn("Discord.js warning:", warning);
});

let antiCrashLogged = false;

process.on("unhandledRejection", (reason, p) => {
  if (!antiCrashLogged) {
    console.error("[antiCrash] :: Unhandled Rejection/Catch");
    if (reason.message == 'Unknown Message') return
    if (reason.message == 'Unknown interaction') return
    if (p.message == 'Unknown Message') return
    if (p.message == 'Unknown interaction') return
    console.error(reason, p);
    logger.error("[antiCrash] :: Unhandled Rejection/Catch", p);
    antiCrashLogged = true;
  }
});

process.on("uncaughtException", (err, origin) => {
  if (!antiCrashLogged) {
    console.error("[antiCrash] :: Uncaught Exception/Catch");
    console.error(err, origin);
    logger.error("[antiCrash] :: Uncaught Exception/Catch", origin);
    antiCrashLogged = true;
  }
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  if (!antiCrashLogged) {
    console.error("[antiCrash] :: Uncaught Exception/Catch (MONITOR)");
    console.error(err, origin);
    logger.error("[antiCrash] :: Uncaught Exception/Catch (MONITOR)", origin);
    antiCrashLogged = true;
  }
});