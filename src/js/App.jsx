//this is all the react code for the page - all within one component called "App"

import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid'; 
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';

import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Fade from '@material-ui/core/Fade';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

export default class App extends React.Component
{
  constructor(props) {
    super(props);
    this.handleEnterClick = this.handleEnterClick.bind(this);
    this.handleConfirmClick = this.handleConfirmClick.bind(this);
    this.handleRemoveClick = this.handleRemoveClick.bind(this);
    this.handleAddSquadsClick = this.handleAddSquadsClick.bind(this);
    this.handleSaveNewSquadsClick = this.handleSaveNewSquadsClick.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
    this.handleCloseSubmitSnackbar = this.handleCloseSubmitSnackbar.bind(this);
    this.handleCloseErrorSnackbar = this.handleCloseErrorSnackbar.bind(this);
    this.handleCheckedAValueStream = this.handleCheckedAValueStream.bind(this);
    this.findActiveSquads = this.findActiveSquads.bind(this);
    this.getValueStreamInfo = this.getValueStreamInfo.bind(this);
    this.updateSquadStatus = this.updateSquadStatus.bind(this);
    this.automaticallyUpdateAllSquads = this.automaticallyUpdateAllSquads.bind(this);
    this.confirmSquad = this.confirmSquad.bind(this);

    this.state = {
      showAll: false //if true, the enter button was pressed with a valid inputted email
      , inputEmail: "" //the email the user types in
      , manulifeId: "" //the manulife ID associated with the inputted email
      , squadList: [] //array of squads the user is currently on
      , squadStatus: [] //array of whether the user's squad statuses (0=no buttons pressed, 1=confirmed, 2=removed)
      , enterError: false //if true, there was an error with the user's inputted email
      , addingNewSquad: false //if true, the user has pressed Add New button and has not saved their updates yet
      , pressedSubmit: false //if true, the user pressed the "Save & Submit" button
      , generalError: false //if true, there was an error while doing something

      , checkedAST: false //if true, then AST is checked
      , checkedCST: false //if true, then CST is checked
      , checkedData: false //if true, then Data is checked
      , checkedDisability: false //if true, then Disability is checked
      , checkedMS: false //if true, then MS is checked
      , checkedOnboarding: false //if true, then Onboarding is checked
      , checkedVSE: false //if true, then VSE is checked

      , checkedSquadIDs: [] //array of the squads that are currently checked off
      , squadNamesAST: [] //array of all squad names in AST from the database (if AST is not checked, it will be empty)
      , squadIDsAST: [] //array of all squad IDs in AST from the database (if AST is not checked, it will be empty)
      , squadNamesCST: [] //array of all squad names in CST from the database (if CST is not checked, it will be empty)
      , squadIDsCST: [] //array of all squad IDs in CST from the database (if CST is not checked, it will be empty)
      , squadNamesData: [] //array of all squad names in Data from the database (if Data is not checked, it will be empty)
      , squadIDsData: [] //array of all squad IDs in Data from the database (if Data is not checked, it will be empty)
      , squadNamesDisability: [] //array of all squad names in Disability from the database (if Disability is not checked, it will be empty)
      , squadIDsDisability: [] //array of all squad IDs in Disability from the database (if Disability is not checked, it will be empty)
      , squadNamesMS: [] //array of all squad names in MS from the database (if MS is not checked, it will be empty)
      , squadIDsMS: [] //array of all squad IDs in MS from the database (if MS is not checked, it will be empty)
      , squadNamesOnboarding: [] //array of all squad names in Onboarding from the database (if Onboarding is not checked, it will be empty)
      , squadIDsOnboarding: [] //array of all squad IDs in Onboarding from the database (if Onboarding is not checked, it will be empty)
      , squadNamesVSE: [] //array of all squad names in VSE from the database (if VSE is not checked, it will be empty)
      , squadIDsVSE: [] //array of all squad IDs in VSE from the database (if VSE is not checked, it will be empty)
    };
  }
   
