'use strict';

const querystring = require('querystring');
const request     = require('request');
const uuid        = require("uuid");
const protocol    = "https://"
const key         = // YOUR KEY
const secret      = // YOUR SECRET
const mer         = // broker.tembtc.com.br || broker.negociecoins.com.br
const crypto 	    = require('crypto');
const nautilus 	  = {}


nautilus.createOrder = function(type, quantity, price, par) {
    
    var bodyObj = { 
      pair: par,
      type: type,
      price: price,
      volume: quantity
    };

    var formData = querystring.stringify(bodyObj);
    var contentLength = formData.length;

    var Bizarr = nautilus.amx_authorization_header(key, secret, 'user/order', 'POST', formData);
   
    let apiURL = protocol + mer + '/tradeapi/v1/user/order';

    let options = {
        url: apiURL,
        method: "POST",
        headers:
        {
            "Authorization": Bizarr,
            "Content-Length": contentLength,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    };

    console.log(options)

    request(options, 
      (error, response, body) => 
      {
        console.log(error, body)
        if (error)
          console.error('An error has occurred: ', error);
        else
        {
          try
          {
            //console.log(body)
          }
          catch(e)
          {
              console.log(e)
          }
        }
      }
    ) 

}

nautilus.userbalance = function() {

  var Bizarr = nautilus.amx_authorization_header(key, secret, 'user/balance', 'GET', null);
 
  let apiURL = protocol + mer + '/tradeapi/v1/user/balance';
  
  let options = {
      url: apiURL,
      method: "GET",
      headers:
      {
          "Authorization": Bizarr
      }
  };

  console.log(options)

  request(options, (error, response, body) => 
    {
      if (error)
          console.error('An error has occurred: ', error);
      else
      {
        try{
            console.log(body)
        }
        catch(e)
        {
            console.log(e)
        }
      }
    }
  ) 

}


nautilus.md5 = function(string) {
    return crypto.createHash('md5').update(string).digest('base64');
} 


nautilus.getHash = function(string, secret){
    var hmac = crypto.createHmac('sha256', secret);
    hmac.update(string, 'utf8'); 
    return hmac.digest('base64'); 
}



nautilus.amx_authorization_header = function(id, APIKey, endpoint, method, body) {

  var url1 = protocol + mer + '/tradeapi/v1/' + endpoint; 

  var url = encodeURIComponent(url1).toLowerCase(); 
  
  var content = '';

  if(body)
  {
    content = nautilus.md5(body);
  }

  var time = Math.floor(new Date().getTime() / 1000).toString();

  var nonce = uuid.v1().replace(/-/g, '');      

  var signatureRawData = id + method + url + time + nonce + content;

  var key = Buffer.from(APIKey, 'base64');

  var signature = crypto.createHmac('sha256', key).update(signatureRawData, 'utf8').digest('base64');

  var array = new Array();  
  array[0] = id;  
  array[1] = signature; 
  array[2] = nonce;
  array[3] = time;
  
  return 'amx ' + array.join(':'); //retorna a header

}

module.exports = nautilus;

