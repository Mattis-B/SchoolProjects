/** Environment config
 * DB_HOST = Database host
 * DB_NAME = Database name
 * DB_USER = Postgres username
 * DB_PASS = Postgres user password
 */

chokidar = require('chokidar')

express = require("express")
const app = express();
const {Pool} =  require("pg");

Object.prototype.filter = function(f){
    if(Array.isArray(f)) {oF=f;f = (k,v)=>oF.includes(k);}
    return Object.entries(this).filter(([k,v])=>f(k,v)).reduce((a,d)=>{a[d[0]]=d[1];return a;},{})
}

bodyParser = require('body-parser')
cookieParser = require("cookie-parser")
bcrypt = require("bcrypt")
expressSession = require("express-session")
connectPgSimple = require("connect-pg-simple")

var LogManager = app.locals.LogManager = new (require("./LogManager"))(app);
chokidar.watch("./LogManager/", {
  usePolling: false,
  interval: 1000,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100
  }
}).on("change",(filepath)=>{
  LogManager.Log("Reloading LogManager");
  delete require.cache[require.resolve("./LogManager")];
  LogManager = new (require("LogManager"))(app);
  LogManager.Log("Reloaded LogManager");
});

/*
* Use cors and allow website to access the api
*/
app.use(require('cors')({
  // origin:[
  //   "https://schoolpicturesite.ghosty.dev",
  //   "https://schoolproject.ghosty.dev",
  //   "https://schoolproject.mattisb.dev",
  //   "https://api.schoolproject.ghosty.dev",
  //   "https://api.schoolproject.mattisb.dev"
  // ],
  origin: (origin, callback)=>{
    LogManager.Log("Origin: " + origin);
    callback(undefined, [
      "https://schoolproject.ghosty.dev",
      "https://schoolproject.mattisb.dev"
    ])
  },
  optionsSuccessStatus: 200,
  credentials: true
}))
app.locals.DB = new Pool({
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
});
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use((req,res,next)=>{
  LogManager.Log("Body: "+req.body)
  next()
})
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressSession({
  store: new (connectPgSimple(expressSession))({
    pool: app.locals.DB,
    createTableIfMissing: true
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000,
  domain: "schoolproject.ghosty.dev",secure:true },
  saveUninitialized: false,
  proxy: true,
  secure: true,
}))
app.use(async (req,res,next)=>{
  console.log(req.session)
  if(typeof(req.session.userid) === "number"){
    app.locals.DB.query("select * from users where id = $1", [req.session.userid]).then((users)=>{
      if(users.rows.length === 1){
        req.user = users.rows[0]
      }
      next()
    })
  } else {
    next()
  }
})

 /**
  * @endpoint
  * @param {string} username User's name [3-20 characters]
  * @param {string} password User's password [8-40 characters]
  */
app.post("/signup", async (req,res,next)=>{
  // Validate if data received from client are strings
  if(typeof(req.body.name) !== "string" || typeof(req.body.password) !== "string"){
    return res.send({type:"ERR", err:"NO_CREDS", msg:"Please supply username and password"});
  }
  if(req.body.name.length < 3){
    return res.send({type:"ERR", err:"SHORT_USERNAME", msg:"Nice that you want to claim a very short username, but please choose one with atleast 3 characters"});
  }
  if(req.body.name.length > 20){
    return res.send({type:"ERR", err:"LONG_USERNAME", msg:"Nice that you want a very detailed username, but for reasons please choose one that is 20 characters or less"});
  }
  if(req.body.password.length < 8){
    return res.send({type:"ERR", err:"SHORT_PASSWORD", msg:"Understandable that you want a very easy password, but please decide on one with atleast 8 charaters"});
  }
  if(req.body.password.length > 20){
    return res.send({type:"ERR", err:"LONG_PASSWORD", msg:"Nice keyboard mashing, but for reasons please choose one that is 20 characters or less"});
  }
  app.locals.DB.query("select * from users where username = $1", [req.body.name.toLowerCase()]).then((err,existingUser)=>{
    if(err) return;
    if(existingUser.rows.length > 0){
      res.send({type:"ERR", err:"EXISTING_USER", msg:"User already exists"})
    } else {
      bcrypt.hash(req.body.password, 12).then(password => {
        app.locals.DB.query("insert into users (username, name, password) values ($1,$2,$3) returning *", [req.body.name.toLowerCase(), req.body.name, password], (err,user)=>{
          if(err){
            return LogManager.Log(err)
          }
          LogManager.Log("Signup: \n"+JSON.stringify(user.rows,null,2))
          if(user.rows.length === 1)
          res.send({type:"SIGNUP", user: {
            type: user.rows[0].type,
            username: user.rows[0].username,
            name: user.rows[0].name
          }})
          req.session.userid = user.rows[0].id;
        });
      }).catch(err=>LogManager.Log(err));
    }
  })

})
/**
 * @endpoint
 * @param {string} username User's name [3-20 characters]
 * @param {string} password User's password [8-40 characters]
 */
