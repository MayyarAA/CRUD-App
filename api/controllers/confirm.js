module.exports = {

  friendlyName: 'Confirm',
  description: 'The user pressed the "Confirm" button',

  inputs: {
    manulifeId: {
      description: 'The manulifeId of the user whose list we are changing.',
      type: 'string',
      required: true
    },
     selectedSquad:{
      description: "The squad the user is on ",
       type:'string',
       required: true
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
    //database connection
    let Connection = require('tedious').Connection;
    
    // Create connection to database
    let config =
    {
      authentication: {
          options: {
              userName: 'u9', // update me
              password: 'RbZlBZwiUcL' // update me
          },
          type: 'default'
      },
      server: 'essqlpreview.database.windows.net', // update me
      options:
      {
        database: 'resource_mas', //update me
        encrypt: true
      }
    }

    let connection = new Connection(config);

    //Send the connection, ID, and new pulse check list to "helpers/save-to-database.js" to utilize await
    let returnedDataFromHelper = await sails.helpers.saveConfirm.with({
      manulifeId: inputs.manulifeId,
      selectedSquad: inputs.selectedSquad,
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
