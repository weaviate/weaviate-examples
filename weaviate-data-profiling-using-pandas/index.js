const express =  require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser');
const {PythonShell} = require('python-shell')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));
app.engine('html', require('ejs').renderFile);
let initial_path = path.join(__dirname, "views");

// Displaying login page
app.get('/', (req, res) => {
    res.render(path.join(initial_path, "login_page.ejs"),{message:""});
})


app.post('/login', (req, res) => {
    let username = req.body['username'];
    let password = req.body['password'];
    let url = req.body['cluster_url']
    let options = {
        args: [username,password,url]
    }
    console.log(options)
    //running python script to generate report
    PythonShell.run('python_scripts/script.py', options, function (err, results) {
        if (err) {
            res.render(path.join(initial_path, "login_page.ejs"),{message:"Invalid URL , Please enter a valid URL"});
        };
        console.log('results: %j', results);
        if(results[1]=="Invalid creds")
        {
            res.render(path.join(initial_path, "login_page.ejs"),{message:"Invalid username or password"});
        }
        if(results[1]=="Client is Ready!")
        {
            res.render("output.html");
        }
      });
})
app.listen(process.env.PORT || 4000)
