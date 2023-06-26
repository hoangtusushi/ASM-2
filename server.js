const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mongodb = require('mongodb');

const connectionString = 'mongodb+srv://lethanh9579:12345@cluster0.oclcaqf.mongodb.net/';
const dbName = 'productDB';
const collectionName = 'products';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(bodyParser.json());

let db;
let productsCollection;

// Connect to MongoDB
mongodb.MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    db = client.db(dbName);
    productsCollection = db.collection(collectionName);

    app.post('/products', (req, res) => {
      const { name, price, image, description } = req.body;

      const newProduct = {
        name,
        price: parseInt(price),
        image,
        description
      };

      productsCollection.insertOne(newProduct)
        .then(() => {
          res.redirect('/products');
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error adding product');
        });
    });

    app.get('/', function(req, res) {
      productsCollection.find().toArray()
        .then(products => {
          res.render('index', { products });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error fetching products');
        });
    });

    app.get('/products/add', (req, res) => {
      res.render('add-product');
    });

    app.get('/products', (req, res) => {
      productsCollection.find().toArray()
        .then(products => {
          res.render('products', { products });
        })
        .catch(err => {
          console.error(err);
          res.status(500).send('Error fetching products');
        });
    });

    app.listen(3000, function () {
      console.log('Listening on 3000');
    });
  })
  .catch(err => {
    console.error('Error connecting to database:', err);
  });
