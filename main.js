//Require Statements:
const Discord = require('discord.js');
const axios = require('axios').default;
const ytdl = require('ytdl-core');
const config = require('./config.js');

//client
const client = new Discord.Client();
//log in token:
client.login(config.configuration.token);

client.on('ready', () => {
  console.log('\nMessage From GoodFriend:\nI\'m online and ready to serve you sir.');
});
// =====================================================================
// ======================== Command Center =============================
// =====================================================================
var prefix = "!";
client.on('message', async message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command == 'dude') message.channel.send('🧐 🤏                                     😑');
  
  if (command == 'joke') TellJoke(message.channel);

  if (command == 'join') JoinChannel(message);

  if (command == 'url') PlaySongFromURL(args[0], message);

  if (command == 'leave') LeaveChannel(connection);

  if (command == 'play') PlaySong(args[0], message, connection); 

  if (command == 'pause') PauseSong(message, dispatcher);

  if (command == 'resume') ResumeSong(dispatcher);

  if (command == 'add') AddToQueue(message, args[0]);

  if (command == 'pushback') AddToQueueURL(message, args[0]);
  
  if (command == 'show') ShowQueue(message);

  if (command == 'startStream') start();
});

// =====================================================================
// =====================================================================
// =====================================================================



/////////////////////////////////
//// GLOBAL SCOPE VARIABLES /////
/////////////////////////////////
var songQueue = [];       
var inChannel = false;
var audioActive = false;
var connection;
var dispatcher;
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////


function ShowQueue(message) {
  console.log(songQueue.length);
  for (let i = 0; i < songQueue.length; ++i) {
    if(songQueue[i].Title != "") { //from link
      message.channel.send(`Queue Position ${i}:\n${songQueue[i].url}`)
    } else { //has athour
      message.channel.send(`Queue Position ${i}:\n ${songQueue[i].Title} by ${songQueue[i].author}`);
    }
  }
}
function TellJoke(channel) {
  axios.get('https://official-joke-api.appspot.com/random_joke').then(function (res) {
    channel.send(res.data.setup);
    channel.send(res.data.punchline);
  });
}

async function JoinChannel(message) {

  if (!message.guild) 
    return;
   
  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voice.channel) {
    connection = await message.member.voice.channel.join();
    inChannel = true;
  } else {
    message.reply('You need to join a voice channel first');
  }
  
}

function LeaveChannel(connection) {
  if (inChannel)
      connection.disconnect();

}

async function PlaySong(songName, message, connection) {
  if (inChannel) {
    var stream = '';
    var author = '';
    for (let song of songs.Library)  {
      if (song.Title == songName) {
        stream = song.url;
        author =  song.author;
      }
    }
    if (stream == "") {
      message.channel.send("I Couldn't find your song within my library");
      return;
    } else {
      message.channel.send(`Playing song, ${songName} by ${author}`);
      dispatcher = connection.play(ytdl(stream));
      audioActive = true;
      dispatcher.on("finish", () => {
        console.log("check check")
        if (songQueue.length == 0) {
          message.channel.send("No more songs within my queue, ending audio stream.");
          dispatcher.destroy();
          audioActive = false;
        } else {
          var element = songQueue.shift();
          message.channel.send(`Up next, ${element.Title} by ${element.author}`);
          stream = element.url;
          dispatcher = connection.play(ytdl(stream));
        }
      });
    }
  } else {
    message.reply('I must be in a voice channel first, try the !join command');
  }
}

function PauseSong(message, dispatcher) {
  if (audioActive) {
    dispatcher.pause();
    message.channel.send("Paused current song.");
  } else {
    message.channel.send("There is currently no song playing.");
  }
}


function ResumeSong(dispatcher) {
  if (audioActive) {
    message.channel.send("Resuming current song.");
    dispatcher.resume();
  }

}

function AddToQueue(message, songName) {
  var found = false;
  for (let song of songs.Library)  {
    if (song.Title == songName) {
      found = true;
      songQueue.push(song);
      message.channel.send(`Added ${song.Title} by ${song.author} to the queue. \nPosition: ${songQueue.length}`);
    }
  }
  if (!found) {
    message.channel.send(`Couldnt find song.`);
  }

}

function AddToQueueURL(message, URL) {
  songQueue.push({
    Title: '',
    url: URL,
    author: ''
  });
  message.channel.send(`Added song by URL to the queue. \nPosition: ${songQueue.length}`);
}



async function PlaySongFromURL(url, message) {
  console.log("something");
  if (inChannel) {
    console.log("check")
    var stream = url;
    dispatcher = connection.play(ytdl(stream));
    message.channel.send('Playing song from link');
    audioActive = true;
    dispatcher.on("finish", () => {
      console.log("check check")
      if (songQueue.length == 0) {
        message.channel.send("No more songs within my queue, ending audio stream.");
        dispatcher.destroy();
        audioActive = false;
      } else {
        var element = songQueue.shift();
        message.channel.send(`Up next, ${element.Title} by ${element.author}`);
        stream = element.url;
        dispatcher = connection.play(ytdl(stream));
      }
    });
  } else {
    message.reply('I must be in a voice channel first, try the !join command');
  }
}
var songs = {
  Library: [
    {
      Title: 'StairwayToHeaven',
      url: 'https://www.youtube.com/watch?v=QkF3oxziUI4',
      author: 'Led Zepplin'
    },
    {
      Title: 'WholeLottaLove',
      url: 'https://www.youtube.com/watch?v=oaSk5vnAVJ8',
      author: 'Led Zepplin'
    },
    {
      Title: 'ImmigrantSong',
      url: 'https://www.youtube.com/watch?v=y8OtzJtp-EM',
      author: 'Led Zepplin'
    },
    {
      Title: 'BlackDog',
      url: 'https://www.youtube.com/watch?v=yBuub4Xe1mw',
      author: 'Led Zepplin'
    },
    {
      Title: 'CodeMode',
      url: 'https://www.youtube.com/watch?v=l9nh1l8ZIJQ&t=1458s',
      author: 'Unknown'
    },
    {
      Title: 'Popstar',
      url: 'https://www.youtube.com/watch?v=-iNWEwLfkv8',
      author: 'DJ Khaled ft. Drake'
    },
    {
      Title: 'BackInBlack',
      url: 'https://www.youtube.com/watch?v=pAgnJDJN4VA',
      author: 'ACDC'
    },
    {
      Title: 'FailVideo',
      url: 'https://www.youtube.com/watch?v=zOWJqNPeifU',
      author: 'FAIL'
    },
    {
      Title: '',
      url: ''
    },
    {
      Title: '',
      url: ''
    }
  ]
}



