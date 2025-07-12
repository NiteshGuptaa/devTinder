const userAuth = (req, res, next) =>{
    console.log("User auth. is getting checked!!");
    const tokan = "xyz";
    const isAdminAuthorized = tokan === "xyz";
    if(!isAdminAuthorized){
        res.status(401).send("Unauthorized User!")
    }
    else{
        next();
    }
}

module.exports = {
    userAuth
}