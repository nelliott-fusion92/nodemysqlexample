const mysql = require('mysql')

class Playlist {
  constructor(connection) {
    this.connection = connection
  }
  createTable() {
    this.connection.query(`
      CREATE TABLE playlists (
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(255) NOT NULL,
        artist VARCHAR(255) NOT NULL,
        genre VARCHAR(255) NOT NULL,
        PRIMARY KEY (id)
      );
    `, callback)
  }
  getAllPlaylists() {
    this.connection.query(`SELECT * FROM playlists`, callback)
  }
  getPlaylistsByColumn(columnName, val) {
    this.connection.query(`SELECT * FROM playlists WHERE ${ columnName } = ?`, val, callback)
  }
  deletePlaylists(columnName, val) {
    this.connection.query(`DELETE FROM playlists WHERE ${ columnName } = ?`, val, callback)
  }
  updatePlaylist(id, options) {
    this.connection.query(`UPDATE playlists SET ? WHERE ?`, [options, { id }], callback)
  }
  addPlaylist(options) {
    return this.connection.query(`INSERT INTO playlists SET ?`, options, callback)
  }
  dropTable() {
    this.connection.query(`
      DROP TABLE playlists
    `, callback)
  }
}

function callback(err, res) {
  if(err) {
    console.log('Error!')
    console.log(err)
  }
  else {
    console.log(res)
    console.log('Query successful.')
  }
}

module.exports = {
  Playlist
}
