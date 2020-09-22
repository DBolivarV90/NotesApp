const express = require("express");
const path = require('path');
const exphbs=require('express-handlebars');//Motor de vistas
const methodOverride= require('method-override');//nos va a permitir los metodos put, delete
const session= require('express-session');
const flash=require('connect-flash');//Nos ayuda a enviar notificaion de que los datos se han guardado o actualizado o eliminado.. sirve para enviar mensajes entre multiples vistas
const passport= require('passport');
const handlebars =  require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

//--Initilitations
const app= express();
require('./database');
require('./config/passport');

//--Settings aqui iran todas nuestras configuraciones
app.set('port',process.env.PORT || 3000);
app.set('views',path.join(__dirname,'views'));//Le indico al servidor donde estan mis vistas
app.engine('.hbs',exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'),
    partialsDir:path.join(app.get('views'),'partials'),
    extname:'.hbs',
    handlebars: allowInsecurePrototypeAccess(handlebars)
}));//indico la extension que tendran mis archivos de las vistas y configuro todo lo relacionado con mis vistas

app.set('view engine','.hbs');//le doy uso a la configuracion hecha en el punto anterior

//--Middlewares todas las funciones que seran ejecutadas antes de pasarlas a la rutas
app.use(express.urlencoded({extended: false}));
app.use(methodOverride('_method'));//servira para que el servidor pueda validar y ver si es put o delete
app.use(session({secret: 'mysecretapp',
resave: true,
saveUninitialized:true
}));
app.use(passport.initialize());//iniciando passport para la autenticacion
app.use(passport.session());
app.use(flash());//para enviar mensajes entre vistas
//--Global Variables 
app.use((req,res,next)=>{
res.locals.success_msg=req.flash('success_msg');
res.locals.error_msg= req.flash('error_msg');
res.locals.error= req.flash('error');
res.locals.user = req.user ||null;

next();
});//guarda los mensajes en variables globales

//--Routes

app.use(require('./routes/index'));
app.use(require('./routes/users'));
app.use(require('./routes/notes'));


//--Statics Files
app.use(express.static(path.join(__dirname,'public')));

//--Server initalitation
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});

