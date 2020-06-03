console.log('Running Robo Orienteer..');

/*
Unpolished code fragment to create and move a robot in a wierd rectangular version of mars.
Moves within an input defined boundary from a start position and orientation in accordance with
an input direction instruction text. 

Warning : May not perform to spec - Not completed 

Dependencies 
(1) - DOM from parent browser index.html file into which this script is loaded, same relative path.
(2) - non-robot typing in some input values to the index.html file when this is run.
(3) - put together using Visual Code and Live Server extension.

Note : Error handling needs a revisit and some assumptions may not be valid. 
Console.log is used for debug trace in addition to writing back 
to the DOM in the calling index page to display final outcome.

*/

// Define boundary coords for end of world 
const maxCoordVal = 50;
const maxNavSteps = 100;
let worldEndX; // Upper Right Grid Boundary x-coord
let worldEndY; // Upper Right Grid Boundary y-coord
let messageText = ""; // Message Text for output

let roboScents = new Array(); // Last known x,y jump off coords R.I.P robos

// Record coordinate pair from last known location of LOST robot
addRoboScent = ( xpos, ypos, orientation ) => {

    if ( CoordIsRoboScented ( xpos, ypos, orientation ) == true ) {
        console.log(`Skipping Adding scent for ${xpos} ${ypos} ${orientation}. Scent Already exists`);

    } else {
        roboScents.push({ x : xpos, y : ypos , o : orientation });
        console.log(`Added scent for ${xpos} ${ypos} ${orientation}`);
    }
}

// Check scent at coordinate
// Not sure if orientation should be a factor if not concerned at edge
CoordIsRoboScented = ( xpos, ypos, orientation ) => {
    // Old School Loop to smell a scent 
    // Returns True if passed coord exists in roboScents array
    let scented = false;
    console.log(`Checking for scent at position ${xpos}, ${ypos}, ${orientation}`)
    for ( i = 0; i < roboScents.length; i++) {
        //console.log (`Checking Position against scent  ${roboScents[i].x}   ${roboScents[i].y} ${roboScents[i].o}`);
        if ( roboScents[i].x == xpos && roboScents[i].y == ypos && roboScents[i].o == orientation) {
        //console.log('Scented')
        scented = true;
		}
    } 

    return scented;
}

// Check coordinate against grid boundary. 
const isCoordOnMars = ({x1, y1, x2, y2}, {newXpos, newYpos}) => (
    (newXpos < x2 && newXpos > x1) && (newYpos < y2 && newYpos > y1)
    )

// Template a robot 
class robo {
  constructor ( name, xpos, ypos, orientation, instructions  ) {
    this.name = name;
    this.xpos = xpos;
    this.ypos = ypos;
    this.orientation = orientation;
    this.instructions = instructions;
    this.lost = false; // Update true if robo strolls off the edge
   }

  setRoboPos (  xpos, ypos, orientation) {

    if ( xpos > maxCoordVal || ypos > maxCoordVal) {
     throw `unable to initialise Robot Position, x or y coord exceeds max ${maxCoordVal}`;
    }

    this.xpos = xpos;
    this.ypos = ypos;
    this.orientation = orientation;
  }

  getRoboPos () {
      return ` Robot ${this.name} is at ${this.xpos} ${this.ypos} ${this.orientation}`
  }

  setRoboNavInstruction ( instructions ) {
      // Ensure Instruction Navigation Steps all Uppercase

     if ( length.instructions >= maxNavSteps ) {
        throw `Woa..Error Too Many InstructionSteps ${instructions} for Robo Move!`;
    } else {
        this.instructions = instructions;
       return `Move instructions ${this.instructions} registered`;
    }

  }

  setNewOrientation ( turnDirection) {
    // Assign New Compass Orientation dependent on passed turnDirection turnDirection e.g L or R. F ( Forward causes no change in direction)
    // Dodgy road map N = North, S = South, E = East, W = West
    // L = Left, R = Right
    // Dodgy assumptions .. excluding 'F' no change 
    /*
      N + L = W, N + R = E
      S + L = W, S + R = E
      E + L = N, E + R = S
      W + L = S, W + R = N
    */
      let currentOrientation = this.orientation;
      let newOrientation;
    
      // Operations from north facing
      if ( currentOrientation == 'N' ) {
  
         if ( turnDirection == 'L') {
             newOrientation = 'W';
         } else if ( turnDirection == 'R') {
             newOrientation = 'E'
         } else {
             newOrientation = currentOrientation;
         }
      }
      // Operations from South facing
      if ( currentOrientation == 'S' ) {
  
          if ( turnDirection == 'L') {
              newOrientation = 'W';
          } else if ( turnDirection == 'R') {
              newOrientation = 'E'
          } else {
              newOrientation = currentOrientation;
          }
       }
  
       // Operations from East facing
       if ( currentOrientation == 'E' ) {
  
          if ( turnDirection == 'L') {
              newOrientation = 'N';
          } else if ( turnDirection == 'R') {
              newOrientation = 'S'
          } else {
              newOrientation = currentOrientation;
          }
       }   
  
          // Operations from West facing
          if ( currentOrientation == 'W' ) {
  
              if ( turnDirection == 'L') {
                  newOrientation = 'S';
              } else if ( turnDirection == 'R') {
                  newOrientation = 'N'
              } else {
                  newOrientation = currentOrientation;
              }
           }   
      
           // Update the current orientation 
           this.orientation = newOrientation;
           console.log(`Orientation is now assigned from original orientation ${currentOrientation} for ${turnDirection} to : ${this.orientation}`);
  
    }
  
