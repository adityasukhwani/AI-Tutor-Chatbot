# AI-Tutor-Chatbot

### Overview of the project
An AI tutor that teach a particular topic/concept by asking basic questions to lead the student to learn that concept in a conversational manner. 
This chatbot uses the [chatGPT API](https://platform.openai.com/docs/guides/chat) for chat completetion and question answering.

- **Frontend** (the `client` folder)
  - Written in JavaScript, HTML, and CSS
- **Backend** (the `server` folder)
  - Written in Node.js/JavaScript
  - Uses [Express.js](https://expressjs.com), a minimal backend server framework
  
### Getting Started 
To run this project:
1. Clone the repository onto your local system.
2. Open the `.env` file and put your API KEY here:- `OPENAI_API_KEY="YOUR-API-KEY"`.
3. Run `npm install` to install dependencies.
4. Run `npm run dev` to start the development server. 
   1. This allows you to make changes to the code and see them reflected in your browser immediately without having to restart the server
5. Open `localhost:3000` in your browser to view the project
