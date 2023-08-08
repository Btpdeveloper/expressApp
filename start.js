const express = require('express');
const passport = require('passport');
const xsenv = require('@sap/xsenv');
const bodyParser = require('body-parser');
const JWTStrategy = require('@sap/xssec').JWTStrategy;
const app = express();


const services = xsenv.getServices({ uaa: 'nodexsuaa' });

passport.use(new JWTStrategy(services.uaa));

app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/employees', function (req, res) {
    var isAuthorized = req.authInfo.checkScope('$XSAPPNAME.Display'); //To check the scope of the end User
    if (isAuthorized) {
        res.status(200).json(employees);
    }
    else {
        res.status(403).send('Forbidden');
    }
});

app.post('/employees', function (req, res) {   //Create Scenario
    var isAuthorized = req.authInfo.checkScope('$XSAPPNAME.Modify'); //To check the scope of the end User
    if (!isAuthorized) {
        res.status(403).send('Forbidden');
        return;
    }
    var newEmp = req.body;
    newEmp.id = employees.length;
    employees.push(newEmp);

    res.status(201).json(newEmp);
});

const port = process.env.PORT || 2000;

app.listen(port, function () {
    console.log("App is listening on Port" + port);
});