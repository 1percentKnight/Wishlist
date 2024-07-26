@echo off
echo Starting Node.js server...
cd /d D:\Krishnam\Programs\Wishlist\backend
start "" "C:\Program Files\nodejs\node.exe" server.js


echo Starting Angular development server...
cd /d D:\Krishnam\Programs\Wishlist\frontend
start "" ng serve



start "" "http://localhost:4200"