   setNewPosition () {
    // move forward one gridpoint in the direction of the current orientation
    // N  (x,y) => ( x, y + 1)
    // S  (x,y) => ( x, y -1 )
    // E  (x,y) => ( x + 1, y )
    // W  (x,y) => ( x - 1, y )

     let currentXpos = this.xpos;
     let currentYpos = this.ypos;
     let newXpos;
     let newYpos;

     if ( this.orientation == 'N') {
        newXpos = parseInt(currentXpos);
        newYpos = parseInt(currentYpos) + 1;
     }
     if ( this.orientation == 'S') {
        newXpos = parseInt(currentXpos);
        newYpos = parseInt(currentYpos) - 1;
     }
     if ( this.orientation == 'E') {
        newXpos = parseInt(currentXpos) + 1;
        newYpos = parseInt(currentYpos);
     }
     if ( this.orientation == 'W') {
        newXpos = parseInt(currentXpos) - 1;
        newYpos = parseInt(currentYpos);
     }
   
    // Check if new target pos is still on MARS
     let x1 = 0;
     let y1 = 0;
     let x2 = worldEndX;
     let y2 = worldEndY;

     //console.log(`In setNewPosition x2 = ${worldEndX} y2 = ${worldEndY}   currentXpos = ${currentXpos}   currentYpos = ${currentYpos}  newXpos = ${newXpos} newYpos = ${newYpos} Orientation is ${this.orientation}`)

     console.log(`Assigned Goto Position ${newXpos} ${newYpos} from orientation ${this.orientation}`);

     if ( CoordIsRoboScented( currentXpos,currentYpos, this.orientation) == true ) {
        console.log(`Invalid Current Coord Though, Found a scent. Cancel Move!`);
        throw `Houston, ${this.name} is stuck. Scent found at  ${this.xpos} ${this.ypos}, ${this.orientation} was aiming for ${newXpos} ${newYpos}.`;
              
     }

    
    if ( isCoordOnMars({x1, y1, x2, y2}, {newXpos, newYpos}) == true ) {
        console.log(`New Position is still on Mars`);
        // need to check though if the jump point is scented. May be unsafe to move from here, could fall off the edge
        if ( CoordIsRoboScented( currentXpos,currentYpos, this.orientation) == true ) {
            console.log(`Invalid Coord Though, Found a scent. Cancel Move!`);
            } else {
                    // reassign coord value robo is moving
                    console.log(`Coordinate is good. Moving out.`);
                    this.xpos = newXpos;
                    this.ypos = newYpos;
            }
 
    } else {
      //console.log(`Oh Dear. Houston seem to have Gone off World. Scenting you goodbyes.`);
      // Record last position before move for fellow robos.
      addRoboScent ( this.xpos, this.ypos, this.orientation );
      // Abort Robot. It is no more
      this.lost = true; // set end of cpu marker for robo
      throw `Oh Dear. Houston, ${this.name} Seems to To Have Gone Off World.Last seen at ${this.xpos} ${this.ypos}, ${this.orientation} aiming for ${newXpos} ${newYpos}. Scent Goodbyes.`;
      
    }

  }

  performRoboNavInstruction () {
    // Change direction or move forward based on current instruction set
    // Create array of turnDirection instructions from instruction string  

   let roboInstructions = [];
   roboInstructions = this.instructions.split("");
   
   //roboInstructions.forEach(turnDirection => console.log(turnDirection));

       // Process Move for each turnDirection 
       roboInstructions.forEach(turnDirection => {
           console.log(`Current Position : ${this.xpos} ${this.ypos} ${this.orientation}`);
           console.log(`Requested turnDirection ${turnDirection}`);
   
           if ( turnDirection == 'L') {
               console.log(`Action : swivel Left`);
               this.setNewOrientation ( turnDirection )
           } else if ( turnDirection == 'R') {
              console.log(`Action : swivel Right`);
           } else if ( turnDirection == 'F') {
               console.log(`Action : Go Forward`);
               // move forward one gridpoint in the direction of the current orientation
               // N  (x,y) => ( x, y + 1)
               // S  (x,y) => ( x, y -1 )
               // E  (x,y) => ( x + 1, y )
               // W  (x,y) => ( x - 1, y )
               this.setNewPosition();

           } else {  
               console.log(`Unknown Navigation Direction ${turnDirection}`);    
           }
       // Set the new orientation N,S,E,W based on instruction turnDirection

       this.setNewOrientation(turnDirection);  

       });

   }

// Output Position and Orientation of Robot
// Robot may not be lost if it stuck, and hasn't leaped from a scented position
// So can't just judge from its last coord, use obituary marker attribute lost.
outputFinalRoboStat = () => {

let outStr = this.xpos + ' ' + this.ypos + ' ' + this.orientation;

if ( this.lost == true ) {
    outStr += ' LOST';
} 

//console.log(`Robo now at : ${outStr}`);
return outStr;

} 

}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Build the robot flock and Do some moves ...
// The input Instructions are nabbed from the DOM.
// This java script was loaded when the 'Start Bot Mission' was initiated on button press
// hopefully some legal data in the right case had been input at that stage. Or due to a lack of error checking
// things may be undefined or worse and won't get off to a good start. 
// Note may not be entirely accurate based on assumptions. But hopefully something happens.
// Note also, the check for whether the bot is within boundaries may also need review.
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Get input values from the DOM
// First get the GRid Boundary coords common to all robots
let xygridcoordsValue = document.getElementById("xygridcoordsID").value;

