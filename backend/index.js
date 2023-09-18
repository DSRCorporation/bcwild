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

// BridgeFor is an orphan module ATM, so I import it here to make sure the DB
// table is properly initialized.
const bridgeFor = require("./src/model/BridgeFor");

startServer();
