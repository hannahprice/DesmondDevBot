const Discord = require("discord.js")
const fetch = require("node-fetch")
const Database = require("@replit/database")
const keepAlive = require("./server")

const client = new Discord.Client()
const db = new Database()
const mySecret = process.env['TOKEN']

statusCodes = [
  100, 101, 102, 
  200, 201, 202, 203, 204, 206, 207,
  300, 301, 302, 303, 304, 305, 307, 308,
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 429, 431, 444, 450, 451, 497, 498, 499, 500, 501, 502, 503, 504, 506, 507, 508, 509, 510, 511, 521, 523, 525, 599
]

function getDadJoke() {
  return fetch("https://icanhazdadjoke.com/", { method: 'GET', headers: {'Accept':'application/json'}})
    .then(res => {
      return res.json()
    })
    .then(data => {
      return data.joke
    })
}

db.get("toggle").then(value => {
  if (value == null) {
    db.set("toggle", true)
  }  
}) 

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.on("message", msg => {
  if (msg.author.bot) return

  if (msg.content.startsWith("$desmond")) {
    value = msg.content.split("$desmond ")[1]

    if (value.toLowerCase().startsWith("shh")) {
      db.set("toggle", false)
      msg.channel.send("Desmond will be quiet now.")
    } else {
      db.set("toggle", true)
      msg.channel.send("Desmond in the house!")
    }
  }

  db.get("toggle").then(toggle => {
    if (!toggle) return

    if (msg.content.includes("$dadjoke")) {
      getDadJoke().then(joke => {
        msg.channel.send(joke)
      })
    }
    
    statusCodes.some(code => {
      if (msg.content.includes(code)){
        let url = "https://http.cat/"+ code +".jpg"
        msg.channel.send("", {files: [url]})
      }
    })
  })
})

keepAlive()
client.login(mySecret)
