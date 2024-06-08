const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password)
  });
  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Function to add or modify a book review
const addOrModifyReview = (bookId, username, review,res) => {
  // Check if the book exists
  if (!books.hasOwnProperty(bookId)) {
    return res.status(300).json({ message: 'Book not found' });
  }

  // Get the book object
  const book = books[bookId];

  let message;
  // Check if the user has already posted a review for this book
  if (book.reviews.hasOwnProperty(username)) {
    // Modify the existing review

    message = 'Review modified';
  } else {
    // Add a new review
    message = 'Review added';
  }
  book.reviews[username] = review;
  return res.status(200).json({ message: message });
}
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const review = req.query.review;
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (username) {
    if (isbn && review) {
      addOrModifyReview(isbn,username,review,res)
    }else{
      return res.status(300).json({ message: "please enter valid review and isbn" });
    }
  } else {
    return res.status(300).json({ message: "no authorization" });
  }

  // return res.status(300).json({ message: "Yet to be implemented" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {

const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  if (username) {
    if (isbn) {
      if (!books.hasOwnProperty(isbn)) {
        return res.status(300).json({ message: 'Book not found' });
      }
      const book = books[isbn];

      if (book.reviews.hasOwnProperty(username)) {
        delete book.reviews[username];
        
        // let new_reviews=book.reviews.filter((review)=>review.key!==username)
        // book.reviews=new_reviews;
        return res.status(200).json({ message: "The reviews has success deleted" });
      }else{
        return res.status(300).json({ message: "You do not have any review" });
      }
    }else{
      return res.status(300).json({ message: "please enter valid isbn" });
    }
  } else {
    return res.status(300).json({ message: "no authorization" });
  }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
