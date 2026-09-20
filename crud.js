/**
 * This (crud.js) contains Part 2 of the assignment => Simple CRUD Operations Using HTTP
 */

// Importing necessary Node.js core modules
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

// Defining the path to users.json file to globally use it with ease
const FILE_PATH = path.join(__dirname, 'users.json');

// A function to help read/get the users from the file
function getUsers() {
    // 1. Check if file exists, if not, create an empty array file []
    if (!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH, '[]');
    }

    // 2. Read the content from the file in utf-8 encoding
    const data = fs.readFileSync(FILE_PATH, 'utf-8');

    // 3. Parsing the content into an array of JavaScript Objects and returning it if any
    // if no content found, parse an empty array '[]' to avoid the Syntax error of passing an empty string.
    return JSON.parse(data || '[]'); // returns an array of JavaScript Objects
}

// A function to help write/save the users to the file
function saveUsers(users) {
    // save the updated users as JSON formatted string in the file
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2)); // null for replacer function, 2 for spaces
}

// A function to help extract and validate user ID from the URL string (/user/1 -> 1)
function parseUserId(url) {
    const parts = url.split('/');
    
    // Ensure the path follows the exact pattern: /user/:id (3 parts: "", "user", "id")
    if (parts.length !== 3) {
        return null;
    }

    const idFromUrl = parts[2];
    const userId = Number(idFromUrl);

    if (!idFromUrl || isNaN(userId)) {
        return null; // Returns null if ID is missing or not a valid number
    }
    return userId;
}

// A function to help handle sending the JSON responses cleanly
function sendJSONRes(res, statusCode, data) {
    res.statusCode = statusCode;
    return res.end(JSON.stringify(data));
}

// Create HTTP Server to handle the requests and responses
const server = http.createServer((req, res) => {
    // 1. Obtain the method (GET, POST, etc.) and URL from the request
    const { method, url } = req;

    // 2. Set standard response header to return JSON
    res.setHeader('Content-Type', 'application/json');
    
    // 3. Collect stream req/res body chunks into a string
    let body = "";
    req.on('data', (chunk) => {
        body += chunk.toString();
    });

    // 4. Process the request once the stream ends
    req.on('end', () => {
        // wrapping the whole process into try-catch to handle errors
        try {
            // Safely parse the body to prevent server crash on invalid JSON
            let parsedBody = {};
            if (body) {
                try {
                    parsedBody = JSON.parse(body);
                } catch (parseErr) {
                    return sendJSONRes(res, 400, { message: "Invalid JSON format in request body." });
                }
            }

            // ================================================
            // (1) POST route - Add a new user
            // ================================================            
            if (url === '/user' && method === 'POST') {
                // 1. obtain the coming data from parsedBody
                const { name, age, email } = parsedBody;
                
                // 2. Check if email exists (only email is required)
                if (!email) {
                    return sendJSONRes(res, 400, { message: "Email is a required field." });
                }

                // 3. Fallback for optional fields (defaults if not provided)
                const userName = name || "Anonymous";
                const userAge = age !== undefined ? age : null;

                // 4. obtain the updated users from the file
                const users = getUsers();

                // 5. check if the email already exists in users.json for any user
                const emailExists = users.some((user) => user.email === email);
                if (emailExists) { // send code 400 and end the response
                    return sendJSONRes(res, 400, { message: "Email already exists." });
                }

                // 6. Auto generate new ID for the new added user
                const newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;

                // 7. Create the new user with a new auto generated id
                const newUser = { id: newId, name: userName, age: userAge, email };

                // 8. push the new user into users array then write it to users.json file
                users.push(newUser);
                saveUsers(users);

                // 9. return with end response and success response (201 Created)
                return sendJSONRes(res, 201, { message: "User added successfully." });
            }

            // ================================================
            // (2) PATCH route: Update user by ID (e.g., /user/1)
            // ================================================
            if (url.startsWith('/user/') && method === 'PATCH') {
                // 1. Extract and validate the ID from the URL
                const userId = parseUserId(url);

                // 2. Check if ID from URL is a valid number
                if (userId === null) {
                    return sendJSONRes(res, 400, { message: "Invalid user ID provided in URL." });
                }

                // 3. Obtain the current users array
                const users = getUsers();

                // 4. Find user index matching the ID
                const userIndex = users.findIndex((user) => user.id === userId);
                if (userIndex === -1) {
                    return sendJSONRes(res, 404, { message: "User ID not found." });
                }

                // 5. Extract fields to update from parsedBody
                const { name, age, email } = parsedBody;

                // 6. Check if the provided email is already taken by someone else
                if (email) {
                    const emailExists = users.some((user) => user.email === email);

                    // If the email exists and it's NOT the current user's own email
                    if (emailExists && email !== users[userIndex].email) {
                        return sendJSONRes(res, 400, { message: "Email already exists." });
                    }
                }

                // 7. Update provided fields (leave existing values if not provided)
                if (name !== undefined) users[userIndex].name = name;
                if (age !== undefined) users[userIndex].age = age;
                if (email !== undefined) users[userIndex].email = email;

                // 8. Save updated array back to file
                saveUsers(users);

                // 9. Send success response with dynamic message using parsedBody
                const keys = Object.keys(parsedBody);
                const updatedField = keys.length === 1 ? keys[0] : 'details';

                return sendJSONRes(res, 200, { message: `User ${updatedField} updated successfully.` });
            }

            // ================================================
            // (3) DELETE route
            // ================================================
            if (url.startsWith('/user/') && method === 'DELETE') {
                // 1. Extract and validate the ID from the URL
                const userId = parseUserId(url);

                // 2. Check if ID from URL is a valid number
                if (userId === null) {
                    return sendJSONRes(res, 400, { message: "Invalid user ID provided in URL." });
                }

                // 3. Obtain the current users array
                const users = getUsers();

                // 4. Find user index matching the ID
                const userIndex = users.findIndex((user) => user.id === userId);
                if (userIndex === -1) {
                    return sendJSONRes(res, 404, { message: "User ID not found." });
                }

                // 5. Remove the user from the array using splice
                users.splice(userIndex, 1);

                // 6. Save updated array back to file
                saveUsers(users);

                // 7. Return success response (200 OK)
                return sendJSONRes(res, 200, { message: "User deleted successfully." });
            }

            // ================================================
            // (4) GET route - Get All Users
            // ================================================
            if (url === '/user' && method === 'GET') {
                // 1. get the existing users
                const users = getUsers();
                
                // 2. return with end response and send the users JSON list
                return sendJSONRes(res, 200, users);
            }

            // ================================================
            // (5) GET route: Get single user by ID (e.g., /user/1)
            // ================================================
            if (url.startsWith('/user/') && method === 'GET') {
                // 1. Extract and validate the ID from the URL
                const userId = parseUserId(url);

                // 2. Check if ID from URL is a valid number
                if (userId === null) {
                    return sendJSONRes(res, 400, { message: "Invalid user ID provided in URL." });
                }

                // 3. Obtain the current users array
                const users = getUsers();

                // 4. Find user matching the ID
                const user = users.find((user) => user.id === userId);
                if (!user) {
                    return sendJSONRes(res, 404, { message: "User ID not found." });
                }

                // 5. Return success response with user object (200 OK)
                return sendJSONRes(res, 200, user);
            }
            
            // Fallback: If route matches nothing
            return sendJSONRes(res, 404, { message: "Please enter a valid link / route to handle your request." });

        } catch (err) {
            // Catch invalid JSON inputs or file errors
            return sendJSONRes(res, 500, { message: 'Internal Server Error', error: err.message });
        }
    });
});

// Start Server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});