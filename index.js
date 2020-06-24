const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

// ================= START BOT CODE ===================
const request = require("request");
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = "s!";
var xpath = require("xpath"),
  dom = require("xmldom").DOMParser;

client.on("ready", () => {
  console.log("I am ready!");
  client.user.setActivity(`${prefix}help`);
});

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
        getGodArray(
          "https://smite.gamepedia.com/Category:Physical_gods",
          "//*[@id='mw-pages']/div/div/div/ul/li/a",
          function (err, body) {
            if (err) {
              console.log(err);
            } else {
              const physical = getRandom(
                body,
                Math.floor(members.length / 2) + uneven
              );
              getGodArray(
                "https://smite.gamepedia.com/Category:Magical_gods",
                "//*[@id='mw-pages']/div/div/div/ul/li/a",
                function (err, body) {
                  if (err) {
                    console.log(err);
                  } else {
                    const magical = getRandom(
                      body,
                      Math.ceil(members.length / 2) - uneven
                    );
                    const gods = physical.concat(magical);
                    for (var i = 0; i < members.length; i++) {
                      output += `${members[i]} ${gods[i]}\n`;
                    }
                    message.channel.send(`**${output}**`);
                  }
                }
              );
            }
          }
        );
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
        var output = `Spread Team (${
          uneven.indexOf(0) !== -1
            ? Math.floor(members.length / 5) + 1
            : Math.floor(members.length / 5)
        } Hunter, ${
          uneven.indexOf(1) !== -1
            ? Math.floor(members.length / 5) + 1
            : Math.floor(members.length / 5)
        } Guardian, ${
          uneven.indexOf(2) !== -1
            ? Math.floor(members.length / 5) + 1
            : Math.floor(members.length / 5)
        } Mage, ${
          uneven.indexOf(3) !== -1
            ? Math.floor(members.length / 5) + 1
            : Math.floor(members.length / 5)
        } Warrior, ${
          uneven.indexOf(4) !== -1
            ? Math.floor(members.length / 5) + 1
            : Math.floor(members.length / 5)
        } Assassin)\n`;
        getGodArray(
          "https://smite.gamepedia.com/Category:Hunter_gods",
          "//*[@id='mw-pages']/div/div/div/ul/li/a",
          function (err, body) {
            if (err) {
              console.log(err);
            } else {
              const hunter = getRandom(
                body,
                uneven.indexOf(0) !== -1
                  ? Math.floor(members.length / 5) + 1
                  : Math.floor(members.length / 5)
              );
              getGodArray(
                "https://smite.gamepedia.com/Category:Guardian_gods",
                "//*[@id='mw-pages']/div/div/div/ul/li/a",
                function (err, body) {
                  if (err) {
                    console.log(err);
                  } else {
                    const guardian = getRandom(
                      body,
                      uneven.indexOf(1) !== -1
                        ? Math.floor(members.length / 5) + 1
                        : Math.floor(members.length / 5)
                    );
                    getGodArray(
                      "https://smite.gamepedia.com/Category:Mage_gods",
                      "//*[@id='mw-pages']/div/div/div/ul/li/a",
                      function (err, body) {
                        if (err) {
                          console.log(err);
                        } else {
                          const mage = getRandom(
                            body,
                            uneven.indexOf(2) !== -1
                              ? Math.floor(members.length / 5) + 1
                              : Math.floor(members.length / 5)
                          );
                          getGodArray(
                            "https://smite.gamepedia.com/Category:Warrior_gods",
                            "//*[@id='mw-pages']/div/div/div/ul/li/a",
                            function (err, body) {
                              if (err) {
                                console.log(err);
                              } else {
                                const warrior = getRandom(
                                  body,
                                  uneven.indexOf(3) !== -1
                                    ? Math.floor(members.length / 5) + 1
                                    : Math.floor(members.length / 5)
                                );
                                getGodArray(
                                  "https://smite.gamepedia.com/Category:Assassin_gods",
                                  "//*[@id='mw-pages']/div/div/div/ul/li/a",
                                  function (err, body) {
                                    if (err) {
                                      console.log(err);
                                    } else {
                                      const assassin = getRandom(
                                        body,
                                        uneven.indexOf(4) !== -1
                                          ? Math.floor(members.length / 5) + 1
                                          : Math.floor(members.length / 5)
                                      );
                                      const gods = hunter
                                        .concat(guardian)
                                        .concat(mage)
                                        .concat(warrior)
                                        .concat(assassin);
                                      for (var i = 0; i < members.length; i++) {
                                        output += `${members[i]} ${gods[i]}\n`;
                                      }
                                      message.channel.send(`**${output}**`);
                                    }
                                  }
                                );
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          }
        );
      } else {
        getGodArray(
          "https://smite.gamepedia.com/List_of_gods",
          "//*[@id='mw-content-text']/div/table/tbody/tr/td[2]/a",
          function (err, body) {
            if (err) {
              console.log(err);
            } else {
              const gods = getRandom(body, members.length);
              var output = "Random Team\n";
              for (var i = 0; i < members.length; i++) {
                output += `${members[i]} - ${gods[i]}\n`;
              }
              message.channel.send(`**${output}**`);
            }
          }
        );
      }
    } else {
      message.reply("You need to join a voice channel first!");
    }
  } else if (args[0] === "godlist") {
    getGodArray(
      "https://smite.gamepedia.com/List_of_gods",
      "//*[@id='mw-content-text']/div/table/tbody/tr/td[2]/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "god") {
    getGodArray(
      "https://smite.gamepedia.com/List_of_gods",
      "//*[@id='mw-content-text']/div/table/tbody/tr/td[2]/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "physicallist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Physical_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "physical") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Physical_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "magicallist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Magical_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "magical") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Magical_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "hunterlist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Hunter_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "hunter") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Hunter_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "guardianlist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Guardian_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "guardian") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Guardian_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "mage") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Mage_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "magelist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Mage_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "warriorlist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Warrior_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "warrior") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Warrior_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  } else if (args[0] === "assassinlist") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Assassin_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`${body}`);
        }
      }
    );
  } else if (args[0] === "assassin") {
    getGodArray(
      "https://smite.gamepedia.com/Category:Assassin_gods",
      "//*[@id='mw-pages']/div/div/div/ul/li/a",
      function (err, body) {
        if (err) {
          console.log(err);
        } else {
          message.reply(`**${getRandom(body, args[1])}**`);
        }
      }
    );
  }
});

async function getGodArray(urlString, xpathString, callback) {
  request(urlString, { json: true }, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    var doc = new dom().parseFromString(body);
    var nodes = xpath.select(xpathString, doc);
    callback(
      null,
      nodes.map((node) => node.firstChild.data)
    );
  });
}

function getRandom(arr, n) {
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

client.login(process.env.DISCORD_TOKEN);