  //when the "Enter" button is clicked
  handleEnterClick() {
    //if there is no email entered, the input is invalid
    if(!this.state.inputEmail || this.state.inputEmail == "") {
      this.setState({ enterError: true, showAll: false});
    }
    else {
      //can't use this in the .then function below, so create a copy of it
      const that = this;

      //retrieve the manulifeID and squad list for the given email
      //automatically routes to the api/controllers/entered.js file
      fetch('/entered', {
        method: 'PUT',
        body: JSON.stringify({ email: this.state.inputEmail }),
      })
      //this is the response from the backend
      .then(function(response) {
        response.text().then(function(text)
        {
          //parse the data received from the backend
          let data = JSON.parse(text);

          if(data.manulifeId == "" || !data.manulifeId) {
            that.setState({ enterError: true, showAll: false });
          }
          else {
            let tmpSquadStatus = [];
            data.squads.forEach(function() {
              tmpSquadStatus.push(false);
            });

            //save the values from the database as states in the class
            that.setState({ showAll: true, manulifeId: data.manulifeId, squadList: data.squads, squadStatus: tmpSquadStatus, enterError: false, addingNewSquad: false});
          }
        });
      })
    }
  } 

  //when the "Confirm" button is clicked for any squad (the key indictates which squad it was)
  handleConfirmClick(key) {
    //if the previous state for the row was 'remove'
    if(this.state.squadStatus[key] == 2) {
      //this function will call the back-end & get it's response
      this.unremoveSquad(key);
    }

    //this function will call the back-end & get it's response
    this.confirmSquad(key, true);
  }  

  //when the "Remove" button is clicked for any squad (the key indictates which squad it was)
  handleRemoveClick(key) {
    //if the previous state for the row was 'remove'
    if(this.state.squadStatus[key] == 2) {
      //this function will call the back-end & get it's response
      this.unremoveSquad(key);
    }
    else {
      //can't use 'this' in the .then  function below, so create a copy of it
      const that = this;
      //insert squads to be removed in the temporary table
      //automatically routes to the api/controllers/remove.js file
      fetch('/remove', {
        method: 'PUT',
        body: JSON.stringify(
          { 
            manulifeId: this.state.manulifeId,
            selectedSquad: this.state.squadList[key] 
          }),
        })
      //this is the response from the backend
      .then(function(response) {
        response.text().then(function(text)
        {
          //parse the data received from the backend
          let data = JSON.parse(text);
          if(data.updatedSuccessfully == true) {
            //update the UI to reflect a successful save
            that.updateSquadStatus(key, 2);
          }
        });
      });
    }
  }

  //when the "Add Squad(s)" button is clicked
  handleAddSquadsClick() {
    this.setState({addingNewSquad: true });

  }

  //when the "Save & Submit" button is pressed AFTER adding new squad(s)
  handleSaveNewSquadsClick() {
    //check whether all squads have been confirmed/removed, and if not, automatically confirm them
    this.automaticallyUpdateAllSquads();

    //can't use 'this' in the .then  function below, so create a copy of it
    const that = this;

    //loop through the checkedSquadsID
    for(let i = 0; i < this.state.checkedSquadIDs.length; i++) {

      //add all the selected new squads to the stored manulife ID
      //automatically routes to the api/controllers/save.js file
      fetch ('/save',{
        method: 'PUT',
        body: JSON.stringify(
          {
            //Place the inputs here 
            manulifeID: this.state.manulifeId,
            squad_ID: this.state.checkedSquadIDs[i]
          }),
        }) 
        //The responce from the backened
        .then(function(response){
        response.text().then(function(text)
          {
            //parse the data from the backend 
            let data = JSON.parse(text);
            if (data.updatedSuccessfully == true ) {
              that.setState({ addingNewSquad: false, showAll: false, pressedSubmit: true, inputEmail: "" });
            }
            else {
              console.log("hi");
              that.setState({ generalError: true });
            }
        });
      });
    }
  }

