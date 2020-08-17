#!/bin/bash

# WHAT YOU NEED TO DO:

# On the line that is sshing, you must revise it to connect to your server with the correct private key.

for groupNumber in {1..8}
do
  echo "Starting server ${groupNumber}..."
  xdotool key ctrl+shift+t
  xdotool type "ssh -i id_rsa steve@mcgd-s${groupNumber}.xvm.mit.edu"
  xdotool key Return
  sleep 4
  xdotool type "cd server && ./start.sh"
  xdotool key Return
  xdotool key ctrl+Page_Up
done

echo "Done!"
