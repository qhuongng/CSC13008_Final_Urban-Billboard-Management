# Urban Billboard Management System

This is a group project assignment from the course **CSC13008 – Web Application Development (21KTPM2)** at VNU-HCM, University of Science. This repository is forked from [hoadang0305's](https://github.com/hoadang0305/Map-Application).

## Project contributors
1. Đặng Nhật Hòa ([hoadang0305](https://github.com/hoadang0305))
2. Nguyễn Quỳnh Hương ([qhuongng](https://github.com/qhuongng))
3. Đỗ Phạm Thanh Huy ([Huy203](https://github.com/Huy203))
4. Nguyễn Lê Thanh Nghĩa ([NghiaLe128](https://github.com/NghiaLe128))

## General information
The system was developed using Handlebars, Express, Node.js and runs on a MongoDB database. The map utilizes Mapbox GL JS API.

The system consists of two portals:
- The **citizen's portal** allows citizens to view available billboard locations on the map, as well as relevant billboard information. They can then choose to send reports or inquiries for said billboards/locations. The reports' handling progress and official response can then be viewed on the map and via the email address the citizens provided in the report form.\
  The portal can be accessed without an account, and reports sent will be stored locally in the browser using LocalStorage.
- The **officer's portal** allows for officers of the Ho Chi Minh City's Department of Culture and Sports, as well as HCMC's districts and wards to manage billboards and billboard locations, view and respond to citizen reports/inquiries, and respond to requests for permission to post advertisements on billboards. Department officers can also create new officer accounts and manage existing accounts.

## Demo
The [citizen's portal](https://citizen-mapapp.vercel.app/) and the [officer's portal](https://officer-mapapp.vercel.app/) are hosted on Vercel. Due to Vercel's restrictions and the way the database service was set up, please visit the officer's portal before visiting the citizen's portal. The citizen's portal can then be accessed independently (without having to keep the officer's portal open).

Below are two accounts to access the officer's portal for demonstration purposes. The password for both accounts is `123`:
- Department officer's account: **autosentmail.map<i></i>@gmail.com**
- District officer's account: **admindistrict<i></i>@gmail.com**

Demo videos for example user flows are also available on [Google Drive](https://drive.google.com/drive/folders/1SpzVwb6Bj5IoxUcu9MwaVFsWVndVrl82?usp=sharing).

## Build & run the system locally
As the two portals are developed on two separate branches, the repository needs to be cloned twice.\
[Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) are required to build and run the system.

1. Clone the repository for local development [here](https://github.com/hoadang0305/Map-Application).
2. On the first clone, check out the branch **newMain**, run `npm i` to install necessary packages, then run `npm start`. The officer's portal should now be available at **http<i></i>://localhost:3500**.
3. On the second clone, check out the branch **citizen**, run `npm i` to install necessary packages, then run `npm start`. The officer's portal should now be available at **http<i></i>://localhost:3200**.

***Note:** Please ensure the officer's portal is up to establish a connection with the database before building and running the citizen's portal.*
