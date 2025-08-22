import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];
const dayName=["Domingo","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado"];

async function getItems(){
  const result = await db.query("SELECT * FROM item ORDER BY id ASC");
  items = result.rows;
  return items;
}

app.get("/", async (req, res) => {
  try{
    await getItems();
    const day = new Date().getDay();
    res.render("index.ejs", {
      listTitle: dayName[day],
      listItems: items,
    });
  }catch(err){
    console.log(err); 
  }
});

app.post("/add", async (req, res) => {
  try{
    const item = req.body.newItem;
    //items.push({ title: item });
    const result = db.query("INSERT INTO item(title) VALUES($1);",[item]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.post("/edit", async (req, res) => {
  try{
    const id = req.body.updatedItemId;
    const titleItem = req.body.updatedItemTitle;
    const result = db.query("UPDATE item SET title = $1 WHERE id = $2;",[titleItem,id]);
    res.redirect("/");
  }catch(err){
    console.log(err); 
  }
});

app.post("/delete", async (req, res) => {
  try{
    const id = req.body.deleteItemId;
    db.query("DELETE FROM item WHERE id = $1;",[id]);
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
