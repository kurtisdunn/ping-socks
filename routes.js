module.exports = function(app){

    app.get('/login', function(req, res){
        res.status(200).json({'test': 'test'}) 
    });

    //other routes..
}