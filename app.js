const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/myDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Connection to MongoDB failed:', err.message);
    process.exit(1); // Exit the process on connection failure
  });

const blogSchema = new mongoose.Schema({
  title: String,
  body: String,
  image: String
});
const Blog = mongoose.model('Blog', blogSchema);

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.render('index', { blogs });
  } catch (err) {
    res.render('error');
  }
});

router.post('/blog', async (req, res) => {
  const { title, body, image } = req.body;
  const newBlog = { title, body, image };
  try {
    await Blog.create(newBlog);
    res.redirect('/');
  } catch (err) {
    res.render('error');
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);
    res.render('show', { blog: foundBlog });
  } catch (err) {
    res.render('error');
  }
});

router.get('/blog/:id/edit', async (req, res) => {
  try {
    const foundBlog = await Blog.findById(req.params.id);
    res.render('edit', { blog: foundBlog });
  } catch (err) {
    res.render('error');
  }
});

router.put('/blog/:id', async (req, res) => {
  const { title, body, image } = req.body;
  const updatedBlog = { title, body, image };
  try {
    await Blog.findByIdAndUpdate(req.params.id, updatedBlog);
    res.redirect('/');
  } catch (err) {
    res.render('error');
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.redirect('/');
  } catch (err) {
    res.render('error');
  }
});

app.use('/', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