// Count elements with robot data class "robodatacontent" to determine how many robots are in the mission
let numRobots = document.querySelectorAll(".robodatacontent").length;

if ( numRobots == 0 ) {
throw `We have  a prblem Houston. Can't find any Robots in this mission. Aborting now!`
}

console.log(`${numRobots} Robots have joined this mission`)

// Assign Grid Boundary coords from the DOM input
let gridBoundaryRight = xygridcoordsValue.split(" ");
worldEndX = gridBoundaryRight[0];
worldEndY = gridBoundaryRight[1];

console.log(`Roaming x-y plane grid (0,0) , (${worldEndX},${worldEndY})`);
 
 // Get the data for robots in the mission from all <p> elements in the document with "robodata" class
 // Example Element Format holds robotpositions comma separated from instructions
 // <p id="roboID1" class="robodatacontent">1 1 E,FRRLLFFR</p>

  let roboDataValues = [];
  const roboDataContentValues = document.querySelectorAll(".robodatacontent");
	for (var i = 0; i < roboDataContentValues.length; i++) {
      //console.log('roboDataValues: ', roboDataContentValues[i]);
      console.log(`Robot ${i} [coords,instructions] Raw Inputdata :  ${roboDataContentValues[i].innerText}`);
      // Add Robot Coord and Instruction data to Array
      roboDataValues.push(roboDataContentValues[i].innerText);
	}

 //console.log(roboDataValues);

 // Now Process Each Robot in turn ...
 let missionRobotID = 0;
    roboDataValues.forEach(missionRobotValue => {
    missionRobotID += 1;
 
    try{
        messageText = `** Operating Mission Robot${missionRobotID}: `
        console.log(messageText, missionRobotValue);
        messageText += '<br>';
        document.getElementById('logoutputID').innerHTML += messageText;

            // Separate positions and instructions into separate array elements for every robots data
            let operatingRobotData = missionRobotValue.split(","); //  
            let robocoordsValue = operatingRobotData[0];
            let roboinstructionsValue = operatingRobotData[1];

            console.log(xygridcoordsValue);
            console.log(robocoordsValue);
            console.log(roboinstructionsValue); 

            // Name Tag a bot.. damn scope creep but robots are not anonymous, they have memory and identity.. for a while.

            let roboName = `Robot${missionRobotID}`;

            // Assign input coords for bot as X, Y coord and Compass Direction N,S,E,W from DOM input 
            let roboCoords = [];
            let inputCoord = robocoordsValue;
            roboCoords = inputCoord.split(" ");

            //roboCoords.forEach(step => console.log(step));

            // Assign Step Instructions for bot from DOM input but ensure uppercase
          

            try {

                // Create and move the bot 

                var robo1 = new robo (roboName); 

                robo1.setRoboPos(roboCoords[0], roboCoords[1], roboCoords[2]  );
                console.log(robo1.getRoboPos());
                console.log(robo1.setRoboNavInstruction(roboinstructionsValue));
                console.log(robo1.performRoboNavInstruction());
                //console.log(`End Move sequence for ${robo1.name} Final RestPoint ${robo1.outputFinalRoboStat()}`);
                

            } catch ( error ) {
                messageText = `Oops Something Went Wrong: ${error}`;
                console.log(messageText);
                messageText += '<br>';
                document.getElementById('logoutputID').innerHTML += messageText;
            } finally {
                if ( robo1.outputFinalRoboStat() !== null) {
                    messageText = `Last known Position for ${robo1.name} is ${robo1.outputFinalRoboStat()}`;
                } else { messageText = `Last known position for ${robo1.name} is sadly unknown at this time.`}
                console.log(messageText);
                messageText += '<br>';
                document.getElementById('logoutputID').innerHTML += messageText; 

            }

        } catch ( error ) {
            messageText = `Something bad happened Operating Mission Robot${missionRobotID}: ${error}`;
            messageText = `Oops Something Went Wrong: ${error}`;
            console.log(messageText);
            messageText += '<br>';
            document.getElementById('logoutputID').innerHTML += messageText;
        }     

    }); // End Process Each Robot in turn

    messageText = `We are done here. Refresh for next mission.`
    console.log(messageText);
    messageText += '<br>';
    document.getElementById('logoutputID').innerHTML += messageText; 
