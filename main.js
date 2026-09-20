/**
 * This (main.js) contains only Part 1 of the assignment => Node.js Core Modules
 * Part 2 will be in a separate file named "crud.js"
 */


// importing the the necessary node core modules from node.js core modules
const path = require('node:path');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises');


// 1. Write a function that logs the current file path and directory.
function logFilePathAndDirectory() {
    console.log('File:', __filename); // __filename is a global variable in node.js that contains the absolute path of the current file
    console.log('Dir:', __dirname); // __dirname is a global variable in node.js that contains the absolute path of the directory containing the current file
}
console.log("1. Log the current file path and directory:");
logFilePathAndDirectory(); // prints the current file path and directory
console.log("====================");


// 2. Write a function that takes a file path and returns its file name.
function getFileName(filePath) {
    return path.basename(filePath); // path.basename() extracts the last part of a file path
}
console.log("2. Get the file name from a file path:");
console.log(getFileName(__filename)); // prints the current file name (main.js)
console.log(getFileName('/user/files/report.pdf'));  // prints 'report.pdf'
console.log("====================");

// 3. Write a function that builds a path from an object.
function buildPathFromObject(pathObject) {
    // // using path.format() >>
    const combinedPath = path.format(pathObject); // path.format() builds a path string from an object
    return path.normalize(combinedPath); // path.normalize() to get correct slash direction based on the OS
    
    // using path.join() >>
    // const combinedPath =  path.join(
    //     pathObject.dir,
    //     pathObject.name,
    //     pathObject.ext);
    // return path.normalize(combinedPath);
}
console.log("3. Build a path from an object:");
console.log(buildPathFromObject({ dir: "/folder", name: "app", ext: ".js"})); // prints '/folder/app.js'
console.log('====================');


// 4. Write a function that returns the file extension from a given file path.
function getFileExtension(filePath) {
    return path.extname(filePath); // path.extname() extracts the file extension from a file path
}
console.log("4. Get the file extension from a file path:");
console.log(getFileExtension("/docs/readme.md")); // prints '.md'
console.log('====================');

// 5. Write a function that parses a given path and returns its name and ext.
function parsePath(filePath) {
    const parsedPath = path.parse(filePath); // path.parse() returns the properties of a file path as an object
    // console.log(parsedPath);
    return { name: parsedPath.name, ext: parsedPath.ext }; // return only the name and ext properties
}
console.log("5. Parse a path and return its name and extension:");
console.log(parsePath("/home/app/main.js")); // prints { name: 'main', ext: '.js' }
console.log('====================');

// 6. Write a function that checks whether a given path is absolute.
function isPathAbsolute(filePath) {
    return path.isAbsolute(filePath); // path.isAbsolute() checks if a path is absolute
}
console.log("6. Check if a path is absolute:");
console.log(isPathAbsolute("/home/user/file.txt")); // prints true
console.log(isPathAbsolute("file.txt")); // prints false
console.log('====================');

// 7. Write a function that joins multiple segments
// Input: "src", "components", "App.js"
// Output Example: src/components/App.js
function joinPathSegments(...segments) { 
    return path.join(...segments); // path.join() joins multiple path segments into a single path
}

console.log("7. Join path segments:");
console.log(joinPathSegments("src", "components", "App.js")); // prints 'src/components/App.js'
console.log('====================');

// 8. Write a function that resolves a relative path to an absolute one.
function resolveRelativePath(relativePath) {
    return path.resolve(relativePath); // path.resolve() resolves a relative path to an absolute one
}
console.log("8. Resolve a relative path to an absolute one:");
console.log(resolveRelativePath("./main.js")); // prints the absolute path of the current file (main.js)
console.log('====================');

// 9. Write a function that joins two paths.
function joinTwoPaths(path1, path2) {
    return path.join(path1, path2);
}
console.log("9. Join two paths:");
console.log(joinTwoPaths("/folder1", "folder2/file.txt")); // prints '/folder1/folder2/file.txt'
console.log('====================');

// 10. Write a function that deletes a file asynchronously.
async function deleteFileAsync(filePath) {
    try {
        await fsPromises.unlink(filePath);
        console.log("10. A function that deletes a file asynchronously:");
        console.log(`The file: ${path.basename(filePath)} is successfully deleted.`);
    } catch(err) {
        console.log("10. A function that deletes a file asynchronously:");
        console.log(err.message);
    }
    console.log('====================');
}
    
deleteFileAsync("./abc.txt");
    

// 11. Write a function that creates a folder synchronously.
function createFolderSync (folderPath) {
    // 1. check if the folder already exist
    if (fs.existsSync(folderPath)) {
        // 2. if exists? return, and log, folder already exits
        console.log(`Folder '${folderPath}' already exists.`)
        return;
    }
    // 3. if not, use fs module to create the folder,
    fs.mkdirSync(folderPath);
    // 4. return, folderpath successfully created
    console.log(`Folder '${folderPath}' created successfully.`);
}

console.log("11. Create a folder synchronously:");
createFolderSync('./users');
console.log('====================');

