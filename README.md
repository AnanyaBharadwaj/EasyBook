---------------------EASYBOOK------------------------

A simple FULL-STACK BOOKING SYSTEM.  
It lets users view available slots for sports courts and book them in real time, with concurrency protection (no double-booking).

TECH STACK

Backend-
1. Node.js
2. Express
3. MongoDB

Frontend-
1. Next.js(Typescript and TailwindCSS)


TOOLS  
1. MONGODB COMPASS-GUI to view/edit data
2. POSTMAN-check if API is working properly

SETUP INSTRUCTIONS-

1. BACKEND--
   a. Install dependencies- npm install
   b. Create your .env file-
   MONGODB_URI=<your MongoDB Atlas connection string>
   FRONTEND_ORIGIN=http://localhost:3000
   PORT=4000
   c. Run backend-
   npm start- or
   npm run dev(preferable)

2. FRONTEND--
   a. Install dependencies- npm install
   b. Create your .env.local file
   NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
   c. Run frontent
   npm run dev


TEST LOCALLY

1. Open Frontend
2. Login/Register
   Dummy value-username-john@example.com
               password-securepassword
3. Select a slot( Slots are available any day between 9am and 9pm)
4. Book the slot and give required details
5. Logout

API Documentation-https://documenter.getpostman.com/view/48051536/2sB3Hht2zo
