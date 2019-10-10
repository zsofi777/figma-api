var express = require("express");
var app = express();
var fetch = require("isomorphic-fetch");
require("dotenv").config();

const FigmaAPIKey = process.env.API_KEY;
const FigmaFileID = "pRICxyj3rZho9zgqaHf5EE";
/*
async function figmaFileFetch(fileId) {
  let result = await fetch("https://api.figma.com/v1/files/" + fileId, {
    method: "GET",
    headers: {
      "X-Figma-Token": FigmaAPIKey
    }
  });

  let figmaFileStruct = await result.json();

  return figmaFileStruct;
}
*/
async function figmaFileFetch(fileId) {
  let result = await fetch("https://api.figma.com/v1/files/" + fileId, {
    method: "GET",
    headers: {
      "X-Figma-Token": FigmaAPIKey
    }
  });

  let figmaFileStruct = await result.json();

  let figmaFrames = figmaFileStruct.document.children
    .filter(child => child.type === "CANVAS")[0]
    .children.filter(child => child.type === "FRAME")
    .map(frame => {
      return {
        name: frame.name,
        id: frame.id
      };
    });

  return figmaFrames;
}

app.use("/", async function(req, res, next) {
  let result = await figmaFileFetch(FigmaFileID).catch(error =>
    console.log(error)
  );
  res.send(JSON.stringify(result));
});

app.listen(3001, console.log("I'm a server and I am listening on port 3001"));

/*
-> [{"name":"First","id":"15:4"},
    {"name":"Second","id":"4:64"},
    {"name":"Third","id":"4:66"},
    {"name":"Fourth","id":"4:65"}]
*/