app.post("/login", async(req,res,next)=>{
  if((typeof req.body.username) !== "string" || (typeof req.body.password) !== "string"){
    return res.send({type:"ERR", err:"NO_CREDS", msg:"Please supply username and password"});
  }
  app.locals.DB.query("select * from users where username = $1", [req.body.username.toLowerCase()], (err,user)=>{
    if(err){
      LogManager.Log(err)
      res.send();
      return;
    }
    if(user.rows.length === 1) bcrypt.compare(req.body.password, user.rows[0].password).then(correct=>{
      if(correct){
        req.session.userid = user.rows[0].id;
        res.send({
          type: "LOGIN",
          user: {
            name: user.rows[0].name,
            type: user.rows[0].type
          }
        })
      } else {
        res.send({
          type: "INVALID_CREDS",
          msg: "Invalid credentials"
        })
      }
    })
    else res.send({
      type: "INVALID_CREDS",
      msg: "Invalid credentials"
    });
  })
})

/*
  Allow users to change their name
  and moderators to modify users
*/
app.post("/user/:id/update", async (req,res)=>{
  if(req.user.id == undefined){
    return res.send("Please log in")
  }
  let usrId = parseInt(req.params.id)
  LogManager.Log(req.user.id === usrId)
  if(req.user.id === usrId || (req.user.type === "dev")){
    app.locals.DB.query("select * from users where id = $1", [usrId]).then(userMatch=>{
      if(userMatch.rows.length !== 1){
        return res.send("User doesn't exist");
      }
      LogManager.Log("UpdateUser: "+JSON.stringify(req.body,null,2))
      let user = userMatch.rows[0];
      if(typeof (req.body.name) === "string"){
        user.name = req.body.name
      }
      if(typeof (req.body.type) === "string" && req.user.type === "dev"){
        user.type = req.body.type
      }
      app.locals.DB.query("update users set name = $2, type = $3 where id = $1 returning *", [user.id, user.name, user.type]).then(updatedUser=>{
        if(updatedUser.rows.length !== 1) return res.send("No match on update ?")
        res.send({
          type: "USER_UPDATED",
          user: {
            id: updatedUser.rows[0].id,
            name: updatedUser.rows[0].name,
            type: updatedUser.rows[0].type
          }
        })
      }).catch(err=>{
        LogManager.Log(err)
        res.send("Err")
      })
    }).catch(err=>{
      LogManager.Log(err)
      res.send("Err")
    })
  } else {
    res.status(403)
  }
})


/*
  Send user information about them
*/
app.get("/user/", (req,res)=>{
  if(req.session.userid != undefined){
    //LogManager.Log("Redirecting "+req.session.user?.name+" to "+"/user/"+req.session.user?.id)
    res.redirect("/user/"+req.session.userid+"/")
  } else {
    res.send({
      err: "NO_AUTH",
      msg: "Not logged in"
    })
  }
})

/*
  Expose information about users
*/
app.get("/user/:id", (req,res)=>{
  LogManager.Log("GetUser: "+JSON.stringify(req.params)+"\n"+JSON.stringify(req.user));
  if(parseInt(req.params.id) >= 0 && req.user?.id !== undefined)
    app.locals.DB.query("select * from users where id = $1", [parseInt(req.params.id)]).then(users=>{

      res.send(users.rows[0] != undefined ? users.rows[0].filter(["name","id","type"]) : {})
    });
  else res.send({});
  //else res.send(req.session.user.filter(["name","id","type"]));
})

/*
  Allow users to logout
*/
app.get("/logout",(req,res)=>{
  req.session.userid = undefined;
  res.send({type:"LOGOUT"})
})

/*
  Handle errors
*/
app.use((err,req,res,next)=>{
  switch(err.type){
    case "entity.parse.failed":
      LogManager.Error("[ERROR - Invalid body]\n"+"\n"+JSON.stringify(err,null,2)+"\n"+err.toString());
      console.error(req)
      res.status(400).send("Invalid body");
      break;
    default:
      LogManager.Error("[ERROR]\n"+JSON.stringify(req)+"\n"+JSON.stringify(err,null,2)+"\n"+err.toString());
      res.send("Error")
      break;
  }
})

app.listen(process.env.PORT)
