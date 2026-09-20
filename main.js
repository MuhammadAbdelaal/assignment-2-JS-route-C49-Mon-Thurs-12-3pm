/**
 * This (main.js) contains only Part 1 of the assignment => Node.js Core Modules
 * Part 2 will be in a separate file named "crud.js"
 */


// importing the the necessary node core modules from node.js core modules
const path = require('node:path');
const fs = require('node:fs');
const fsPromises = require('node:fs/promises');
const EventEmitter = require('node:events');
const os = require('node:os');
const zlib = require('node:zlib');
const stream = require('node:stream');


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

// 12. Create an event emitter that listens for a "start" event and logs a welcome message.
const eventEmitter = new EventEmitter(); // create an instance of eventEmitter class

eventEmitter.on('start', () => {
    console.log('Welcome: Start event has been triggered!');
});

console.log("12. Listen for a start event:");
eventEmitter.emit('start');
console.log('====================');

// 13. Emit a custom "login" event with a username parameter.
eventEmitter.on('login', (username) => {
    console.log(`User logged in: ${username}`);
});

console.log("13. Emit a custom login event:");
eventEmitter.emit('login', 'Ahmed'); 
console.log('====================');

// 14. Read a file synchronously and log its contents.
function readFileSync(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        console.log(`The file content: “${content}”`);
    } catch (err) {
        console.log(`Error reading file: ${err.message}`);
    }
}

console.log("14. Read a file synchronously:");
readFileSync("./notes.txt");
console.log('====================');

// 15. Write asynchronously to a file.
async function writeFileAsync(filePath, content) {
    try {
        await fsPromises.writeFile(filePath, content, {flag: 'a'}, 'utf8'); // flag 'a' is for appending content rother than overwriting
        console.log("15. Write asynchronously to a file:");
        console.log(`Successfully wrote to ${filePath}`);
    } catch (err) {
        console.log("15. Write asynchronously to a file:");
        console.log(`Error writing file: ${err.message}`);
    }
    console.log('====================');
}

writeFileAsync("./async.txt", "Async save\n");

// 16. Check if a directory exists.
function checkDirectoryExists(dirPath) {
    return fs.existsSync(dirPath);
}

console.log("16. Check if a directory exists:");
console.log(checkDirectoryExists("./notes.txt"));
console.log('====================');

// 17. Write a function that returns the OS platform and CPU architecture.
function getSystemInfo() {
    return { // return the output in Object form for readability
        Platform: os.platform(),
        Arch: os.arch()
    };
}

console.log("17. Get OS platform and CPU architecture:");
console.log(getSystemInfo());
console.log('====================');

// 18. Use a readable stream to read a file in chunks and log each chunk.
function readFileStream(filePath) {
    // 1. creating the read stream using createReadStream method from fs module
    const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
    // an optional counter just for counting the chunks
    let count = 0;
    // 2. listening to "data" event when emitted
    // it emits every time a chunk is found for read
    readStream.on('data', (chunk) => { 
        console.log("18. Read file in chunks using readable stream:");
        count++;
        console.log(`--- CHUNK ${count} START ---`);
        console.log(chunk); // log the read data to console. or use it here
        console.log(`--- CHUNK ${count} END ---`);
        console.log('====================');

    });


    // 4. the on.error logic goes here
    readStream.on('error', (err) => {
        console.log("18. Read file in chunks using readable stream:");
        console.log(`ReadFileStream (18) error: ${err.message}`);
        console.log('====================');
    });
}

readFileStream("./big.txt");

// 19. Use readable and writable streams to copy content from one file to another.
function copyFileStream(sourcePath, destPath) {
    // 1. create the read and write streams    
    const readStream = fs.createReadStream(sourcePath); // the read stream
    const writeStream = fs.createWriteStream(destPath); // the write stream

    let chunkCount = 0; // Initialize chunk counter
    // Count each chunk as it flows from the read stream
    readStream.on('data', (chunk) => {
        chunkCount++;
    });


    // 2. connect both streams together
    // .pipe() is a built-in Node.js method that connects a Readable stream to a Writable stream
    // it take the writestream as an argument
    readStream.pipe(writeStream); 

    // 3. when the stream is finish. on.finish 
    // the finish/end logic goes here
    writeStream.on('finish', () => {
        console.log("19. Copy file using streams:");
        console.log(`File copied using streams. Total chunks copied: ${chunkCount}`);
        console.log('====================');
    });

    // 4. if error in reading, the error logic goes here
    readStream.on('error', (err) => {
        console.log("19. Copy file using streams:");
        console.log(`Read error copyFileStream(19): ${err.message}`);
    });

    // 5. if error in writing, the error logic goes here
    writeStream.on('error', (err) => {
        console.log("19. Copy file using streams:");
        console.log(`Writing error copyFileStream(19): ${err.message} `);
    })
}

copyFileStream("./source.txt", "./dest.txt");

// 20. Create a pipeline that reads a file, compresses it, and writes it to another file.
function compressFilePipeline(sourcePath, destPath) {
    // 1. create the streams (read, write, and Gzip that compress the file).
    const readStream = fs.createReadStream(sourcePath);
    const gzipStream = zlib.createGzip();
    const writeStream = fs.createWriteStream(destPath);

    // 2. connect the streasm using stream.pipeline() method
    // it is a built in method inside the stream modules
    // that connects read, write, and gzip streams together for compressin a file
    // and writing it to another file
    // it takes the below argumets
    // (1) => readstream
    // (2) => gzipstream
    // (3) => write stream
    // (4) => callback function to handle the pipeline logic with an err param
    stream.pipeline(readStream, gzipStream, writeStream, (err) => {
        console.log("20. Compress file using pipeline:");
        if (err) {
            console.log(`Pipeline failed: ${err.message}`);
        } else {
            console.log(`File compressed successfully to ${destPath}`);
        }
        console.log('====================');
    });
}

compressFilePipeline("./data.txt", "./data.txt.gz");