  //when the "Save & Submit" button is clicked
  handleSubmitClick() {
    //check whether all squads have been confirmed/removed, and if not, automatically confirm them
    this.automaticallyUpdateAllSquads();
    this.setState({ showAll: false, pressedSubmit: true, inputEmail: "" });
  }

  //called when the pop-up message for clicking "Save & Submit" closes
  handleCloseSubmitSnackbar() {
    this.setState({ pressedSubmit: false });
  }

  //called when the pop-up message for an error that occurs within the app
  handleCloseErrorSnackbar() {
    this.setState({ generalError: false });
  }

  //called when a value stream checkbox has been checked
  handleCheckedAValueStream = name => event => {
    this.setState({ [name]: event.target.checked });

    if(event.target.checked == true) {
      this.findActiveSquads(this.getValueStreamInfo(name));
    }
  }

  //retrieves data from the "CheckboxList" function
  callbackFunction = (childData) => {
    //childData is an array of what squads are currently checked off
    this.setState({ checkedSquadIDs: childData });
  }

  getValueStreamInfo = (checkboxName) => {
    if(checkboxName == "checkedAST") {
      return (valueStreams.ast);
    } else if(checkboxName == "checkedCST") {
      return (valueStreams.cst);
    } else if(checkboxName == "checkedData") {
      return (valueStreams.data);
    } else if(checkboxName == "checkedDisability") {
      return (valueStreams.disability);
    } else if(checkboxName == "checkedMS") {
      return (valueStreams.ms);
    } else if(checkboxName == "checkedOnboarding") {
      return (valueStreams.onboarding);
    } else if(checkboxName == "checkedVSE") {
      return (valueStreams.vse);
    }

    return("");
  }

  //retrieves active squads from the database for the passed in Value Stream
  findActiveSquads = (chosenValueStream) => {
    if(chosenValueStream == "") {
      return ;
    }
    //can't use this in the .then function below, so create a copy of it
    const that = this;
    
    //retrieve all the active squads for the chosen value stream
    //automatically routes to the api/controllers/squads.js file
    fetch('/squads', {
      method: 'PUT',
      body: JSON.stringify({ valueStream: chosenValueStream.databaseFieldName }),
    })
    //this is the response from the backend
    .then(function(response) {
      response.text().then(function(text)
      {
        //parse the data received from the backend
        let data = JSON.parse(text);
        that.setState({ [chosenValueStream.classStateNameVariable]: data.activeSquadNames, [chosenValueStream.classStateIDVariable]: data.activeSquadIDs});
      });
    });
  }

  //updates the state variable "squadStatus" with the status of the squad that was just changed (whether it was just confirmed or removed)
  //has to update the specific squad in the array
  updateSquadStatus = (key, newStatus) => {
    this.setState(state => {
      const squadStatus = state.squadStatus.map((item, j) => {
        if (j === key) { //when it finds the affected squad
          return newStatus;
        } else { //if it was not the selected squad, keeps the status the same
          return item;
        }
      });
      return {
        squadStatus,
      };
    });
  };

  //checks whether all squads were confirmed or removed when "Save & Submit" is pressed
  //if a squad hasn't been touched, we will automatically confirm it
  automaticallyUpdateAllSquads() {
    for(let i=0; i<this.state.squadStatus.length; i++) {
      if(this.state.squadStatus[i] == 0) {

        //this function will call the back-end & get it's response
        this.confirmSquad(i, false) 
      }
    }
  }

  //function calls the back-end for confirming squads
  confirmSquad(key, pressedConfirmButton) {
    //can't use this in the .then function below, so create a copy of it
    const that = this;

    //save the confirm date to the database (use the manulifeID that was retrieved after pressing Enter)
    //automatically routes to the api/controllers/confirm.js file
    fetch('/confirm', {
      method: 'PUT',
      body: JSON.stringify(
        { 
          manulifeId: this.state.manulifeId,
          selectedSquad: this.state.squadList[key],
        }),
      })
    //this is the response from the backend
    .then(function(response) {
      response.text().then(function(text)
      {
        //parse the data received from the backend
        let data = JSON.parse(text);
        if(data.updatedSuccessfully == true && pressedConfirmButton == true) {
          //update the UI to reflect a successful save
          that.updateSquadStatus(key, 1);
        }
        else {
          that.setState({ generalError: true });
        }

      });
    });
  }
  
