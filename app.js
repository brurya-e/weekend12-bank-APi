const express = require("express");

const {loadUsers, addUser, deleteUser, depositCash, transferCash, getUser, withdrawCash} = require('./utils')
const app = express();
app.use(express.json());

app.get('/users',(req, res) => {
    try{
        res.status(200).send(loadUsers(req.body))
    }
    catch(e){
        res.status(400).send({error: e.message})
    }
    
});

app.post('/users', (req, res) =>{
  try{
      res.status(201).send(addUser(req.body))
  }
  catch(e) {
      res.status(400).send({error:e.message})
  }
});

app.get('/users/:id', (req, res) => {
    try{
      console.log(req.params)
        res.status(200).send(getUser(req.params.id))
    }
    catch(e){
        res.status(400).send({error: e.message})
    }
})



app.delete('/users/:id', (req, res) =>{
    const userId = req.params.id;
    try {
        res.status(200).send(deleteUser(userId))
    }
    catch(e){
        res.status(404).send({error:e.message})
    }

})

app.patch('/users/:id/deposit', (req, res) => {
    const {id} = req.params;
    const {cashAmount} = req.body;
    try{
        res.status(200).send(depositCash(id, cashAmount))
    }
    catch(e) {
        res.status(404).send({error:e.message})
    }
})

app.patch('/users/:id/withdraw', (req, res) => {
    const {id} = req.params;
    const {cashAmount} = req.body;
    try{
        res.status(200).send(withdrawCash(id, cashAmount))
    }
    catch(e) {
        res.status(404).send({error:e.message})
    }
})

app.patch('/users/:id/transfer',(req, res) =>{
    const {id} = req.params;
    const {cashAmount, targetId} = req.body;
    try{
        res.status(200).send(transferCash(id, cashAmount, targetId))
    }
    catch(e){
        res.status(404).send({error:e.message})
    }
})



const PORT = 3000;

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
})