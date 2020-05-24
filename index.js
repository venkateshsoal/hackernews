const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
var cors = require('cors')
const app = express()
const port = 3000

//cross origin resoure sharing(cors) is middleware
app.use(cors())

// connect to database
const DATABSE_HOST = 'mongodb://localhost:27017'
const DATABASE_NAME = "myfirstdb"
mongoose.connect(`${DATABSE_HOST}/${DATABASE_NAME}`, { useNewUrlParser: true, useUnifiedTopology: true });

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// home route
app.get('/', (req, res) => {
    res.send('Hello world')
})

//db model for post and user and schema 
const Post = mongoose.model('Post', { title: String, url: String, username: String, datemodified: Date });

const User = mongoose.model('User', { username: String, password: String });
const upvote = mongoose.model('Upvote', {username: String, count: Number });
// /login --POST -- payload will be username and password

// users
// /user  -- POST -- payload will be username and password(create user)
app.post('/user', urlencodedParser, (req, res) => {
    const user = new User({ username: req.body.username, password: req.body.password });
    user.save().then(() => {
        console.log('new  user added')
        res.status(200).send('new user added successfully')
    });
})



// posts
// /article -- POST -- payload will be title and url --- (create post)
app.post('/post', urlencodedParser, (req, res) => {

    // console.log(req.body.title);
    // console.log(req.body.url);
    // console.log(req.body.username);

    const post = new Post({
        title: req.body.title,
        url: req.body.url,
        username: req.body.username,
        datemodified: new Date()
    })
    post.save().then(() => {
        console.log('new post added');
        res.status(200).send('new post added')
    })
})
// /articles --- GET --- response should be array of articles[]
/**
 * [
 *      {
 *          name: string,
 *          url: string,
 *          username: string,
 *          timestamp: Date,
 *          upvotes: number,
 *          comments: [{
 *              text: string,
 *              username: string,
 *              timestamp: date
 *          }]
 *      }
 * ]
 */
app.get('/posts', (req, res) => {
    // Post.find({}, (err, postsFromDB) => {
    //     console.log(postsFromDB);
    //     res.status(200).send(postsFromDB)
    // });
    Post.find({}).then((postsFromDB)=>{
        console.log(postsFromDB);
        res.status(200).send(postsFromDB)
    })
})

app.post('/upvote',(req,res)=>{
    const Upvote = new Upvote({username: req.body.username, count: req.body.count});
    post.find({}).then(upvoteFromDB);
    res.status(200).send(upvoteFromDB);
});


// /comment --- POST --- payload will be comment text, user id, timestamp

// /upvote --POST  -- payload will be username

app.listen(port, () => console.log(`Example app listening on port ${port}!`))