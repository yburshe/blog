var express = require("express");
var app = express();
const fs = require("fs");
var path = require("path");
var marked = require("marked");
const { dir } = require("console");

app.set("view engine", "ejs");
app.set("port", 5500);

app.use(express.static(__dirname + "/public/"));

//Get the metadata from the post including Title and Date
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
    }
  });

  //Sort the posts by their date (ascending)
  obj = obj.sort((objA, objB) => Number(objB.date) - Number(objA.date));
  
  //Format the dates to dd/mm/yy to show on /posts
  obj.forEach(item => {
    const originalDate = new Date(item.date);
    const formattedDate = originalDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    });

    item.date = formattedDate;
  });

  return obj;
}

//Convert md files in /posts to HTML for display
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

    const post = {
      title: title,
      date: date,
      html: html,
    };
    return { status: 1, post: post };
  } else {
    return error;
  }
}

//show list of blog posts
app.get("/blog", async function (req, res) {
  const directoryPath = path.join(__dirname, "posts");
  var files = fs.readdirSync(directoryPath);
  files = files.map((file) => path.parse(file).name);
  const metadata = getPostMetadata();
  res.render("pages/blog", { data: metadata });
});

//slug matching is done by the the name of the markdown file
app.get("/blog/:name", function (req, res) {
  var name = req.params.name;
  var post = convertToHTML(name);
  if (post.status == 0) {
    res.render("pages/error", { errormessage: post.errormessage });
  } else {
    res.render("pages/post", {
      title: post.post.title,
      date: post.post.date,
      html: post.post.html,
    });
  }
});

//Projects endpoint
app.get("/projects", function (req, res) {
  res.render("pages/projects");
});

//Index endpoint
app.get("/", function (req, res) {
  res.render("pages/index");
});

app.listen(5500, () => {
  console.log("Started on port", 5500);
});
