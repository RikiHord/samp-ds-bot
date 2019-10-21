const Discord = require('discord.js');
//const sqlite3 = require('sqlite3').verbose();
const writeDB = require('./writeDB');

/*let db = new sqlite3.Database('./sqlite/sads.db', (err)=>{
   if(err){
     console.log(error.message);
   }
});*/
const {Client} = require('pg');
const db = new Client({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: 5432,
  database: process.env.DATABASE
});

function findDB(id, name, message, named){
   console.log("aaa")
   let id_user = {id_user: id}
   let sql = { 
      name: 'fetch-user',
      text: `SELECT * FROM users WHERE id_user = $1`,
      values: [id_user]
   }
   try{
   db.query(sql, (err, result) => {
      console.log("ne rabotaet ")
      if (err) {
         console.error(err.message);
      }
console.log("l");
      if(result == undefined){
         let sql = `SELECT name_user FROM users WHERE name_user = ${name}`;
            db.query(sql, (err, result2) => {
               if (err) {
                  console.error(err.message);
               } 
console.log("h");
               if(result2 == undefined){
                  if (!message.guild.me.hasPermission('MANAGE_NICKNAMES')) return message.channel.send('I don\'t have permission to change your nickname!');
                  message.member.setNickname(named);
                  let id = message.author.id;
                  let member = message.mentions.members.first() || message.guild.members.get(id);
                  member.removeRole('595555181152829440');
                  writeDB(id, name, message);
               }
               else{
                  return message.author.send(`Ник занят, попробуйте ввести другой!`);
               }
            });
      }
      else{
         message.author.send(`Вы уже зарегестрированы под именем ${result.name_user}`);
      }
      });
   }
   catch(err){
      console.log(err);
   }
}
module.exports = findDB;