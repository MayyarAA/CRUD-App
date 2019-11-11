module.exports = {

  friendlyName: 'Entered',
  description: 'The user pressed the "Enter" button.',

  inputs: {
    email: {
      description: 'The email address entered.',
      type: 'string',
      required: true
    }
  },

  exits: {
    success: {
      outputFriendlyName: 'ID and Squads',
      outputDescription: 'Details of user associated with the given email.',
      outputType: {
        manulifeId: 'string',
        squads: 'array'
      }
    },
  },

  fn: async function (inputs, exits) {
    //database connection
    let Connection = require('tedious').Connection;
   
    // Create connection to database
    let config =
    {
        authentication: {
            options: {
                userName: 'u07', // update me
                password: 'RbZ/b9JMEDcZg/BckbpDyw==' // update me
            },
            type: 'default'
        },
        server: 'azugiew.database.windows.net', // update me
        options:
        {
            database: 'resource', //update me
            encrypt: true
        }
    }

    var connection = new Connection(config);

    // Attempt to connect and execute queries if connection goes through
    connection.on('connect', async function(err)
    {
      if (err)
      {
          console.log(err)
          return exits.success({
            manulifeId: "",
            squads: []
          });
      }
      else
      {
        //send the inputted email and database connection "helpers/get-id-and-squads.js" 
        //to actually query the database - to utilize await
        let data = await sails.helpers.getIdAndSquads.with({
          email: inputs.email,
          databaseConnection: connection
        });

        //close the database connection
        connection.close();

        //return the valid manulife_id and list of squads from the database
        return exits.success({
          manulifeId: data.manulifeId,
          squads: data.squads
        });
      }
    });
  }
};
