const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const booksPromise =  new Promise((resolve,reject) => {
setTimeout(() => {
  resolve(books)
},6000)})

function fetchBooksWithCallback(callback){
  setTimeout(() => {
    callback(books)
  },6000)
}


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  fetchBooksWithCallback(function(books){
    res.status(200).json({books})
  })
  return
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const {isbn} = req.params
  
  booksPromise.then(books => {
    let book = {}
    for(let index in books){
      if(index !== isbn)
        continue
  
      book = books[index]
      break
    }

    res.status(200).json({book: book});
  })
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const {author} = req.params
  
  booksPromise.then(books => {
    const book = Object.values(books).filter(book => book.author === author)
    res.status(200).json({book});  
  })
  
  return
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const {title} = req.params
  
  booksPromise.then(books => {
    const book = Object.values(books).filter(book => book.title === title)
    res.status(200).json({book});
  })

  return  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const {isbn} = req.params
  let reviews = books[isbn]['reviews']
  return res.status(200).json(reviews);
});

module.exports.general = public_users;
