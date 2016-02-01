/*
 * sql2mw.js
 * 
 * Copyright 2016 Julien Ledun <jledun@iosystems.fr>
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */

var Client = require("mariasql"),
       connection = {
              host: "",
              user: "",
              password: ""
       },
       table = "";

var options = process.argv;

if (options.length < 3) return console.log("you must specify parameters");

var tmp;
for ( var x = 2 ; x < options.length ; x++) {
       tmp = options[x].split("=");
       switch (tmp[0]) {
              case "--host":
                     connection.host = tmp[1];
                     break;
              case "--user":
                     connection.user = tmp[1];
                     break;
              case "--password":
                     connection.password = tmp[1];
                     break;
              case "--base":
                     connection.db = tmp[1];
                     break;
              case "--table":
                     table = tmp[1];
                     break;
              default:
                     return console.log("Unknown parameter " + tmp[0] + ".");
                     
       }
}

for (x in connection) {
       if (connection[x] == "") return console.log("Missed one parameter");
}

/** DATABASE CLIENT CREATION */
var client = new Client(  );
client.connect( connection );

client.on("ready", function() {
       var request = "";
       switch (table) {
              case "":
                     request  ="SHOW TABLES";
                     break;
              default:
                     request  ="DESCRIBE " + table + ";";
                     break;
       }
       client.query(request, function(err, rows) {
              if (err) {
                     console.log(err);
                     return client.close();
              }
              switch (table) {
                     case "":
                            console.log("Tables in " + connection.db + " : ");
                            for (x in rows) console.log(" " + rows[x]["Tables_in_" + connection.db]);
                            break;
                     default:
                            if (rows.numRows <= 0) {
                                   console.log("Empty response.");
                                   break;
                            }
                            
                            /** MEDIAWIKI TABLE CONVERSION */
                            /** TABLE HEADER */
                            console.log("{| class= \"wikitable\"");
                            console.log("!colspan='7'|\"" + request + "\" result :");
                            console.log("|-");
                            tmp = "";
                            for (x in rows[0]) tmp += "|'''" + x + "'''|"
                            tmp += "|Comment";
                            console.log(tmp);
                            console.log("|-");

                            /** TABLE CONTENT */
                            for (x in rows) {
                                   if (Object.keys(rows[x]).length == 6) {
                                          tmp = ""
                                          for (var y in rows[x]) tmp += "|" + rows[x][y] + "|";
                                          tmp += "|";
                                          console.log(tmp);
                                          console.log("|-");
                                   }
                            }

                            /** TABLE FOOTER */
                            console.log("|}");
                            break;
              }
              client.close();
       });
});
client.on("error", function(err) {
       console.log("SQL Connection error");
       console.log(err);
});
client.on("end", function() {
       console.log("SQL Connection ended");
});
client.on("close", function() {
       console.log("SQL Connection closed");
});

//~ console.log(connection);
//~ console.log(table);
