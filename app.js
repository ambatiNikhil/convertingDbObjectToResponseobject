const express = require("express");
const { open } = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");

let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running on http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db error:${e.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

const convertDBObjectIntoResponseObject = (DBObject) => {
  return {
    playerId: DBObject.player_id,
    playerName: DBObject.player_name,
    jerseyNumber: DBObject.jerseyNumber,
    role: DBObject.role,
  };
};

app.get("/players/", async (request, response) => {
  const getPlayerDetailsQuery = `
   SELECT
   *
   FROM
   cricket_team;`;
  const getPlayerDetailsArray = await db.all(getPlayerDetailsQuery);
  response.send(
    getPlayerDetailsArray.map((eachPlayer) =>
      convertDBObjectIntoResponseObject(eachPlayer)
    )
  );
});
