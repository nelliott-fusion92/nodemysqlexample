var mysql = require("mysql");

module.exports = {
  createProduct: function(connection, flavor, price) {
    if(!flavor || !price) {
      console.log('Flavor and Price required')
    }
    else {
      return connection.query("INSERT INTO products SET ?",
        {
          flavor,
          price,
        },
        function(err, res) {
          console.log(res.affectedRows + " product inserted!\n")
        }
      )
    }
  },
  getAllProducts: function(connection) {
    return connection.query('SELECT * FROM products', function(err, res) {
      console.log(res)
    })
  },
  createTable: function(connection) {
    return connection.query(`
      CREATE TABLE products (
        id INT NOT NULL AUTO_INCREMENT,
        flavor VARCHAR(30) NOT NULL,
        price NUMERIC NOT NULL,
        PRIMARY KEY (id)
      );
    `)
  },
  dropTable: function(connection) {
    return connection.query(`DROP TABLE products`)
  }
}
