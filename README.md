# Game of Lights

http://gameoflights-talkdemo.rhcloud.com

[CampJS](http://campjs.com) weekend hack project.

Node.js app for [OpenShift](http://www.openshift.com) that takes a seed pattern for [Conway's Game of Life](http://en.wikipedia.org/wiki/Conway's_Game_of_Life) and displays the result both in the browser and, if available, on a connected [Holiday by MooresCloud](http://moorescloud.com). The Holiday is expected to be arranged in a 7x7 grid, excluding the first light on the string, and snaking downwards starting at the top left.

To get this app running on OpenShift, [sign up for OpenShift Online](https://openshift.redhat.com/app/account/new), [install the RHC command line tools](https://www.openshift.com/developers/rhc-client-tools-install), and run the following commands:

    rhc setup
    rhc app create gameoflights nodejs-0.10 --from-code=https://github.com/codemiller/game-of-lights.git -s

