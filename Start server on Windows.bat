@echo off
call npm install >nul
call start "" http://localhost:8080/
call npm start

::https://steamcommunity.com/dev/apikey