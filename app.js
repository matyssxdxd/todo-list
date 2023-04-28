require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let admin = process.env.ADMIN_NAME;
let password = process.env.ADMIN_PASSWORD;

try {
     mongoose.connect("mongodb+srv://" + admin + ":" + password + "@cluster0.amxz712.mongodb.net/todoDB");
} catch (err) {
    console.error(err);
};

const itemSchema = new mongoose.Schema({
    name: String
});

const Item = new mongoose.model("Item", itemSchema);

app.get("/", (req, res) => {
    try {
        Item.find().then(item => {
            res.render("list", {listTitle: "Today", listItem: item});
        })
    } catch(err) {
        console.error(err);
    }
});

app.get("*", (req, res) => {
    res.redirect("/");
});

app.post("/", (req, res) => {
    const itemContent = req.body.newItem;
    if (itemContent != "") {
        const newItem = new Item({
            name: itemContent
        });
        newItem.save();
    }
    res.redirect("/");
});

app.post("/delete", (req, res) => {
    const itemId = req.body.checkbox;
    Item.findByIdAndDelete(itemId)
    .catch(err => {
        console.error(err);
    });
    res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
};

app.listen(port, () => {
    console.log("Server has started!");
});