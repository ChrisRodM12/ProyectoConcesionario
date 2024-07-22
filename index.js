const express = require('express');
const bodyParser = require('body-parser');
const routers = require('./routes')
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(express.json());

routers(app);

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});