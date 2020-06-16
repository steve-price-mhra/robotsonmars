// JS Function for an instantiate a robot test
//This is just the code hoicked out of the main.js robo class definition and wrapped in a function 'robotest' for use in a basic jest test for the class
// the function takes in a name, instantiates a robot from the class and just returns the name as a sanity check
// used in JEST test the test result should match the name input to the function to pass the basic test , 'can I build a robot' from this messy class.
// Example usage robo.test.js with run npm test ..
/* const robotest = require('./robotest');

test('Create a robot with a given name', () => {
  expect(robotest('TestRobot')).toBe('TestRobot');
}); */

function robotest( inputname ) {

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

  //////////////////////////////


    // Create and name a bot from provided input name

       var robo1 = new robo (inputname); 

    // send the name back for this build robot test

    return robo1.name;

}

module.exports = robotest;