module.exports = {

friendlyName: 'remove',
description:'Used for users to remove squads when "Remove" button is clicked',

inputs:{
    manulifeId: {
        description: 'The manulifeId of the user whose list we are changing.',
        type: 'string',
        required: true
      },
      approveDate: {
        description: "The user's updated pulse check list",
        type: 'string',
        required: true
      },
       selectedSquad:{
        description: "The squad the user is on ",
         type:'string',
         required: false
       },
      inputEmail:{
        description: "The manulife_email of the user",
         type: 'string',
          required: false
        }
    },
        exits: {
            success: {
              outputFriendlyName: 'Send Database Update Status',
              outputDescription: 'Send back whether the database update occurred or not.',
              outputType: {
                updatedSuccessfully: 'boolean'
              }
            }
          },
        

          fn: async function (inputs, exits) {
              console.log("IN CONTROLLER")
            //database connection
            let Connection = require('tedious').Connection;
            
            // Create connection to database
            let config =
            {
              authentication: {
                  options: {
                      userName: 'u0e9', // update me
                      password: 'RbZlBZwiUcL2D0whbpDyw==' // update me
                  },
                  type: 'default'
              },
              server: 'azugesse.windows.net', // update me
              options:
              {
                database: 'resource', //update me
                encrypt: true
              }
            }

            let connection = new Connection(config);

 //Send the connection, ID, and new pulse check list to "helpers/save-to-database.js" to utilize await
 let returnedDataFromHelper = await sails.helpers.saveRemove.with({
    manulifeId: inputs.manulifeId,
    approveDate: inputs.approveDate,
    // selectedSquad: inputs.selectedSquad,
    // inputEmail: inputs.inputEmail,
    databaseConnection: connection
  });

  //close the database connection
  connection.close();

  //return whether the database update was successful or not
  return exits.success({
    updatedSuccessfully: returnedDataFromHelper.updated
  });
}

};
