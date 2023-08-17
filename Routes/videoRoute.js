const express = require('express');
const router = express.Router();
const ffmpeg = require('fluent-ffmpeg');
const { upload } = require('../utility/fileUpload');

ffmpeg.setFfmpegPath('C:/Users/Lenovo/Downloads/ffmpeg-2023-08-14-git-c704901324-essentials_build/bin/ffmpeg.exe');

router.post('/', upload.single('video'), async (req, res) => {
  try {
    const { watermarkText, watermarkPositionX, watermarkPositionY, watermarkImageUrl } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Video file not provided' });
    }

    const videoPath = 'C:/Users/Lenovo/Desktop/appClick/backend/Routes/output.mp4'; // Set the desired output path

    // Perform video editing using fluent-ffmpeg
    ffmpeg()
      .input(req.file.path) // Use the uploaded file path
      .inputFormat('mp4') // Specify the input format
      .complexFilter([
        {
          filter: 'drawtext',
          options: {
            text: watermarkText,
            fontsize: 24,
            fontcolor: 'white',
            x: watermarkPositionX,
            y: watermarkPositionY,
          },
          outputs: 'watermarked', // Use 'watermarked' as the output label
        },
        {
          filter: 'overlay',
          options: {
            x: watermarkPositionX,
            y: watermarkPositionY,
            enable: 'between(t,0,20)', // Enable overlay only for the specified duration
          },
        },
      ])
      .output(videoPath)
      .on('end', () => {
        console.log('Video editing completed');
        // Send the edited video file as a response
        res.download(videoPath);
      })
      .on('error', (err) => {
        console.error('Error editing video:', err);
        res.status(500).json({ error: 'Video editing failed' });
      })
      .run();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//route to download
router.post('/download/editedvideo', upload.single('video'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No video file received.');
  }

  const videoBuffer = req.file.buffer;
  const editedVideoFileName = 'edited_video.mp4';

  // Save the uploaded video buffer to a temporary file
  fs.writeFileSync(editedVideoFileName, videoBuffer);

  // Perform additional video processing using ffmpeg
  const watermarkText = 'Your Watermark Text';
  const watermarkPositionX = 10;
  const watermarkPositionY = 10;

  const finalVideoFileName = 'final_watermarked_video.mp4';

  ffmpeg()
    .inputFormat('mp4')
    .input(editedVideoFileName)
    .complexFilter([
      {
        filter: 'drawtext',
        options: {
          text: watermarkText,
          fontsize: 24,
          fontcolor: 'white',
          x: watermarkPositionX,
          y: watermarkPositionY,
        },
        outputs: 'watermarked',
      },
    ])
    .output(finalVideoFileName)
    .on('end', () => {
      const finalVideoPath = `${__dirname}/${finalVideoFileName}`;
      res.download(finalVideoPath, finalVideoFileName, (err) => {
        if (err) {
          console.error('Error sending edited video:', err);
        }
        // Clean up temporary files
        fs.unlinkSync(editedVideoFileName);
        fs.unlinkSync(finalVideoFileName);
      });
    })
    .on('error', (err) => {
      console.error('Error processing edited video:', err);
      res.status(500).send('Video processing failed.');
    })
    .run();
});


module.exports = router;
