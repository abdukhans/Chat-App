
function authenticate(req,res,next) {

  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.send(401);
  jwt.verify(token,process.env.SECRET_KEY,(err,user)=>{

    if (err) {
      return res.send()
    }


    req.user = user

  })


  
  next();
}

module.exports = authenticate;