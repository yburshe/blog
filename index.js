var express = require("express");
var app = express();
const fs = require("fs");
var path = require("path");
var marked = require("marked");
const { dir } = require("console");

app.set("view engine", "ejs");
app.set("port", 5500);

app.use(express.static(__dirname + "/public/"));

function getPostMetadata() {
  const directoryPath = path.join(__dirname, "posts");
  var files = fs.readdirSync(directoryPath);
  var obj = [];
  files.forEach((file) => {
    const filePath = path.join(__dirname, "posts/" + file);
    var md = fs.readFileSync(filePath, { encoding: "utf-8", flag: "r" });

    const regex = /^---([\s\S]*?)---/m;
    const match = regex.exec(md);

    if (match) {
      const metadata = match[1].trim();

      const metadataLines = metadata.split("\n");
      const metadataObject = {};

      metadataLines.forEach((line) => {
        const [key, value] = line.split(":").map((entry) => entry.trim());
        metadataObject[key] = value;
      });

      const title = metadataObject.title;
      const date = metadataObject.date;

      file = file.slice(0, -3);
      obj.push({ path: file, title: title, date: new Date(date) });

      console.log(obj);
    }
  });
  obj = obj.sort((objA, objB) => Number(objB.date) - Number(objA.date));
  return obj;
}

function convertToHTML(name) {
  const directoryPath = path.join(__dirname, "posts/" + name + ".md");

  try {
    var md = fs.readFileSync(directoryPath, { encoding: "utf-8", flag: "r" });
  } catch {
    return {
      status: "0",
      errorcode: "404",
      errormessage: "The content you are looking for doesn't exist",
    };
  }

  const regex = /^---([\s\S]*?)---/m;
  const match = regex.exec(md);

  if (match) {
    const metadata = match[1].trim();

    const metadataLines = metadata.split("\n");
    const metadataObject = {};

    metadataLines.forEach((line) => {
      const [key, value] = line.split(":").map((entry) => entry.trim());
      metadataObject[key] = value;
    });

    const title = metadataObject.title;
    const date = metadataObject.date;

    const html = marked.parse(md.replace(match[0], "").replace());

    const blogpost = {
      title: title,
      date: date,
      html: html,
    };
    return { status: 1, blogpost: blogpost };
  } else {
    return error;
  }
}

app.get("/blog", async function (req, res) {
  const directoryPath = path.join(__dirname, "posts");
  var files = fs.readdirSync(directoryPath);
  files = files.map((file) => path.parse(file).name);
  const metadata = getPostMetadata();
  console.log(metadata);
  res.render("pages/blog", { data: metadata });
});

app.get("/blog/:name", function (req, res) {
  var name = req.params.name;
  var postcontent = convertToHTML(name);
  if (postcontent.status == 0) {
    res.render("pages/error", { errormessage: postcontent.errormessage });
  } else {
    res.render("pages/post", {
      title: postcontent.blogpost.title,
      date: postcontent.blogpost.date,
      html: postcontent.blogpost.html,
    });
  }
});

app.get("/projects", function (req, res) {
  res.render("pages/projects");
});

app.get("/", function (req, res) {
  res.render("pages/index");
});

app.listen(5500, () => {
  console.log("Started on port", 5500);
});
