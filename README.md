#  Problem: Martian Robots



Unpolished code fragment to create and move robots in a wierd rectangular version of mars.
Moves within an input defined boundary from a start position and orientation in accordance with
an input direction instruction text. 

## Run Index.html in a browser ( e.g. chrome ) 


***Warning : May not perform to spec - Not completed***


![Screenshot Image](https://github.com/spriceware/robotsonmars/blob/master/roboOrienteeringScreenshot.PNG?raw=true)


### Programming Language HTML5/CSS/JavaScript

- [x] Created Single HTML Index Page
- [x] Created Associated JavaScript File
- [x] Created This README
- [ ] *Testing / Error Handling Incomplete* 

Dependencies 
- (1) - DOM from parent browser index.html file into which this script is loaded, same relative path.
- (2) - non-robot typing in some input values to the index.html file when this is run.
- (3) - put together using Visual Code and Live Server extension.

Note : Error handling needs a revisit and some assumptions may not be valid. 
Console.log is used for debug trace in addition to writing back 
to the DOM in the calling index page to display final outcome.


## This is a draft deployment to investigate the following problem theme..


### The Problem
The surface of Mars can be modelled by a rectangular grid around which robots are able to
move according to instructions provided from Earth. You are to write a program that
determines each sequence of robot positions and reports the final position of the robot.
A robot position consists of a grid coordinate (a pair of integers: x-coordinate followed by
y-coordinate) and an orientation (N, S, E, W for north, south, east, and west).
A robot instruction is a string of the letters “L”, “R”, and “F” which represent, respectively, the
instructions:
● Left : the robot turns left 90 degrees and remains on the current grid point.
● Right : the robot turns right 90 degrees and remains on the current grid point.
● Forward : the robot moves forward one grid point in the direction of the current
orientation and maintains the same orientation.
The direction North corresponds to the direction from grid point (x, y) to grid point (x, y+1).
Developer Programming Problem
Red Badger Consulting Limited
Page 1 of 3
There is also a possibility that additional command types may be required in the future and
provision should be made for this.
Since the grid is rectangular and bounded (…yes Mars is a strange planet), a robot that
moves “off” an edge of the grid is lost forever. However, lost robots leave a robot “scent” that
prohibits future robots from dropping off the world at the same grid point. The scent is left at
the last grid position the robot occupied before disappearing over the edge. An instruction to
move “off” the world from a grid point from which a robot has been previously lost is simply
ignored by the current robot.
The Input
The first line of input is the upper-right coordinates of the rectangular world, the lower-left
coordinates are assumed to be 0, 0.
The remaining input consists of a sequence of robot positions and instructions (two lines per
robot). A position consists of two integers specifying the initial coordinates of the robot and
an orientation (N, S, E, W), all separated by whitespace on one line. A robot instruction is a
string of the letters “L”, “R”, and “F” on one line.
Each robot is processed sequentially, i.e., finishes executing the robot instructions before the
next robot begins execution.
The maximum value for any coordinate is 50.
All instruction strings will be less than 100 characters in length.
The Output
For each robot position/instruction in the input, the output should indicate the final grid
position and orientation of the robot. If a robot falls off the edge of the grid the word “LOST”
should be printed after the position and orientation.

---
### Sample Input
5 3

1 1 E

RFRFRFRF

3 2 N

FRRFLLFFRRFLL

0 3 W
LLFFFLFLFL

### Sample Output
1 1 E

3 3 N LOST

### Added robotest draft jest test