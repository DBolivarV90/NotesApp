//Se encargara de proteger las rutas para que solo pueda acceder el usuario si esta logueado
const helpers={};
helpers.isAuthenticated=(req,res,next)=>{
    if (req.isAuthenticated()) {
        return next();
        
    }
    req.flash('error_msg','Not Authorized');
    res.redirect('/users/signin');

};
module.exports= helpers;