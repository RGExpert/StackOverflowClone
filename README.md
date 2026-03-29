# StackOverflow using Spring-Boot

This project is a full-stack application that mimics stackoverflow's forum like structure. It has a layered backend using SpringBoot and MySQL and a frontend made in Angular.

## Features
* **Question/Answers Management**: User can create questions/answers with title, text, tags and images
* **Tagging systems**: each question can have mutiple tags with which they can be filtered
* **Authentification**: implemented using with JWT
* **Authorization**: only the users themself (or an admin) can edit their posts
* **Banning logic**: An admin can ban any user, the banned user will recieve an email telling them this
* **Reputation system**: Users can lose/gain points based on the dislikes/likes they recieve
    * +2.5 pts for question upvotes.
    * +5 pts for answer upvotes.
    * -1.5 pts for question downvotes.
    * -2.5 pts for answer downvotes.
    * -1.5 pts for downvoting another user's answer.

## Tech Stack
* Frontend: Angular
* Backend: Spring Boot (Java)
* Database: MySQL
* Architecture: Layered architecture
  
Diagrams and more information can be found in the three `SD_Assignment*.pdf` files

## Setup 

### Prerequisites
* Docker and Docker Compose
* Java 17
* Node.js & npm 

### Backend
Just need to run docker compose in the main directory
```bash
docker-compose up --build
```
This will also setup the database with some dummy data and users, passwords to users are encrypted so you can't read them directly 

For most of the users the password should be `test`
### Frontend 
In the ui directory run the following
```bash
npm install -g @angular/cli
npm install
ng serve
```
