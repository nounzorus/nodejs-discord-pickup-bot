# nodejs-discord-pickup-bot

Basic version of a pickup bot for discord

# Installation
please install required libs via "npm install" + package name 
discord.io, node-persist, request and fs

Get application token from https://discordapp.com/developers/applications/me/
and add to var dicordtoken = "";

Default timeout before player gets removed from queue is 7200 seconds

You can make the script running peristent with "npm install forever"

usage: forever [start | stop | stopall | list] [options] SCRIPT [script options]

options:
  start          start SCRIPT as a daemon
  stop           stop the daemon SCRIPT
  stopall        stop all running forever scripts
  list           list all running forever scripts