  //remove the squad from the "removal" temporary table in the database
  //automatically routes to the api/controllers/unremove.js file
  unremoveSquad(key) {
    let confirmedSquad = this.state.squadList[key];

    //can't use this in the .then function below, so create a copy of it
    const that = this;

    fetch('/unremove', {
      method: 'PUT',
      body: JSON.stringify(
        { 
          manulifeId: this.state.manulifeId,
          selectedSquad: confirmedSquad 
        }),
      })
    //this is the response from the backend
    .then(function(response) {
      response.text().then(function(text)
      {
        //parse the data received from the backend
        let data = JSON.parse(text);
        if(data.updatedSuccessfully == true) {
          //update the UI to reflect a successful save
          that.updateSquadStatus(key, 0);
        }
      });
    });
  }


  render () {
    {/*the elements that always appear on screen - the email and heading text*/}
    let emailPrompt = 
      <div>
        <title>Squad Validation Application</title>

        <Box fontSize={40} fontWeight="fontWeightBold" fontFamily="Manulife JH Sans" 
             marginTop = "40px"  marginBottom="20px" >
          Validate and Edit Your Squad Data
        </Box>

        <Box fontSize={18} fontFamily="Manulife JH Sans"  marginLeft="9px" 
          marginBottom="30px">
          Enter your Manulife email to see your squad(s)!
        </Box>

        <TextField 
          id="tfInputEmail"
          value={this.state.inputEmail}
          onKeyPress={(ev) => {
            if (ev.key === 'Enter') {
              this.handleEnterClick();
              ev.preventDefault();
            }
          }}
          onChange={e => this.setState({ inputEmail: e.target.value })}
          style={{ width: 550}}
          placeholder="first_last@manulife.(ca/com)"
          autoComplete = "email" 
          inputProps={{
            spellCheck: false,
            style: {fontFamily: "Manulife JH Sans"}
          }}
          variant="outlined"
        />
        
        <br/>
        <Button id="btnEnter" variant="contained" color="primary"
        style={{ marginTop: 15, marginBottom: 35, width: 550, height: 35, fontFamily: "Manulife JH Sans"}} 
        onClick={this.handleEnterClick}>
          Enter
        </Button>

        {/* <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.generalError}
          autoHideDuration={4000}
          onClose={this.handleCloseErrorSnackbar}
        >
          <MySnackbarContentWrapper
            onClose={this.handleCloseErrorSnackbar}
            variant="error"
            message="There was an error"
          />
        </Snackbar> */}

        {/*this is a pop-up message (snackbar) that will appear when the user presses the "Save & Submit" button to indictate that the process is complete*/}
        <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.pressedSubmit}
            autoHideDuration={4000}
            onClose={this.handleCloseSubmitSnackbar}
          >
            <MySnackbarContentWrapper
              onClose={this.handleCloseSubmitSnackbar}
              variant="success"
              message="Finished Validating Squad Information!"
            />
          </Snackbar>
      </div>
    ;

    {/*shows up if there is an invalid email entered*/}
    let enterError;
    if(this.state.enterError == true)
    {
      enterError = 
        <Box fontSize={15} fontFamily="Manulife JH Sans" color="red" style={{ marginTop: -6 }}>
          Invalid email entered
        </Box>
      ;
    }

