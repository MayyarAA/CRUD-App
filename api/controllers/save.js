module.exports = {

  friendlyName: 'Saved',
  description: 'The user pressed the "Approve" button',

  inputs: {
    manulifeID: {
      description: 'The manulifeID of the user whose list we are changing.',
      type: 'string',
      required: true
    },
    squad_ID: {
      description: "The user's new squad",
      type: 'ref',
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
              userName: 'u075ad515ee9', // update me
              password: 'RbZlBZwiUcL2D0whLiMD0c8Jxp6J84o9MPC/b9JMEDcZg/BckbpDyw==' // update me
          },
          type: 'default'
      },
      server: 'azugessqlpreview.database.windows.net', // update me
      options:
      {
        database: 'resource_master', //update me
        encrypt: true
      }
    }

    let connection = new Connection(config);
    
    //Send the connection, ID, and new pulse check list to "helpers/save-to-database.js" to utilize await
    let returnedDataFromHelper = await sails.helpers.saveNewSquads.with({
      manulifeID: inputs.manulifeID,
      squad_ID: inputs.squad_ID,
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