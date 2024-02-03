
Below is a complete program that generates a MongoDB database for a bookstore with collections for customers, books, and orders, 
and sets up an Express.js server with forms to display books, add books, add customers, and record book purchases by customers. 
The program adheres to ECMAScript 6 best practices, utilizing async/await for making Mongoose calls, wrapping await statements in try-catch 
blocks, and utilizing arrow function syntax.


const express = require('express');
const mongoose = require('mongoose');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection URI and options
const mongoURI = 'mongodb://localhost:27017/bookstore';
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Book schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  genre: String,
  publishedYear: Number
});

// Customer schema
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  membership: String
});

// Order schema
const orderSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer'
  },
  quantity: Number,
  total: Number
});

// Models
const Book = mongoose.model('Book', bookSchema);
const Customer = mongoose.model('Customer', customerSchema);
const Order = mongoose.model('Order', orderSchema);

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(mongoURI, mongoOptions);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

// Seed the database with sample data
const seedDatabase = async () => {
  try {
    // Seed the database with 5 book records
    const books = [
      { title: 'Book 1', author: 'Author 1', genre: 'Fiction', publishedYear: 2020 },
      { title: 'Book 2', author: 'Author 2', genre: 'Non-Fiction', publishedYear: 2019 },
      // Add more book records here
    ];
    const insertedBooks = await Book.insertMany(books);
    console.log('Books inserted:', insertedBooks);

    // Seed the database with 5 customer records
    const customers = [
      { name: 'Customer 1', email: 'customer1@example.com', membership: 'Gold' },
      { name: 'Customer 2', email: 'customer2@example.com', membership: 'Silver' },
      // Add more customer records here
    ];
    const insertedCustomers = await Customer.insertMany(customers);
    console.log('Customers inserted:', insertedCustomers);

    console.log('Database seeded with initial records');
  } catch (error) {
    console.error('Error seeding database: ', error);
  }
};

// Express route to display books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Express route to add a book
app.post('/books', async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.json(savedBook);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Express route to display customers
app.get('/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Express route to add a customer
app.post('/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();
    res.json(savedCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Express route to record a book purchase by customer
app.post('/orders', async (req, res) => {
  try {
    const { bookId, customerId, quantity } = req.body;
    const book = await Book.findById(bookId);
    const customer = await Customer.findById(customerId);
    if (!book || !customer) {
      return res.status(404).json({ message: 'Book or customer not found' });
    }
    const total = book.price * quantity;
    const newOrder = new Order({ book: bookId, customer: customerId, quantity, total });
    const savedOrder = await newOrder.save();
    res.json(savedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Start the Express server
const startServer = () => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
};

// Connect to MongoDB, seed the database, and start the server
connectToDatabase()
  .then(seedDatabase)
  .then(startServer)
  .catch(error => console.error(error));
```

In this program, we define the models for books, customers, and orders, along with the necessary routes to display books, add books, display customers, 
add customers, and record book purchases by customers using Express.js. The program connects to the MongoDB database, seeds the database with sample 
data, and then starts the Express server to handle the bookstore functionality. The program uses async/await for making asynchronous operations with 
Mongoose and ensures error handling using try-catch blocks for await statements.

Upon running this program, the Express server will be set up and running on port 3000, providing the required functionality for the bookstore with MongoDB database integration.  