    {/*only shows up if the "Enter" button has been pressed with a valid email*/}
    let squadInfoHeading, buttons, saveNewSquadButton, chosenLists, valueStreamRow, squadNote, noteUpdate2;
    let boxes = [];
    if(this.state.showAll)
    {
      squadInfoHeading =
        <div align="center" >
          <Box fontSize={18} fontFamily="Manulife JH Sans"  marginLeft="9px" 
            marginBottom="0px" marginTop="0px" fontWeight='bold'>
            Your Squad(s)
          </Box>
          <br/>
        </div>
      ;
      squadNote = <div align="center" >
      <Grid container style = {{fontFamily : "Manulife JH Sans", fontSize: "16px"}}alignItems = "center" align = "center" justify = "center">

<Grid item spacing = {1} style = {{fontFamily: "Manulife JH Sans"}}>
Edit your squad data by clicking  
</Grid>

<Grid item style={{fontFamily : "Manulife JH Sans", fontWeight : "bold", padding: "4px", }} >
  Confirm
</Grid>
<Grid item style={{fontFamily : "Manulife JH Sans", }}>
  or
</Grid>

<Grid item style={{fontFamily : "Manulife JH Sans", fontWeight : "bold", padding: "4px", }} >
  Remove
</Grid>

</Grid>

      <br/>
      <Grid container style = {{fontFamily : "Manulife JH Sans", fontSize: "16px"}}alignItems = "center" align = "center" justify = "center">
      <Grid item spacing = {1} style={{fontFamily : "Manulife JH Sans",  padding:"4px" }} >
      Click the white

      </Grid>
        <Grid item style={{fontFamily : "Manulife JH Sans", fontWeight : "bold", padding: "4px", }} >
      Add Squad(s)
      </Grid>
      <Grid item style={{fontFamily : "Manulife JH Sans", }}>
      button to add more squads.
      </Grid>
</Grid>
     
     <br/>



    </div>
  ;

      for(let i=0; i<this.state.squadList.length;i++) {

        //The background colours of the squads in the user's squad list
        // '2' is for when remove is pressed (grey)
        // '1' is for when confirm is pressed (green)
        // '0' is the starting state (white) 
        let squadColour;
        let shadowNum = 1;
        let stateIcon ;
        if(this.state.squadStatus[i] == 0) {
          squadColour = '#FFFFFF';
        } else if(this.state.squadStatus[i] == 1) {
          squadColour = '#ace5c4';
          shadowNum = 0;
          stateIcon = <CheckCircleIcon style ={{ fontSize:35, color :'#00A758'}}  > </CheckCircleIcon>;
        } else if(this.state.squadStatus[i] == 2) {
          squadColour = '#C2C3C9';
          shadowNum = 0;
          stateIcon = <HighlightOffIcon style = {{fontSize :35, color: '#EC6453'}} > </HighlightOffIcon>;
        }

        {/*the boxes that display the squads that the user is in*/}
        boxes.push(
          <Fade in={true}> 
          <Grid container  justify = "center" alignItems ="center">
            <Box  style={{margin:"1px", width: 550, height:65, backgroundColor:[squadColour]}} boxShadow={shadowNum} borderRadius={5} key={i} >
              <Box justify = "center" fontFamily="Manulife JH Sans" padding = "10px" fontSize = {20} >
                
                <Grid container alignItems = "center" justify = "center">
                  <Grid item>
                    <Box width = '200' align = 'left' style={{ marginTop: 5 }}>
                      {this.state.squadList[i]}
                    </Box>
                  </Grid>

                  <Grid item>
                    <Button id="confirmBtn" style={{backgroundColor:'#00A758', color:'white', marginRight:"10px"}} 
                      onClick={() => this.handleConfirmClick(i)} >
                      Confirm
                    </Button>
                    <Button style={{backgroundColor: '#EC6453', color:'white'}} onClick={() => this.handleRemoveClick(i)} >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
                </Box>
                
            </Box>
            {stateIcon}
            </Grid>
          </Fade>
        )
      }

      let dis = this.state.addingNewSquad;
      // let saveSubmit= <Grid> "Save & Submit"</Grid>
      buttons = 
        <div align="center">
          <Button id="btnEdit" variant="outlined"  color = "primary" style={{
            margin: 5, fontFamily: "Manulife JH Sans", width: 270, boxShadow: "0 0.5px 0.5px 0.5px"}} onClick={this.handleAddSquadsClick}>
            Add Squad(s)
          </Button>
         
          <Button variant="contained"  disabled = {dis} style={{ fontFamily: "Manulife JH Sans", width: 270, margin: 5, color: "white"}}
            onClick={this.handleSubmitClick}
            color="primary" >
            Save & Submit
          </Button>
          <Grid container style = {{fontFamily : "Manulife JH Sans", fontSize: "16px"}}alignItems = "center" align = "center" justify = "center">

          <Grid item spacing = {1} style = {{fontFamily: "Manulife JH Sans"}}>
          When finished click 
          </Grid>

          <Grid item style={{fontFamily : "Manulife JH Sans", fontWeight : "bold", padding: "7px", }} >
            "Save & Submit"
          </Grid>
          </Grid>

          {/*the pop-up message (snackbar) that appears when the user presses the "Save New Squads" button indictating the save was successful*/}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.savedNewSquad}
            autoHideDuration={4000}
            onClose={this.handleCloseSuccessSnackbar}
          >
            <MySnackbarContentWrapper
              onClose={this.handleCloseSuccessSnackbar}
              variant="success"
              message="Squad updates submitted!"
            />
          </Snackbar>
        </div>
      ;

