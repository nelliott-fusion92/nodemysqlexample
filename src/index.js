const mysql = require("mysql");
let playlist = require('./queries/playlist')
const inquirer = require('inquirer')

// Main menu
const menu = [
  {
    type: 'input',
    name: 'action',
    message: 'What do you want to do?\n(C)reate | (R)ead | (U)pdate | (D)elete or (E) to exit'
  }
]

// Connection string for local SQL server
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: 'root',

  // Your password
  password: 'password',
  database: 'playlist_db'
});

// Connect to database, run rest of program once connected
connection.connect(function(err){
  if(err) throw err;
  console.log("connected as id "+ connection.threadId);
  playlist = new playlist.Playlist(connection)

  // Main inquirer loop
  function ask() {
    inquirer.prompt(menu).then((res) => {
      // List of all CRUD operations available to the user
      const actions = {
        c: /*create*/ function() {
          console.log('So you want to create a playlist?')
          inquirer.prompt([
            {
              type: 'input',
              name: 'artist',
              message: 'Enter Artist name'
            },
            {
              type: 'input',
              name: 'title',
              message: 'Enter Playlist Title'
            },
            {
              type: 'input',
              name: 'genre',
              message: 'Enter Genre'
            },
          ]).then((res) => {
            playlist.addPlaylist(res)
            setTimeout(ask, 200)
          })
        },
        r: /*read*/ function() {
          inquirer.prompt({
            type: 'input',
            name: 'artist',
            message: 'Enter an artist to search or nothing to get everything.'
          }).then((res) => {
            if(res.artist == '') {
              playlist.getAllPlaylists()
            }
            else {
              playlist.getPlaylistsByColumn('artist', res.artist)
            }
            setTimeout(ask, 200)
          })
        },
        u: /*update*/ function() {
          inquirer.prompt([
          {
            type: 'input',
            name: 'id',
            message: 'Enter an id to update.'
          },
          {
            type: 'input',
            name: 'colval',
            message: `Enter 'column|newvalue'`
          },
        ]).then((res) => {
            if(res.id == '') {
              console.log('You must enter an id')
              ask()
            }
            else {
              let update = {}
              update[res.colval.split('|')[0]] = res.colval.split('|')[1]
              /*
                res.colval.split('|') == ['column', 'newvalue']
                update['column'] = 'newvalue'
              */
              playlist.updatePlaylist(res.id, update)
            }
            setTimeout(ask, 200)
          })
        },
        d: /*delete*/ function() {
          inquirer.prompt({
            type: 'input',
            name: 'id',
            message: 'Enter an id to delete by, or nothing to delete everything.'
          }).then((res) => {
            if(res.id == '') {
              playlist.dropTable()
              playlist.createTable()
            }
            else {
              playlist.deletePlaylists('id', res.id)
            }
            setTimeout(ask, 200)
          })
        },
        e: /*exit*/ function() {
          process.exit()
        }
      }

      actions[res.action.toLowerCase()]()
    })
  }
  ask()
});
