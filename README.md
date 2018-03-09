# Visualization of the Leading Causes of Death in the United States using d3.js, datamaps.js and node.js

![San Jose State University](https://i.imgur.com/cShW5MA.gif?1)
![..](https://i.imgur.com/QIGOoLy.png?1)

A Data Visualization based assignment developed towards completion of CS 235 - User Interface Design requirements. 

The dataset consiting of the leading causes of death in the United States of America for a period between 1999-2015 was pulled from data.gov.

The data was prepreocessed using custom python scripts and the visualization platoform was built to show relevant information. 

The UI and functionality is simple, the UI consists of the state map of the US, a drop dop menu to select the year to represent the data for and a highlights column which shows relevant information regarding the highest cause of death, state with the highest death toll, etc.,. 

On selecting a particular year and hovering over a particular state, a tooltip displays contextual information about the particular state

On clicking on a each state a summary bar chart showing the no. of deaths due to various causes is displayed in a pop up.


The application was created using node.js, datamaps.js and d3.js
__________________________________________________________________

Steps to Run:

1. Clone the repository

2. Ensure you have node.js installed in the repo, otherwise install nodeJS using npm 

3. Run `node start -s` at the src directory in the extracted files

__________________________________________________________________

Demo:
![](https://github.com/sakethsaxena/leading-causes-of-death-US-app/blob/master/leading_causes_of_death.gif)
