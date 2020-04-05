const express = require('express');
const service = express();
const pjson = require('../package.json');
const ServiceRegistry = require('./lib/ServiceRegistry');
const Cart = require('../cart');
let registeredCart = false;
var cart = new Cart();

module.exports = (config) => {
  const log = config.log();
  serviceRegistry = new ServiceRegistry(log);
  // Add a request logging middleware in development mode
  if (service.get('env') === 'development') {
    service.use((req, res, next) => {
      log.debug(`${req.method}: ${req.url}`);
      return next();
    });
  }
  
  if(serviceRegistry.register(pjson.name, pjson.version, 'localhost', '3000')){
    registeredCart = true;
  }

  // GET 
  service.get('/carro/', (req, res, next) => {
    
    if(!registeredCart){
      return res.send('404');
    }
    return res.send(typeof cart !== 'undefined' && 
    Object.keys(cart.cart).length > 0 ? cart : "Cart is empty !");
  });


 // POST 
  service.post('/carro/:codelement/:qty', (req, res, next) => {
    
    if(!registeredCart){
      return res.send('404');
    }
    var descr = null;
    switch (req.params.codelement) {
      case "1":
        descr = "palos";
        break;
      case "2":
        descr = "muelles";
        break;
      case "3":
        descr = "hierros";
        break;
      default:
        return res.send("404");
    }
    cart.addToCart({ cod: req.params.codelement, desc: descr, qty: parseInt(req.params.qty) });
    return res.send(cart);
  });

  // DELETE 
  service.delete('/carro/:codelement/:qty', (req, res, next) => {
    if(!registeredCart){
      return res.send('404');
    }
    cart.removeFromCart(req.params.codelement, parseInt(req.params.qty));
    return res.send(Object.keys(cart.cart).length > 0 ? cart : "Cart is empty !");
  });

  return service;
};
