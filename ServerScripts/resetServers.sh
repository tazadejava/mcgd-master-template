#!/bin/bash

#This script will reset a particular server:
# it will delete the TeamPlugin
# it will delete the world and recreate it according to the current level

# WHAT YOU NEED TO DO:

# Edit the lines that start with "ssh" or "scp" to use the correct private key, the right username, and the right IP address.
# Edit the startServerIndex and endServerIndex if you are not using 1-8 servers.
# Make sure the filepaths on the lines with ssh or scp are correct, and if not, fix them to match your particular server's filepaths.

if ! [ -n "$1" ]; then
  echo "SPECIFY: levelNumber"
  exit 1
fi

if [ -n "$2" ]; then
  echo "Will only reset server ${2}!"
  startServerIndex=$2
  endServerIndex=$2
else
  startServerIndex=1
  endServerIndex=8
fi


levelNumber=$1

worldTemplate=../ChallengeWorldTemplates/Level$levelNumber/world

for groupNumber in $( eval echo {$startServerIndex..$endServerIndex} )
do
  echo "Resetting server ${groupNumber}..."
  # connect to the ssh. you need to supply your own private key + ip address, and have the server template under /home/steve/server/
  ssh -i id_rsa steve@mcgd-s$groupNumber.xvm.mit.edu "rm /home/steve/server/plugins/TeamPlugin.jar | rm -r /home/steve/server/world" &
done
wait

echo "Finished resetting the server(s). Now, inserting the new world and updating the level number!"

for groupNumber in $( eval echo {$startServerIndex..$endServerIndex} )
do
  scp -i id_rsa -r $worldTemplate steve@mcgd-s$groupNumber.xvm.mit.edu:/home/steve/server/world &
  ssh -i id_rsa steve@mcgd-s$groupNumber.xvm.mit.edu "sed -i \"/current-level/c\current-level: ${levelNumber}\" /home/steve/server/plugins/TeamChallengeMCGD/config.yml" &
done
wait

echo "DONE! You can start the server now."
