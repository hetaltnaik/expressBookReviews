const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    if (users.find((user) => user.userName == username))
        return true;
    else
        return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    if (users.find((user) => 
        ((user.userName == username) && (user.password == password))))
        return true;
    else
        return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let userName = req.body.username;
  let password = req.body.password;
  if (!userName)
    return res.status(401).json("Missing userName")
  else if (!password)
    return res.status(401).json("Missing password")
  else {
    if (!authenticatedUser(userName, password))
        return res.status(401).json("Invalid credentials")
    else {
        let token = jwt.sign({user : userName}, "testIt");
        return res.status(300).json({token: token});        
    }
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn; 
  if ((!isbn) || (isbn < 1) || (isbn > 10))
    return res.status(400).json({message: "Invalid ISBN"});
  else {
    books[isbn].reviews[req.user] = req.query.review;
    return res.status(200).json({message: "Review added"});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn; 
    if ((!isbn) || (isbn < 1) || (isbn > 10))
      return res.status(400).json({message: "Invalid ISBN"});
    else {
      if (books[isbn].reviews[req.user])
        delete books[isbn].reviews[req.user];
      return res.status(200).json({message: "Review deleted"});
    }    
}); 

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
