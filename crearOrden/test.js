const { describe, it } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
chai.use(chaiHttp);

const url = 'http://localhost:3000';


//Test Exitosos

describe('Prueba para obtener informacion de los estados de una orden: ',()=>{
    it('Debe poder obtener los estado de las ordenes', async ()=>{
        let res = await chai
        .request(url)
        .get('/get-estado'); //obteniendo todos los pedidos con datos válidos
        expect(res.status).to.equal(200);
        console.log('Código de salida: ' + res.status)
    }).timeout(15000);
});


//TEST Fallidos

describe('Prueba para obtener ordenes de un cliente invalido',()=>{
    it('Debe poder obtener las ordenes', async ()=>{
        let res = await chai
        .request(url)
        .get('/get-orden-cliente/?id=1'); //obteniendo todos los pedidos con datos válidos
        expect(res.status).to.equal(200);
        console.log('Código de salida: ' + res.status)
    }).timeout(15000);
});