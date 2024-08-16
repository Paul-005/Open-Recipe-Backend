// delte all files in uploads folder

const fs = require('fs');

function deleteFiles() {
    try {
        fs.unlinkSync('/home/user/Open-Recipe-Backend/testtestfolder');
      } catch (error) {
        console.error("Error removing the original file:", error);
      }
}

module.exports = deleteFiles;

