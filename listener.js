const app = require('./app.js')
const { PORT = 9090 } = process.env;


app.listen(9090, () => {
    console.log("Server is listening on port 9090...");
  });


  