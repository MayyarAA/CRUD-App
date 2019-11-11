module.exports = {

  friendlyName: 'Find squads',
  description: 'Retrieve all the active squads for the selected Value Stream',

  inputs: {
    valueStream: {
      description: 'The value stream tab that the user is on',
      type: 'string', 
      required: true
    }
  },

  //use exits when exiting the function if you want to return any data
  exits: {
    success: {
      outputFriendlyName: 'active squad list',
      outputDescription: 'list of active squads for value stream input',
      outputType: {
        //these are the variables that can be returned from this file
        activeSquadNames: 'array',
        activeSquadIDs: 'array'
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
              userName: 'u079', // update me
              password: 'RbZlBZwiUcckbpDyw==' // update me
          },
          type: 'default'
      },
      server: 'azugse.windows.net', // update me
      options:
      {
          database: 'resource', //update me
          encrypt: true
      }
    }

    var connection = new Connection(config);

    //Send the connection and value stream to "helpers/get-active-squads.js" to utilize await
    let data = await sails.helpers.getActiveSquads.with({
      valueStream: inputs.valueStream,
      databaseConnection: connection
    });

    //close the database connection
    connection.close();

    //return the valid manulife_id and new_list from the database
    return exits.success({
      activeSquadNames: data.activeSquadNames,
      activeSquadIDs: data.activeSquadIDs
    });
  }
};
