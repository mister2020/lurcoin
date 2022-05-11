var unirest = require('unirest');



    var length = 3,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }

    
    var req = unirest('POST', 'localhost:7575/coin-search')
      .send("{\n    \"addres\": \"LURx0MuxPNLBU5tQvY0YiS1dGQDSlJUcKJhkujm\",\n    \"solo\": false,\n    \"hash\": \"TESTedf3r\"\n}")
      .end(function (res) { 
        if (res.error) throw new Error(res.error); 
        console.log(res.raw_body);
      });

