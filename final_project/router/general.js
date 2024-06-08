const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

//Function to check if the user exists
const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!doesExist(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Write your code here
  // res.send(JSON.stringify({ books }, null, 4));
  let myPromise = new Promise((resolve, reject) => {
    res.send(JSON.stringify({ books }, null, 4));
    resolve("Promise resolved")
  })
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    const isbn = req.params.isbn;
    if (isbn && books.hasOwnProperty(isbn)) {
      let filtered_book = books[isbn]
      res.send(filtered_book);
      resolve("Promise resolved")
    } else {
      return res.status(300).json({ message: "not found" });
    }
  })
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    const author = req.params.author;
    // let filtered_books=books.filter((book)=> book.author===author);
    const books_values = Object.values(books);
    let filtered_books = books_values.filter((book) => book.author === author);
    res.send(filtered_books);
    resolve("Promise resolved")
  })
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  let myPromise = new Promise((resolve, reject) => {
    const title = req.params.title;
  // let filtered_books=books.filter((book)=> book.author===author);
  const books_values = Object.values(books);
  let filtered_books = books_values.filter((book) => book.title === title);
  res.send(filtered_books);
  resolve("Promise resolved")
  })
  myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
  })
  
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  if (isbn && books.hasOwnProperty(isbn)) {
    let filtered_book = books[isbn].reviews
    res.send(filtered_book);
  } else {
    return res.status(300).json({ message: "not found" });
  }



});

module.exports.general = public_users;
