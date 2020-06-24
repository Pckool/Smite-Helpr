const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const Discord = require("discord.js");
const client = new Discord.Client();
var prefix = "s!";
var xpath = require("xpath"),
  dom = require("xmldom").DOMParser;

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity(`${prefix}help`);
});

var currentTeam = []; // an array of objects that will have a god anme and a player object ex. {god: "Skadi", player: DiscordMember}
var tradeRequests = [];

client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).toLowerCase().split(" ");
  if (args[0] === "ping") {
    message.reply("pong");
  } else if (args[0] === "help") {
    message.reply(
      `\`\`\`${prefix}godlist - list of all gods
      ${prefix}god - get random Smite god
      ${prefix}team - get random Smite gods for everyone in your voice channel
      ${prefix}team balanced - get random Smite gods for everyone in your voice channel with physical/magical balance
      ${prefix}team spread - get random Smite gods for everyone in your voice channel with role spread
      ${prefix}role - get random role
      ${prefix}physicallist - list of all physical gods
      ${prefix}physical - get random physical god
      ${prefix}magicallist - list of all magical gods
      ${prefix}magical - get random magical god
      ${prefix}hunterlist - list of all hunters
      ${prefix}hunter - get random hunter
      ${prefix}guardianlist - list of all guardians
      ${prefix}guardian - get random guardian
      ${prefix}magelist - list of all mages
      ${prefix}mage - get random mage
      ${prefix}warriorlist - list of all warriors
      ${prefix}warrior - get random warrior
      ${prefix}assassinlist - list of all assassins
      ${prefix}assassin - get random assassin\`\`\``
    );
  } else if (args[0] === "role") {
    message.reply(
      `**${getRandom(
        ["Hunter", "Guardian", "Mage", "Warrior", "Assassin"],
        args[1]
      )}**`
    );
  } else if (args[0] === "team") {
    // I know this isn't the best way to do this but I wanted to get it done quick
    if (message.member.voice.channel) {
      var members = message.member.voice.channel.members.array();
      shuffle(members);
     
      if (args[1] === "balanced") {
        var uneven = 0;
        if (members.length % 2 !== 0) {
          uneven = Math.round(Math.random());
        }
        var output = `Balanced Team (${
          Math.floor(members.length / 2) + uneven
        } Physical, ${Math.ceil(members.length / 2) - uneven} Magical)\n`;

        let body = getGods("Physical");
        const physical = getRandom(
          body,
          Math.floor(members.length / 2) + uneven
        );
        body = getGods("Magical");
        const magical = getRandom(
          body,
          Math.ceil(members.length / 2) - uneven
        );
        const gods = physical.concat(magical);
        currentTeam = [];
        for (var i = 0; i < members.length; i++) {
          output += `${members[i]} ${gods[i]}\n`;
          currentTeam.push({
            player: members[i],
            god: gods[i]
          })
        }
        message.channel.send(`**${output}**`);
      } else if (args[1] === "spread") {
        var uneven = [];
        if (members.length % 5 !== 0) {
          while (uneven.length < members.length % 5) {
            var r = Math.floor(Math.random() * 5);
            if (uneven.indexOf(r) === -1) {
              uneven.push(r);
            }
          }
        }
        var randomN = (ind) => {
          uneven.indexOf(ind) !== -1 ?
            Math.floor(members.length / 5) + 1 :
            Math.floor(members.length / 5)
        }
        var output = `Spread Team (${
          randomN(0)
        } Hunter, ${
          randomN(1)
        } Guardian, ${
          randomN(2)
        } Mage, ${
          randomN(3)
        } Warrior, ${
          randomN(4)
        } Assassin)\n`;

        let gods = [];
        let categories = ["Hunter", "Guardian", "Mage", "Warrior", "Assassin"];
        let k = 0;
        for(let category of categories){
          let body = getGods(category);
          let god = getRandom(body, randomN(k));

          gods = gods.concat(god);
          k++;
        }
        currentTeam = [];
        for (var i = 0; i < members.length; i++) {
          output += `${members[i]} ${gods[i]}\n`;
          currentTeam.push({
            player: members[i],
            god: gods[i]
          })
        }
        message.channel.send(`**${output}**`);
      } else {
        let gods_table = await getGodTable();
        const gods = getRandom(gods_table, members.length);
        var output = "Random Team\n";

        currentTeam = []
        for (var i = 0; i < members.length; i++) {
          output += `${members[i]} - ${gods[i]}\n`;
          currentTeam.push({
            player: members[i],
            god: gods[i]
          })
        }
        message.channel.send(`**${output}**`);
      }
    } else {
      message.reply("You need to join a voice channel first!");
    }
  } else if (args[0] === "godlist") {
    try{
      let gods_table = await getGodTable();
      message.reply(`${gods_table}`);
    } catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "god") {
    try{
      let gods_table = await getGodTable();
      message.reply(`**${getRandom(gods_table, args[1])}**`);
    } catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "physicallist") {
    try{
      let body = getGods("Physical");
      message.reply(`${body}`);
    }catch(err){
      console.log(err);
    }
    
  } else if (args[0] === "physical") {
    try{
      let body = getGods("Physical");
      message.reply(`**${getRandom(body, args[1])}**`);
    } catch(err){
      console.log(err);
    }
    
  } else if (args[0] === "magicallist") {
    try {
      let body = getGods("Magical");
      message.reply(`${body}`);
    } catch(err) {
      console.log(err);
    }
    
  } else if (args[0] === "magical") {
    try{
      let body = getGods("Magical");
      message.reply(`**${getRandom(body, args[1])}**`);
    }catch(err){
      console.log(err);
    }
      
  } else if (args[0] === "hunterlist") {
    try{
      let body = getGods("Hunter");
      message.reply(`${body}`);
    } catch(err){
      console.log(err);
    }
    
  } else if (args[0] === "hunter") {
    try {
      let body = getGods("Hunter");
      message.reply(`**${getRandom(body, args[1])}**`);
    } catch (err) {
      console.log(err);
    }
    
  } else if (args[0] === "guardianlist") {
    try {
      let body = getGods("Guardian");
      message.reply(`${body}`);
    } catch (err) {
      console.log(err);
    }
    
  } else if (args[0] === "guardian") {
    try {
      let body = getGods("Guardian");
      message.reply(`**${getRandom(body, args[1])}**`);
    } catch (err) {
      console.log(err);
    }
    
  } else if (args[0] === "mage") {
    try{
      let body = getGods("Mage");
      message.reply(`**${getRandom(body, args[1])}**`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "magelist") {
    try{
      let body = getGods("Mage");
      message.reply(`${body}`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "warriorlist") {
    try{
      let body = getGods("Warrior");
      message.reply(`${body}`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "warrior") {
    try{
      let body = getGods("Warrior");
      message.reply(`**${getRandom(body, args[1])}**`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "assassinlist") {
    try{
      let body = getGods("Assassin");
      message.reply(`${body}`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "assassin") {
    try{
      let body = getGods("Assassin");
      message.reply(`**${getRandom(body, args[1])}**`);
    }catch(err){
      console.error(err);
    }
    
  } else if (args[0] === "trade") {
    console.log(args[1]);
    let playerIdRegx = /^<@!(\d)*>$/; // I forgot how to check for a certain number of decimals lol
    if (playerIdRegx.test(args[1])) {
      try {
        let playerId_tradee = args[1].substring(3, args[1].length - 1);
        let playerId_trader = message.member.id;
        let tradee = currentTeam.find(teamMember => teamMember.player.id === playerId_tradee);
        let trader = currentTeam.find(teamMember => teamMember.player.id === playerId_trader);
        message.reply(`You requested to trade **${trader.god}** for **${tradee.god}** from <@!${tradee.player.id}>.\n**To accept, use \`s!accept\`**`);
        tradeRequests.push({
          tradee: {...tradee}, // the person receieveing the trade request (Need to spread to use a new object instead of a reference)
          trader: {...trader}, // the person sending the trade request (Need to spread to use a new object instead of a reference)
          expires: 60000,
        })

      } catch (err) {
        console.error(err);
      }
    }
    else {
      message.reply('You need to mention a player you would like to trade with!');
    }
  } else if(args[0] === "accept"){
    let tradeRequest = tradeRequests.find(tradeRequest => tradeRequest.tradee.player.id === message.member.id);
    if (tradeRequest) {
      console.log("trader: %s\ntradee: %s", tradeRequest.trader.god, tradeRequest.tradee.god);
      let tradee = currentTeam.find(teamMember => teamMember.player.id === message.member.id);
      let trader = currentTeam.find(teamMember => teamMember.player.id === tradeRequest.trader.player.id);

      tradee.god = `${tradeRequest.trader.god}`;
      trader.god = `${tradeRequest.tradee.god}`;

      let output = 'Trade Accepted!\n__**New Team**__\n';
      console.log(currentTeam);
      console.log(tradeRequest);

      for (let i=0; i<currentTeam.length; i++) {
        output += `${currentTeam[i].player} - ${currentTeam[i].god}\n`;
      }
      message.reply(`**${output}**`);

    } else {
      message.reply('You don\'t have any trade requests');
    }
  } else if(args[0] === "update"){
    await updateGods();
    message.reply('Gods list updated!');
  }
  
});

async function getGodArray(urlString, xpathString, callback=undefined) {
  try{
    let body = (await axios({
      method: 'get',
      baseURL: 'https://smite.gamepedia.com',
      url: urlString
    })).data;

    var doc = new dom().parseFromString(body);
    var nodes = xpath.select(xpathString, doc);
    
    if(callback){
      return callback(
        null,
        nodes.map((node) => node.firstChild.data)
      );
    }
    
    return nodes.map((node) => node.firstChild.data);
    
    
  }
  catch(err){
    return console.error(err);
  }
}

function getRandom(arr, n) {
  if(Array.isArray(arr)){
    if (n === undefined) {
      n = 1;
    }
    var result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      return `you requested more gods (${n}) than there are in that category (${arr.length})`;
    while (n--) {
      var x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
  console.error('The first param given to getRandom was not an array...');
  return undefined;
  
}

async function getGodCategory(category){
  if(typeof category === 'string'){
    try {
      let body = await getGodArray(`/Category:${category}_gods`,
        "//*[@id='mw-pages']/div/div/div/ul/li/a"
      );
      return body;
    } catch(err) {
      console.error(err);
    }
  }
}

async function getGodTable() {
  try {
    let body = await getGodArray("/List_of_gods",
      "//*[@id='mw-content-text']/div/table/tbody/tr/td[2]/a"
    );
    return body;
  } catch (err) {
    console.error(err);
  }
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/**
 * This is a function to check if there is a bin folder, then to check if there are the needed files to run.
 */
function checkBin(){
  console.group('check Bin');
  let binExists = fs.existsSync(path.join(__dirname, '/bin'));
  let checkFiles = () => {
    try{
      fs.accessSync(path.join(__dirname, '/bin/gods.json'), fs.constants.R_OK | fs.constants.W_OK);
      // file found

    }catch(err){
      // no file found
      gods = {
        all: [

        ],
      }
      options = {
        prefix: 's!',
      }
      try{
        fs.writeFileSync(path.join(__dirname, '/bin/gods.json'), JSON.stringify(gods));
        fs.writeFileSync(path.join(__dirname, '/bin/options.json'), JSON.stringify(options));
      } catch(err){
        console.log("Can't create gods file...");
        console.error(err);
      }
    }
    try {
      fs.accessSync(path.join(__dirname, '/bin/options.json'), fs.constants.R_OK | fs.constants.W_OK);
      // file found
    } catch (err) {
      // no file found
      options = {
        prefix: 's!',
      }
      try {
        fs.writeFileSync(path.join(__dirname, '/bin/options.json'), JSON.stringify(options));
      } catch (err) {
        console.log("Can't create gods file...");
        console.error(err);
      }
    }
    
  }
  if (binExists){
    checkFiles();
  }
  else {
    try{
      fs.mkdirSync(path.join(__dirname, '/bin'));
      checkFiles();
    } catch(err){
      console.error(err);
    }
    
  }
  console.groupEnd();
}

async function updateGods(){
  let gods = {
    all: await getGodTable(),
    warrior: await getGodCategory('Warrior'),
    hunter: await getGodCategory('Hunter'),
    mage: await getGodCategory('Mage'),
    guardian: await getGodCategory('Guardian'),
    assassin: await getGodCategory('Assassin'),
    physical: await getGodCategory('Physical'),
    magical: await getGodCategory('Magical'),
  }
  try{
    fs.writeFileSync(path.join(__dirname, '/bin/gods.json'), JSON.stringify(gods));
  }
  catch(err){
    console.log("Gods list update failed...");
    console.error(err);
  }
}

function getGods(category=undefined){
  try {
    let gods = JSON.parse(fs.readFileSync(path.join(__dirname, '/bin/gods.json')));
    if(!category) return gods.all;
    else return gods[category.toLowerCase()];

  } catch (err) {
    console.log("Retrieval of gods file failed...");
    console.error(err);
  }
}
/**
 * 
 * @param {string} option Choose an option to return within options.
 */
function getOptions(option = undefined) {
  try {
    let options = JSON.parse(fs.readFileSync(path.join(__dirname, '/bin/options.json')));
    if (!option) return options;
    else return options[option.toLowerCase()];

  } catch (err) {
    console.log("Retrieval of gods file failed...");
    console.error(err);
  }
}

function tradeGods(){

}

async function run(){
  checkBin();
  await updateGods();
  setInterval(async () => {
    await updateGods();
  }, 604800000) // updates every week
  prefix = getOptions('prefix');
  client.login(process.env.DISCORD_TOKEN);
}

run();