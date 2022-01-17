# A Doodle in Time

A web application for doodlers or anyone who want to create and browse daily doodles.

## Why I built this project
I wanted to build a website where users could browse drawings created on specific days.

## Live Demo
https://a-doodle-in-time.herokuapp.com

## Technologies
- React.js
- Express.js
- Node.js
- Postgresql
- HTML5
- CSS3
- argon2
- multer
- jsonwebtoken
- pg
- Cloudinary API
- Webpack
- Heroku

## Features

1. User can draw on a canvas
2. User can create drawing
3. User can update drawing (only for drawings of the day)
4. User can delete drawings
5. User can change stroke colors
6. User can change stroke thickness
7. User can change stroke opacity
8. User can erase strokes from the canvas
9. User can see timer for current drawing session
10. User can clear canvas
11. user can browse drawings
12. User can add drawings to their favorites
13. User can view own/other peoples' profiles
14. User can see drawings they've participated in in their profile
15. User can see drawings they've favorited in in their profile
16. User can upload profile picture
17. User can access settings to update bio and location

## Preview
![](https://imgur.com/PNCA26G.gif)

## Stretch Features
* User can change password in settings
* User can search for users

## Development

### Getting Started
1. clone the repo
```shell
git clone git@github.com:byu014/a-doodle-in-time.git
```
2. install all dependencies
```shell
npm i
```
3. start postgresql
```shell
sudo service postgresql start
```
4. create a .env file with the following filled out
```
PORT
DEV_SERVER_PORT
TOKEN_SECRET
DATABASE_URL
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```
5. build with webpack
```shell
npm run build
```
6. start the server
```shell
npm start
```
7. open localhost:3001 in browser
