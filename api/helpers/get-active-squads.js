module.exports = {

  friendlyName: 'Get active squads',
  description: 'Get active squads for the value stream input',

  //have to declare all the variables that you want passed into this file HERE
  inputs: {
    valueStream: {
      description: 'The value stream tab that the user is on',
      type: 'string', 
      required: true
    },
    databaseConnection: {
      description: 'The connection to the database',
      type: 'ref', 
      required: true
    }
  },

  //use exits when exiting the function if you want to return any data
  exits: {
    success: {
      outputFriendlyName: 'Active squad list',
      outputDescription: 'List of active squads for value stream input',
      outputType: {
        //these are the variables that can be returned from this file
        activeSquadNames: 'array',
        activeSquadIDs: 'array'
      }
    }
  },

  fn: function(inputs, exits) {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    // Attempt to connect and execute queries if connection goes through
    inputs.databaseConnection.on('connect', async function(err) 
    {
      if (err) {
        console.log("Error: " + err)
        return exits.success({ 
          activeSquadsNames: [],
          activeSquadIDs: []
        });
      }
      else {
        //database query
        let sql = "SELECT Squad, Squad_ID FROM dbo.squad_table WHERE Value_Stream = @valueStream ORDER BY Squad ASC";
        let request = new Request(sql, function(err, rowCount, rows) {
            //if there is less than one row then there are no entries 
            if(rowCount < 1) {
              return exits.success({
                activeSquadsNames: [],
                activeSquadIDs: []
              });
            }
        });
        
        let dbSquads = [], dbSquadIDs = [];

        request.on('row', function (columns) {
          dbSquads.push(columns[0].value);
          dbSquadIDs.push(columns[1].value);
        });
        
        //enters this once the query has finished running
        request.on('requestCompleted', function() {
          //return the list of active squads from the database - the squad names and squad IDs
          return exits.success({
            activeSquadNames: dbSquads,
            activeSquadIDs: dbSquadIDs
          });
        });

        //Add the parameters to the SQL queries to prevent injections 
        request.addParameter('valueStream', TYPES.VarChar, inputs.valueStream);
    
        //execute the query
        inputs.databaseConnection.execSql(request);
      }
    });
  }
};