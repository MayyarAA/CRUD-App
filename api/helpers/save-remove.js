module.exports = {
  
  friendlyName: 'Remove Squad',
  description: "Remove the selected squad from the user's squad list",

  //have to declare all the variables that you want passed into this file HERE
  inputs: {
    manulifeId: {
      description: 'The manulife ID of the employee of the enterred email',
      type: 'string',
      required: true
    },
    selectedSquad:{
      description: "The squad that has been selected to be removed",
      type:'string',
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

        //the database query
        let sql = "insert into squad_app_transactions select rm.manulife_id, rm.stream_id, rm.squad_ID, rm.projects_BAU, confirm_date = @confirmDate from resource_master_table rm inner join squad_table st on (rm.squad_id = st.squad_id) where rm.manulife_id = @manulifeId and st.squad = @selectedSquad"
        let request = new Request(sql, function(err, rowCount, rows) {
            if(rowCount > 0) {//the insert succeeded
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
        request.addParameter("confirmDate", TYPES.VarChar, confirmDate)
        request.addParameter("manulifeId", TYPES.VarChar, inputs.manulifeId)
        request.addParameter("selectedSquad", TYPES.VarChar, inputs.selectedSquad)

        //execute the query
        inputs.databaseConnection.execSql(request);  
      }
    }); 
  }
}  