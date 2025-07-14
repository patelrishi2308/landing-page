const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate-meme', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required.' });
  }
  try {
    console.log('Making API call with key:', process.env.OPENAI_API_KEY ? 'Present (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'Missing');
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: `Create a funny meme image: ${description}. Style: internet meme, humorous, viral, relatable, clean design, high quality, digital art`,
        n: 1,
        size: '512x512',
        model: 'dall-e-2'
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const imageUrl = response.data.data[0].url;
    res.json({ imageUrl });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate meme.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('API Key loaded:', process.env.OPENAI_API_KEY ? 'Yes (length: ' + process.env.OPENAI_API_KEY.length + ')' : 'No');
}); 