import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import Issue from './models/issue.js';

const app= express();
const router= express.Router();
const ObjectId = mongoose.Types.ObjectId;

app.use(cors());
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/issues',{ useNewUrlParser: true });
//mongoose.connect('mongodb://localhost:27017/issues');

const connection= mongoose.connection;
connection.once('open',() => {
    console.log('MongoDB Database Connection Successful ...');
}); 
//CRUD

//Reading Documents/Records
router.route('/issues').get((req,res)=>{
    Issue.find((err,issues) =>{
        if (err) console.log(err);
        else res.json(issues);
    });
});
//Reading Specific Document/Record
router.route('/issues/:id').get((req,res) => {
    
    Issue.findById(ObjectId(req.params.id),(err,issue) => {
        if (err) console.log(err);
        else res.json(issue);
    });

});
//Create Document/Record
// <form action="/issues/add" method="post">
router.route('/issues/add').post((req,res)=>{
    let issue = new Issue(req.body);
    //console.log(issue);
   
    issue.save().then(issue => {
        res.status(200).json({'issue':'added successfuly'})
    })
    .catch(err => {
        res.status(400).send('Failed to Add document')
    });
});
// Update Document
router.route('/issues/update/:id').post((req,res)=>{
    Issue.findById(ObjectId(req.params.id),(err,issue) =>{
        if (!issue) return next(new Error('Couldnot load document'))
        else { 
            issue.title= req.body.title;
            issue.responsible= req.body.responsible;
            issue.description= req.body.description;
            issue.severity= req.body.severity;
            issue.status= req.body.status;
            issue.save().then(issue => {
                res.status(200).json('Updated')
            })
            .catch(err => {
                res.status(400).send('Failed to Update document')
            });
        }
    });
});

//Delete Document
router.route('/issues/delete/:id').get((req,res)=>{
    Issue.findByIdAndRemove({_id:ObjectId(req.params.id)},(err,issue) =>{
        if (err) res.json(err);
        else res.json('Removed');
    });
});

//app.get('/',(req,res) => res.send('Hello World'));
app.use('/',router);
app.listen(4000, () => console.log('Express Server Running on port 4000'));

//getpostman.com for testing api's download app
//robomongo.com for mongo gui
// mongodb compass