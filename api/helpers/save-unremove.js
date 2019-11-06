module.exports = {

  friendlyName: 'Save Unremove',
  description: 'Used for users who click "Remove" when the "Remove" button has already been clicked for this squad',

  //have to declare all the variables that you want passed into this file HERE
  inputs: {
    manulifeId: {
      description: 'The manulife ID of the employee of the enterred email',
      type: 'string',
      required: true
    },
    selectedSquad:{
      description: "The squad the user has selected to unremove",
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
      outputFriendlyName: 'Send Database Delete Status',
      outputDescription: 'Send back whether the database delete occurred or not.',
      outputType: {
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
        //database query
        let sql = "delete sat from squad_app_transactions sat inner join squad_table st on (sat.squad_id = st.squad_id) where sat.manulife_id =@manulifeId and st.squad =@selectedSquad"
        let request = new Request(sql,function(err, rowCount, rows) {
            if(rowCount > 0) { //the update succeeded
              return exits.success({
                updated: true
              });
            }
            else { //the update failed
              return exits.success({
                updated: false
              });
            }
          }
        );

        //Add the parameters to the SQL queries to prevent injections 
        request.addParameter("manulifeId", TYPES.VarChar, inputs.manulifeId)
        request.addParameter("selectedSquad", TYPES.VarChar, inputs.selectedSquad)

        //execute the query
        inputs.databaseConnection.execSql(request);  
      }
    }); 
  }
}  