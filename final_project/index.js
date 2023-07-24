const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    //Write the authenication mechanism here
    let token = req.header('Authorization');
    if (!token)
        res.status(401).send("No token");
    else {
        token = token.slice(7);
        if (!token)
            res.status(401).send("Missing or malformed token");
        else {
            try {
                let verificationResult =  jwt.verify(token, "testIt");
                if (verificationResult.user) {
                    req.user = verificationResult.user;
                    next();
                } else
                    res.status(401).send("Invalid JWT");
            } catch (err) {
                res.status(401).send("Error parsing JWT");
                console.log("Error : " + err);
            }
        }
    }
});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