      if(this.state.addingNewSquad == true)
      {
        //the horizontal strip where users check off the value streams they want
        valueStreamRow = 
          <Grid container alignItems="center" justify="center" style={{ marginTop: 40 }}> 
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedAST} onChange={this.handleCheckedAValueStream('checkedAST')} value="checkedAST" color="secondary"/>
                }
                label="AST"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedCST} onChange={this.handleCheckedAValueStream('checkedCST')} value="checkedCST" color="secondary"/>
                }
                label="CST"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedData} onChange={this.handleCheckedAValueStream('checkedData')} value="checkedData" color="secondary"/>
                }
                label="Data"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedDisability} onChange={this.handleCheckedAValueStream('checkedDisability')} value="checkedDisability" color="secondary"/>
                }
                label="Disability &amp; Other"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedMS} onChange={this.handleCheckedAValueStream('checkedMS')} value="checkedMS" color="secondary"/>
                }
                label="Member &amp; Sponsor"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedOnboarding} onChange={this.handleCheckedAValueStream('checkedOnboarding')} value="checkedOnboarding" color="secondary"/>
                }
                label="Onboarding"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={this.state.checkedVSE} onChange={this.handleCheckedAValueStream('checkedVSE')} value="checkedVSE" color="secondary"/>
                }
                label="VSE"
              />
            </FormGroup>
          </Grid>
        ;


        //the checkbox lists of all the squads for each checked off Value Stream
        let lists = [], listKeys = [];
        let largestListLength = 0;
        let listAST, listCST, listData, listDisability, listMS, listOnboarding, listVSE;

        if(this.state.checkedAST) {
          listAST = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesAST} squadIDs={this.state.squadIDsAST} valueStream="AST" parentCallback={this.callbackFunction}/>
          lists.push(listAST);
          largestListLength = findLargestListLength(this.state.squadNamesAST.length, largestListLength);
          listKeys.push(valueStreams.ast.databaseFieldName);
        }

        if(this.state.checkedCST) {
          listCST = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesCST} squadIDs={this.state.squadIDsCST} valueStream="CST" parentCallback={this.callbackFunction}/>
          lists.push(listCST);
          largestListLength = findLargestListLength(this.state.squadNamesCST.length, largestListLength);
          listKeys.push(valueStreams.cst.databaseFieldName);
        }

        if(this.state.checkedData) {
          listData = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesData} squadIDs={this.state.squadIDsData} valueStream="Data" parentCallback={this.callbackFunction}/>
          lists.push(listData);
          largestListLength = findLargestListLength(this.state.squadNamesData.length, largestListLength);
          listKeys.push(valueStreams.data.databaseFieldName);
        }

        if(this.state.checkedDisability) {
          listDisability = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesDisability} squadIDs={this.state.squadIDsDisability} valueStream="Disability &amp; Other" parentCallback={this.callbackFunction}/>
          lists.push(listDisability);
          largestListLength = findLargestListLength(this.state.squadNamesDisability.length, largestListLength);
          listKeys.push(valueStreams.disability.databaseFieldName);
        }

        if(this.state.checkedMS) {
          listMS = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesMS}  squadIDs={this.state.squadIDsMS} valueStream="Member &amp; Sponsor" parentCallback={this.callbackFunction}/>
          lists.push(listMS);
          largestListLength = findLargestListLength(this.state.squadNamesMS.length, largestListLength);
          listKeys.push(valueStreams.ms.databaseFieldName);
        }

        if(this.state.checkedOnboarding) {
          listOnboarding = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesOnboarding}  squadIDs={this.state.squadIDsOnboarding} valueStream="Onboarding" parentCallback={this.callbackFunction}/>
          lists.push(listOnboarding);
          largestListLength = findLargestListLength(this.state.squadNamesOnboarding.length, largestListLength);
          listKeys.push(valueStreams.onboarding.databaseFieldName);
        }

        if(this.state.checkedVSE) {
          listVSE = <CheckboxList checkedSquads={this.state.checkedSquadIDs} squadNames={this.state.squadNamesVSE}  squadIDs={this.state.squadIDsVSE} valueStream="VSE" parentCallback={this.callbackFunction}/>
          lists.push(listVSE);
          largestListLength = findLargestListLength(this.state.squadNamesVSE.length, largestListLength);
          listKeys.push(valueStreams.vse.databaseFieldName);
        }

        let height = 70 * largestListLength + "px";

        chosenLists =
          <div display="flex" overflow="hidden">
            <GridList cellHeight={height} width="1500px" height={height} cols={lists.length} >
              {lists.map((list, index) => (
                <GridListTile key={listKeys[index]} cols={1}>
                  {list}
                </GridListTile>
              ))}
            </GridList>
          </div>
        ;

        if(lists.length > 0) {
          saveNewSquadButton = 
            <Button variant="contained" color="primary" style={{ fontFamily: "Manulife JH Sans", width: 270, marginTop: 20, marginBottom: 40 }}
            onClick={this.handleSaveNewSquadsClick} >
              Save & Submit
            </Button>
          ;
          noteUpdate2 = 
          <div align="center" >
          <Box fontSize={16} fontFamily="Manulife JH Sans"  marginLeft="9px" 
            marginBottom="0px" marginTop="0px" >
           Your squad changes are updated in the Resource MAster DB weekly.
          </Box>
          <br/>
          </div>;
        }
      }
      if(this.state.addingNewSquad == false){
        noteUpdate2 = 
          <div align="center" >
          <Box fontSize={16} fontFamily="Manulife JH Sans"  marginLeft="9px" 
            marginBottom="0px" marginTop="0px" padding = "15px">
          Your squad changes are updated in the Resource Master DB weekly.
          </Box>
          <br/>
          </div>;
      } 
    }
    let noteUpdate;
    if(this.state.showAll == false) {
    noteUpdate = 
    <div align="center" >
    <Box fontSize={16} fontFamily="Manulife JH Sans"  marginLeft="9px" 
      marginBottom="0px" marginTop="0px" >
      Your squad changes are updated in the Resource Master DB weekly.
    </Box>
    <br/>
    </div>;
    }

    {/*render all the variables together within a form and a theme*/}
    return (
      <form display="flex" noValidate autoComplete="off">
        <ThemeProvider theme={theme}>
          <div align = 'center'>
            {emailPrompt}
            {enterError}
            {noteUpdate}
            {squadInfoHeading}
              {squadNote}
            {boxes}
            {buttons}
            {valueStreamRow}
            {chosenLists}
            {saveNewSquadButton}
            {noteUpdate2}
          </div>
        </ThemeProvider>
      </form>
    );
  }
}

