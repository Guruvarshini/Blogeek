import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
const app=express();
const port=3000;
app.use(express.static("public"));
const books = [];
const posts = [];
var i=0;
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/add-book', (req, res) => {
    res.render('addbook.ejs');
});
app.get('/about', (req, res) => {
    res.render('about.ejs');
});
app.get('/books', (req, res) => {
    res.render("book.ejs", { books });
});
app.get('/add-post', (req, res) => {
    res.render('createpost.ejs');
});
app.get('/post',(req,res)=>{
    res.render('viewpost.ejs',{posts});
});
app.get('/update-post/:id', (req, res) => {
    var postId = req.params.id;
    var index = posts.findIndex(post => post.id == postId);
    if (index !== -1) {
        var tit = posts[index].title;
        var cat = posts[index].category;
        var cont = posts[index].content;

        // Corrected variable names in the post object
        var post = { postId, tit, cat, cont };

        res.render('updatepost.ejs', { post });
    } else {
        // Handle the case where the post with the given ID is not found
        res.status(404).send('Post not found');
    }
});

app.post('/add-book', (req, res) => {
    const { title, coverUrl, abstract } = req.body;

    const newBook = { title, coverUrl, abstract };
    books.push(newBook);

    res.redirect('/books');
});
app.post('/add-post', (req, res) => {
    const { title, category, content } = req.body;
    const author = "GuruVarshiniB";
    const date = new Date();

    const id = i;
    i++;

    const newPost = { id, title, category, content, author, date };

    posts.push(newPost);

    res.redirect('/post');
});

app.post('/update-post/:id',(req,res)=>{
    const{title,category,content}=req.body;
    const postId=req.params.id;
    
    var index = posts.findIndex(post => post.id == postId);
    if(index!==-1){
        posts[index].title=title;
        posts[index].category=category;
        posts[index].content=content;
        res.render('viewpost.ejs',{posts});
    }
    else{
        res.send("Invalid");
    }
    
});
app.get('/delete-post/:id', (req, res) => {
    const postId = req.params.id;
    const index = posts.findIndex(post => post.id == postId);

    if (index !== -1) {
        posts.splice(index, 1);
        res.render("viewpost.ejs",{posts});
    } else {
        res.status(404).send('Post not found');
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});