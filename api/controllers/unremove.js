module.exports = {

  friendlyName: 'Unremove',
  description: 'Used for users who click "Remove" when the "Remove" button has already been clicked for this squad',
  
  inputs:{
    manulifeId: {
      description: 'The manulife ID of the employee of the enterred email',
      type: 'string',
      required: true
    },
    selectedSquad:{
      description: "The squad the user has selected to unremove",
      type:'string',
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'Send Database Delete Status',
      outputDescription: 'Send back whether the database delete occurred or not.',
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
    let returnedDataFromHelper = await sails.helpers.saveUnremove.with({
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