//called for every list for each value stream that is checked
function CheckboxList(props) {
  const [checked, setChecked] = React.useState([0]);

  //function that is called when one of the list checkboxes are clicked
  const handleToggle = value => () => {
    //keeping track of the UI for this Value Stream
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);

    //All the checked squads between all checked off Value Streams
    let allCheckedSquads = props.checkedSquads;
    const index = allCheckedSquads.indexOf(value);

    if (currentIndex === -1) {
      allCheckedSquads.push(value);
    } else {
      allCheckedSquads.splice(index, 1);
    }
    //sends the checked off squads to the App Component and saves them the "squads" state in the class
    props.parentCallback(allCheckedSquads);
  };

  return (
    <div>
      {/*Value Stream headings for checked off Value Streams*/}
      <Box fontSize={18} fontFamily="Manulife JH Sans" fontWeight={500} color="white" 
        style={{ backgroundColor: '#5E6073', height: 59, marginTop: 30, borderRadius: 10, maxWidth: 600 }} >
        <br/>
        {props.valueStream}
      </Box>

      {/*list of squads within the selected Value Streams*/}
      <List style={{ maxWidth: 600 }}>
        {props.squadIDs.map((value, index) => {
          const labelId = `checkbox-list-label-${value}`;

          {/*each row within the list*/}
          return (
            <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  color="secondary"
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={props.squadNames[index]} />
            </ListItem>
          );
        })}
      </List>
    </div>
  );
}

