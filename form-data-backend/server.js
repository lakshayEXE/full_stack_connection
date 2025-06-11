const express = require('express');
const cors = require('cors');
const Routes = require('../form-data-backend/routes/auth.routes');


const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.send("hi i m backend ")
})

app.use('/use', Routes);

app.listen(3333,()=> console.log("server is on at port 3333"));
