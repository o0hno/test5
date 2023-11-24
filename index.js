const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const uploadDir = path.join(__dirname, 'uploads');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

app.use(fileUpload());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.get('/gif', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'gif'));
});

app.post('/upload', (req, res) => {
  const gifName = req.body.gifName;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('Ни один файл не был загружен.');
  }

  const gifFile = req.files.gif;
  const fileName = gifName + path.extname(gifFile.name);
  const filePath = path.join(uploadDir, fileName);

  gifFile.mv(filePath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