//this is for the success snackbar message
function MySnackbarContentWrapper(props) {
  const classes = useSnackbarStyles();
  const { className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={clsx(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}

//used to find the largest list to adjust the size of the grid accordingly
function findLargestListLength(squadListLength, previousLargestListLength) {
  if(previousLargestListLength < squadListLength) {
    return (squadListLength);
  }
  else {
    return (previousLargestListLength);
  }
}


//change the primary colours of the UI 
const theme = createMuiTheme({
  palette: { 
    primary: {
      main: '#1E1EE5'
      // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    },
    secondary: {
      main: '#282b3e'
    }
  },
}); 

//This and below are used for the success snackbar message
const variantIcon = {
  success: CheckCircleIcon,
  error: ErrorIcon,
};

const useSnackbarStyles = makeStyles(theme => ({
  success: {
    backgroundColor: '#00A758',
  },
  error: {
    backgroundColor: '#FF1133',
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

MySnackbarContentWrapper.propTypes = {
  className: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func,
  variant: PropTypes.oneOf(['error', 'success']).isRequired,
};

//information about each value stream
const valueStreams = {
  ast: {
    databaseFieldName: "AST",
    classStateNameVariable: "squadNamesAST",
    classStateIDVariable: "squadIDsAST"
  },
  cst: {
    databaseFieldName: "CST",
    classStateNameVariable: "squadNamesCST",
    classStateIDVariable: "squadIDsCST"
  },
  data: {
    databaseFieldName: "Data",
    classStateNameVariable: "squadNamesData",
    classStateIDVariable: "squadIDsData"
  },
  disability: {
    databaseFieldName: "Disability & Other",
    classStateNameVariable: "squadNamesDisability",
    classStateIDVariable: "squadIDsDisability"
  },
  ms: {
    databaseFieldName: "Member and Sponsor Experience",
    classStateNameVariable: "squadNamesMS",
    classStateIDVariable: "squadIDsMS"
  },
  onboarding: {
    databaseFieldName: "Onboarding",
    classStateNameVariable: "squadNamesOnboarding",
    classStateIDVariable: "squadIDsOnboarding"
  },
  vse: {
    databaseFieldName: "Value Stream Enablement",
    classStateNameVariable: "squadNamesVSE",
    classStateIDVariable: "squadIDsVSE"
  }
};