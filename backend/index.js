/* eslint-disable */

/**
 * Module dependencies.
 */

const http = require("http");
const app = require("./express");

const { app_setting } = require("./src/config/config.js");


/**
 * Create HTTP server.
 */
const server = http.createServer(app);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(app_setting.port);
app.set("port", port);
/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      process.exit(1);
      break;
    case "EADDRINUSE":
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr.port}`;
}

async function startServer() {
  try {
    // await loader()
    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port, () => {
      console.log(`
                 ################################################

                     @  Server listening on port: ${port} @
                     
                 ################################################
             `);
    });
    server.setTimeout(180000);
    server.on("error", onError);
    server.on("listening", onListening);
  } catch (error) {
    console.log(error);
  }
}

const assessment = require("./src/model/Assessment");
const batGuanoAmount = require("./src/model/BatGuanoAmount");
const batGuanoCollected = require("./src/model/BatGuanoCollected");
const batGuanoDistribution = require("./src/model/BatGuanoDistribution");
const batRecording = require("./src/model/BatRecording");
const batSign = require("./src/model/BatSign");
const batSignLocation = require("./src/model/BatSignLocation");
const bbDataBatSignCustomLocation = require("./src/model/BBDataBatSignCustomLocation");
const bbDataBatSignStandardLocation = require("./src/model/BBDataBatSignStandardLocation");
const bridge = require("./src/model/Bridge");
const bridgeAbutment = require("./src/model/BridgeAbutment");
const bridgeBeams = require("./src/model/BridgeBeams");
const bridgeColumns = require("./src/model/BridgeColumns");
const bridgeConfiguration = require("./src/model/BridgeConfiguration");
const bridgeCrossingType = require("./src/model/BridgeCrossingType");
const bridgeFor = require("./src/model/BridgeFor");
const bridgeHabitat = require("./src/model/BridgeHabitat");
const bridgeObservation = require("./src/model/BridgeObservation");
const bridgeSpanMaterial = require("./src/model/BridgeSpanMaterial");
const bridgeType = require("./src/model/BridgeType");
const bridgeUnderdeck = require("./src/model/BridgeUnderdeck");
const bridgeWater = require("./src/model/BridgeWater");
const region = require("./src/model/Region");
const swallowNestType = require("./src/model/BBDefSwallowNestType");

const tables = [
  assessment,
  batRecording,
  batSign,
  batSignLocation,
  bridgeAbutment,
  bridgeBeams,
  bridgeColumns,
  bridgeCrossingType,
  bridgeFor,
  batGuanoAmount,
  batGuanoCollected,
  batGuanoDistribution,
  bridgeHabitat,
  bridgeObservation,
  bridgeSpanMaterial,
  bridgeType,
  bridgeUnderdeck,
  bridgeWater,
  region,
  swallowNestType,
];

const db = require("./src/config/database");

async function initDB() {
  await db.sequelize.sync();
  tables.forEach(async ({ init }) => init && await init());
}

initDB().then(() =>  console.log("Database initialized"));


startServer();
