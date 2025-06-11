const db = require('../config/db');

const User = {
    create :(user,callback)=>{
        
    },

    findByEmail:(email,callback)=>{
        db.query('SELECT * FOM users WHERE email = ? ' 
            ,[ email],callback);
    },

    findById :(id,callback) =>{
        db.query('SELECT * FROM users WHERE id = ?'
            ,[id] ,callback);
    }
};

module.exports  = User;