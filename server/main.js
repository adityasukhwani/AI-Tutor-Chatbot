import express from 'express'
import * as path from 'path'
import bodyParser from 'body-parser'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

// load environment variables from .env file
dotenv.config();

// initialize express app
export const app = express()

// parse application/json request bodies
app.use(bodyParser.json())

// serve static files from client folder (js, css, images, etc.)
app.use(express.static(path.join(process.cwd(), 'client')))

// create http post endpoint that accepts user input
global.messages = [
    {
        role: "system",
        content: "You are an AI tutor who wants to teach a particular topic/concept where they would want to ask basic questions to lead the student to learn that concept in a conversational manner. "
    },
    {
        role: "system",
        content: "The particular topic/concept has 5 subtopics which needs to be covered with all the facts being discussed.So the tutor would have to ensure that the student has sufficiently engaged on each of the subtopics via question answering, summarization of ideas and reiteration of the main points."
    },
    {
        role: "system",
        content: "The list holds all the topics and subtopics. Prompt1 holds the conversation with the student regarding a given subtopic and decides between informing about the facts or asking related questions to lead to the concept.Prompt2 checks if the student has engaged sufficiently in the conversation so far in relation to the current topic/subtopic. Once this prompt decides “yes” to the question “has the student engaged sufficiently” then prompt1 goes to the next subtopic. "
    },
    {
        role: "system",
        content: "Here are the topics list : [Intro to ML training, Steps in Training, Data Collection, Preprocessing, Training, Evaluation]"
    },
    {
        role: "system",
        content: "Before asking question about the topics explain in brief about that particular topic then ask question about the topic and let the user answer."
    },
    {
        role: "system",
        content: "Whenever a user answers your question dont ask him another question from same topic just yes or no if users answer is correct say Great and move on to next topic else repeat "
    },
    {
        role: "system",
        content: "Ok now you have everything you need. User will say Hi then you start asking him "
    },
];
app.post('/api/openai', async (req, res) => {
    const { message } = req.body;

    // store user message in global message state
    const userMessage = { role: "user", content: message };

    // add to global messages list
    global.messages.push(userMessage);

    // send a request to the OpenAI API with the user's message
    // using the node-fetch library
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            // notice how we're using process.env here
            // this is using the environment variable from the .env file
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
        },
        // construct the request payload
        // using the entire chat history (global.messages)
        // sending an external request to the OpenAI API
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: global.messages,
            // the maximum number of tokens/words the bot should return
            // in response to a given prompt
            max_tokens: 250,
        }),
    });

    if (!response.ok) {
        // if the request was not successful, parse the error
        const error = await response.json();

        // log the error for debugging purposes
        console.error('OpenAI API Error:', error);

        // return an error response to the client
        return res.json({ status: 'error', data: null });
    }

    // parse the response from OpenAI as json
    const data = await response.json();
    console.log(data)
    // get the bot's answer from the OpenAI API response
    const botAnswer = data['choices'][0]['message']['content'].trim()


    // create the bot message object
    const botMessage = { role: "assistant", content: botAnswer };

    // store bot message in global message state
    global.messages.push(botMessage);

    // send the bot's answer back to the client
    return res.json({ status: 'success', data: botAnswer });
});
// set the port to listen on
// which is either the port specified in the .env
// or 3000 if no port is specified
const PORT = process.env.PORT || 3000;

// start the express server
app.listen(PORT, () => console.log(`Server listening on localhost:${PORT}`));