const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let userName = req.body.username;
  let password = req.body.password;
  if (!userName)
    return res.status(400).json("Missing userName")
  else if (!password)
    return res.status(400).json("Missing password")
  else {
      if (isValid(userName))
        return res.status(400).json("User exists");
      else {
          users.push({userName : userName, password: password});
          return res.status(201).json({message: "User registered"});
      }
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bookList = "";
  for ([key, value] of Object.entries(books)) {
    bookList += "," + JSON.stringify({
        title : value.title,
        author : value.author
    });
  }
  bookList = "[" + bookList.substr(1) + "]";
  return res.status(300).json(JSON.parse(bookList));
});

function getAll() {
    return new Promise((resolve, reject) => {
        let bookList = Object.entries(books).map((element) => {
            return {
                title : element[1].title,
                author : element[1].author
            }
        }); 
      resolve(bookList);  
    });
};

// Get the book list available in the shop (Asynch)
public_users.get('/asynch/all', async function (req, res) {
    res.status(300).json(await getAll());
    console.log("Book list returned");
});
  
// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn; 
  if ((!isbn) || (isbn < 1) || (isbn > 10))
    return res.status(400).json({message: "Invalid ISBN"});
  else
    return res.status(300).json(books[isbn]);    
 });
  
// Get book details based on ISBN (Asynch)
public_users.get('/asynch/isbn/:isbn',function (req, res) {
    const getAll = new Promise((resolve, reject) => {
        let isbn = req.params.isbn; 
        if ((!isbn) || (isbn < 1) || (isbn > 10))
          reject(res.status(400).json({message: "Invalid ISBN"}));
        else
          resolve(res.status(300).json(books[isbn]));    
    });

    getAll.then(() => console.log("Returned book."),
                () => console.log("Error while fetching book."));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author; 
  if (!author)
    return res.status(400).json({message: "Invalid Author"});
  else {
    let book = Object.entries(books)
        .find((element) => (element[1].author == author))
    if (!book)
        return res.status(400).json({message: "Not found"});
    else
        return res.status(300).json({isbn: book[0], ...book[1]});  
  }  
});

// Get book details based on author (Asynch)
public_users.get('/asynch/author/:author',function (req, res) {
    const getAll = new Promise((resolve, reject) => {
        let author = req.params.author; 
        if (!author)
          reject(res.status(400).json({message: "Invalid Author"}));
        else {
          let book = Object.entries(books)
              .find((element) => (element[1].author == author))
          if (!book)
              reject(res.status(400).json({message: "Not found"}));
          else
              resolve(res.status(300).json({isbn: book[0], ...book[1]}));  
        }
    });

    getAll.then(() => console.log("Returned book."),
                () => console.log("Error while fetching book."));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title; 
  if (!title)
    return res.status(400).json({message: "Invalid Title"});
    else {
        let book = Object.entries(books)
            .find((element) => (element[1].title == title))
        if (!book)
            return res.status(400).json({message: "Not found"});
        else
            return res.status(300).json({isbn: book[0], ...book[1]});  
    }    
});

// Get all books based on title(Asynch)
public_users.get('/asynch/title/:title',function (req, res) {
    const getAll = new Promise((resolve, reject) => {
        let title = req.params.title; 
        if (!title)
          reject(res.status(400).json({message: "Invalid Title"}));
        else {
          let book = Object.entries(books)
              .find((element) => (element[1].title == title))
          if (!book)
              reject(res.status(400).json({message: "Not found"}));
          else
              resolve(res.status(300).json({isbn: book[0], ...book[1]}));  
        }
    });

    getAll.then(() => console.log("Returned book."),
                () => console.log("Error while fetching book."));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn; 
  if ((!isbn) || (isbn < 1) || (isbn > 10))
    return res.status(400).json({message: "Invalid ISBN"});
  else
    return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
