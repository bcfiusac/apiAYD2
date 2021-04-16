const express = require('express');
const { request, response } = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const app = express();

//configuraciones
app.use(bodyparser.json());
app.use(cors());


//conexión
app.set('port', process.env.PORT || 8080);
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "34.70.53.40",
  user: "root",
  password: "example",
  database:"database_deliveryfood"
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
     

        
      });
      app.listen(3000, () => {
        console.log("MICROSERVICE: Create product running on port 8080");
    });
    
    
    //YA FUNCIONA AL 100%
  app.post("/create-order", (request, response, next) => {
    var { total,clienteid,usuarioid,estadoid } = request.body;
    var sql = `INSERT INTO orden (total, cliente_id, usuario_id, estado_id)
                VALUES (?,?,?,?)`;
    var values = [total,clienteid,usuarioid,estadoid];
    con.query(sql, values, function(err, result){
        if (err){
            console.log(err);
            return response.json({ 'error': "Error al insertar en la tabla ORDEN", "code": err });
            
        }
        return response.json(result); 

  });
  
});
app.post("/fill-order", (request, response, next) => {
  var { idorder, idproducto, cantidad } = request.body;
  var sql = `INSERT INTO orden_producto (cantidad, producto_id, orden_id)
              VALUES (?,?,?)`;
  var values = [cantidad, idproducto,idorder];
  con.query(sql, values, function(err, result){
      if (err){
          console.log(err);
          return response.json({ 'error': "Error al insertar en la tabla ORDEN", "code": err });
          
      }
      return response.json(result); 

});

});
// obtener la lista de ordenes del cliente logueado
app.get('/get-orden-cliente', (request, response, next) =>{
  var id_usuario = request.query['id'];
  console.log("hola a todos, let me introduce myself");
  var sql = 
  `
    SELECT od.fecha_hora, od.total,
    usr.direccion,
    st_od.nombre as nombre_estado
    FROM
    orden od
    INNER JOIN
    usuario usr
    ON od.cliente_id = usr.id
    INNER JOIN
    estado_orden st_od
    ON od.estado_id = st_od.id
    where usr.id = ?;
  `;
  con.query(sql, [id_usuario], (err, result)=>{
    if(err){
      
      return response.json({ 'error': "Error al insertar", "status": 500 });
    }
    return response.json({"datos":result, "status": 200});
  })
})

 
// esto trae la informacion de ordenes, para mostrarlas en el crud de restaurante
app.get('/get-orden-detalle', (request, respose, next) =>{
  var sql = 
  `SELECT od.id,od.fecha_hora, od.total, 
  usr.nombre as nombre_cliente, usr.direccion,
  st_od.id as estado_orden,st_od.nombre as nombre_estado
  FROM
  orden od
  INNER JOIN
  usuario usr
  ON od.cliente_id = usr.id
  INNER JOIN
  estado_orden st_od
  ON od.estado_id = st_od.id;`;

  con.query(sql, (err, result)=>{
    if(err){
      console.log(err);
      return response.json({ 'error': "Error al insertar", "status": 500 });
    }
    return respose.json(result);

  })

});

// obtener los distintos estado de una orden
app.get('/get-estado', (request, response, next) =>{
  var sql = `
  Select * from 
  orden;
  `;

  con.query(sql, (err, result)=>{
    if(err){
      console.error(err);
      return response.json({ 'error': "Error al obtener", "status": 500 });
    }
    return response.json({"datos": result, "status":200});
});



 

});
//actualiza estado de la orden por id
app.put('/update/estado-orden', (request, response, next) =>{

  var id_estado = request.param('id_estado');
  var id_orden = request.param('id_orden');

  //console.log(id_estado, id_orden);

  var sql = `
    UPDATE orden
    set estado_id = ? 
    WHERE id = ?
  `;
  con.query(sql, [id_estado,id_orden], (err, result) =>{
    if (err) {
      return response.json({ 'error': "Error al insertar", "status": 500 });
  };
  return response.json({ 'msg': result, 'status': 200 });

  });

});




