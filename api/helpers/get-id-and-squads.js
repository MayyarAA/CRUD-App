module.exports = {

  friendlyName: 'Get ID and Squads',
  description: 'Get the ID and list of squads for the entered email',

  //have to declare all the variables that you want passed into this file HERE
  inputs: {
    email: {
      description: 'The email address entered.',
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
      outputFriendlyName: 'ID and Squad',
      outputDescription: 'Details of user associated with the given email',
      outputType: {
        //these are the variables that can be returned from this file
        manulifeId: 'string',
        squads: 'array'
      }
    }
  },

  fn: function(inputs, exits) {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    //database query
    let sql = "select employee_table.manulife_id, squad from resource_master_table inner join squad_table on (resource_master_table.squad_id = squad_table.squad_id ) inner join employee_table on ( resource_master_table.manulife_id = employee_table.manulife_id) where employee_table.manulife_email = @email"
    let request = new Request(sql,function(err, rowCount, rows) { });
    
    let dbId;
    let dbSquads = [];

    request.on('row', function (columns) {
      columns.forEach(function (column) {
        if(column.metadata.colName == 'manulife_id') {
          dbId = column.value;
        }
        else {
          //add to the list of squad_id's
          dbSquads.push(column.value);
        }
      });
    });

    //enters this once the query has finished running
    request.on('requestCompleted', function() {
      //return the manulife_id and list of squad_id's from the database
      return exits.success({
        manulifeId: dbId,
        squads: dbSquads
      });
    });

    //Add the parameters to the SQL queries to prevent injections 
    request.addParameter('email', TYPES.VarChar, inputs.email);

    //execute the query
    inputs.databaseConnection.execSql(request);
  }
};