const express = require('express');
const router = express.Router();

const Note = require('../models/Notes');//instancio el modelo
const {isAuthenticated}= require('../helpers/auth');
router.get('/notes/add',isAuthenticated,(req, res)=>{

    res.render('notes/new-note');

});
router.post('/notes/new-note',isAuthenticated,async(req,res)=>{
    const {title, description}=req.body;//obtengo el title y la description ingresados por el usuario
    const errors=[];
    if(!title){
       errors.push({text:'Please Write a Title'});
    }
    if(!description){
        errors.push({text:'Please Write a Description'});
     }
     //verifico si el arreglo errores tiene algo
     if(errors.length>0){
         res.render('notes/new-note',{
             errors,
             title,
             description
         });

     }
     else{
       const newNote= new Note({title,description});
       newNote.user= req.user.id;
       await newNote.save();
       req.flash('success_msg','Note added Successfully');//Variable global definida en el servidor 
       res.redirect('/notes'); 
    }
    
});
router.get('/notes', isAuthenticated,async (req, res) => {
    await Note.find({user:req.user.id}).sort({date:'desc'})
      .then(documentos => {
        const contexto = {
            notes: documentos.map(documento => {
            return {
                id: documento._id,
                title: documento.title,
                description: documento.description
            }
          })
        }
        res.render('notes/all-notes', {
 notes: contexto.notes }) 
      })
  });

router.get('/notes/edit/:id',isAuthenticated,async (req, res)=>{
 const note= await Note.findById(req.params.id);
 id=req.params.id; 
 title= note.title;
 description= note.description;
 res.render('notes/edit-note',{id,title,description});

});
router.put('/notes/edit-note/:id',isAuthenticated,async(req,res)=>{

   const {title,description}=req.body;
   await Note.findByIdAndUpdate(req.params.id,{title,description}); 
   req.flash('success_msg','Note Update Successfully');
   res.redirect('/notes');
});

router.delete('/notes/delete/:id',isAuthenticated,async(req, res)=>{
await Note.findByIdAndDelete(req.params.id);
req.flash('success_msg','Note Deleted Successfully');
res.redirect('/notes');
});


  
    
module.exports= router;