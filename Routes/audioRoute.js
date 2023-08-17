const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
// const { upload } = require('../utility/fileUpload');
const multer = require('multer');
const upload = multer();
const fs = require('fs');



// router.post('/downloadaudio', upload.single('video'), (req, res) => {
//     // Now you can access req.file.buffer
//     // console.log(req.file); // Log the uploaded file information
  
//     if (!req.file) {
//       return res.status(400).send('No video file received.');
//     }
  
//     const videoBuffer = req.file.buffer; // Should not be undefined
//     console.log(videoBuffer)
  
//     // Rest of the ffmpeg processing code...
//   });
  router.post('/downloadaudio',upload.single('video'), (req, res) => {
    // console.log(req.file)
    if (!req.file) {
      return res.status(400).send('No video file received.');
    }
  
    const videoBuffer = req.file.buffer;
    fs.writeFileSync('input.mp4', videoBuffer);
    const audioFileName = 'extracted_audio.mp3';
    // console.log(videoBuffer)
    // console.log( videoBuffer.length);

    ffmpeg()
    .inputFormat('mp4') 
      .input(videoBuffer)
      .noVideo()
      .audioCodec('libmp3lame')
      .toFormat('mp3')
      .on('end', () => {
        const audioFile = `${__dirname}/${audioFileName}`;
        res.download(audioFile, audioFileName, (err) => {
          if (err) {
            console.error('Error sending audio file:', err);
          }
        });
      })
      .saveToFile(audioFileName);
  });


module.exports = router;
