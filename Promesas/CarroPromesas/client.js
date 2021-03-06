const mgdb = require('mongodb');
const assert = require('assert');

var mongoclient = mgdb.MongoClient;
var url = 'mongodb://localhost:8100/almacen'

var cart = new Array();
var element1 = { cod: 1, desc: 'palos', qty: 3 };
var element2 = { cod: 3, desc: 'muelles', qty: 1 };
var element3 = { cod: 2, desc: 'hierros', qty: 12 };

mongoclient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, db) {
  assert.equal(err, null);
  initialize(db, function () {
    if (err) throw err;
  });
});


var initialize = function (db, callback) {
  // Get the products collection
  var dbase = db.db("mydb");
  var collection = dbase.collection('products');
  // Empty collection
  collection.deleteMany({});
  console.log("\nEl inventario está vacio!\n");
  console.log("Insertando stock inicial...\n");
  // Insert some products
  collection.insertMany([
    { cod: 1, desc: 'palos', stock: 7 }, { cod: 2, desc: 'hierros', stock: 10 }, { cod: 3, desc: 'muelles', stock: 1 }
  ], function (err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log('Iniciado con existo!\n');
    // Fill cart 
    addToCart(element1);
    addToCart(element2);
    addToCart(element3);
    // palos = 3, muelles = 1, hierros = 12
    console.log("Montando el carrito: \n");
    console.log(cart);
    console.log('\nEliminado el elemento 1: \n');
    console.log(element1);
    removeFromCart(element1);
    console.log("\nAhora el carrito tiene:\n");
    console.log(cart);


    for (element in cart) {
      checkStock(dbase, cart[element])
        .then(function () {
         //console.log("OK - Tenemos suficiente stock ");
        })
        .catch(function () {
         // console.error("Insuficiente stock de " + cart[element].desc);
        });
    }
    callback(result);
  });
}

// Add to cart
function addToCart(element) {
  var elementToInsert = clone(element);
  if (cart.length == 0)
    cart.push(elementToInsert);
  else {
    var existInCart = false;
    for (i in cart) {
      if (cart[i].cod == elementToInsert.cod) {
        existInCart = true;
        cart[i].qty = cart[i].qty + elementToInsert.qty;
      }
    }
    if (!existInCart)
      cart.push(elementToInsert);
  }
}

// Remove from cart
function removeFromCart(element) {
  for (i in cart) {
    if (cart[i].cod == element.cod) {
      cart[i].qty = cart[i].qty - element.qty;
    }
    if (cart[i].qty == 0)
      cart.splice(i, 1);
  }
}

const checkStock = (db, element) => {
  return new Promise(function (ok, ko) {
    var collection = db.collection('products');
    collection.findOne({ cod: element.cod }, function (err, result) {
      console.log('¿Tengo suficiente de ' + result.desc + '?');
      if (err) throw err;
      if (result.stock >= element.qty) {
        console.log("OK - Tenemos suficiente stock de " + result.desc);
        ok("OK");
      }
      else
      console.error("Insuficiente stock de " + result.desc);
        ko(Error("Stock Insuficiente"));
    });
  });
}

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}