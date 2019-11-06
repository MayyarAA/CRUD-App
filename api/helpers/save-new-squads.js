module.exports = {
  friendlyName: 'Save Added New Squads',
  description: 'Add the selected squad to the given manulife ID',

  //have to declare all the variables that you want passed into this file HERE
  inputs: {
    manulifeID: {
      description: 'The manulife ID of the employee of the enterred email',
      type: 'string',
      required: true
    },
    squad_ID: {
      description: "The squad ID of the squad we are adding",
      type: 'number',
      required: true
    },
    databaseConnection: {
      description: 'The connection to the database',
      type: 'ref',
      required: true
    },
  },

  //use exits when exiting the function if you want to return any data
  exits: {
    success: {
      outputFriendlyName: 'Send Database Insert Status',
      outputDescription: 'Send back whether the database insert occurred or not.',
      outputType: {
        //this is the variable that can be returned from this file
        updated: 'boolean'
      }
    }
  },

  fn: async function (inputs, exits) {
    let Request = require('tedious').Request;
    let TYPES = require('tedious').TYPES;

    // Attempt to connect and execute queries if connection goes through
    inputs.databaseConnection.on('connect', async function(err)
    {
      if (err) {
        console.log("Error: " + err)
        return exits.success({
          updated: false
        });
      }
      else {
        let confirmDate = Date().toString(); //the current date & time

        //database query
        let sql = "insert into resource_master_Table select distinct rm.manulife_id, rm.stream_id, squad_ID = @squad_ID, rm.projects_BAU, confirm_date = @confirmDate from resource_master_table rm where manulife_id = @manulifeID;"
        let request = new Request(sql, function(err, rowCount, rows) { 
          if(rowCount > 0) { //the insert succeeded
            return exits.success({
              updated: true
            });
          }
          else { //the insert failed
            return exits.success({
              updated: false
            });
          }
        });

        //Add the parameters to the SQL queries to prevent injections 
        request.addParameter("manulifeID", TYPES.VarChar, inputs.manulifeID)
        request.addParameter("confirmDate", TYPES.VarChar, confirmDate)
        request.addParameter("squad_ID", TYPES.VarChar, inputs.squad_ID)

        //execute the query
        inputs.databaseConnection.execSql(request);
      }
    }); 
  }
};
  