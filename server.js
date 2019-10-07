var http = require("http")
var url = require("url")
var fs = require("fs")
objfile = fs.readFileSync("data.json")
objlist = JSON.parse(objfile)
var Oproduct = fs.readFileSync("product.html")
var HOMEPAGE = fs.readFileSync("overview.html")
var cardfile = fs.readFileSync("card.html")

HOMEPAGE = HOMEPAGE + "";
Oproduct = Oproduct + "";
cardfile = cardfile + "";

function replace(id, product) {
    product = product.replace(/{%PRODUCT NAME%}/g, objlist[id]["productName"])   
    product = product.replace(/{%Description%}/g, objlist[id]["description"])
    product = product.replace(/{%from%}/g, objlist[id]["from"])
    product = product.replace(/{%price%}/g, objlist[id]["price"])
    product = product.replace(/{%id%}/g, id)
    product = product.replace(/{%nutrients%}/g, objlist[id]["nutrients"])
    product = product.replace(/{"%PRODUCTquantity"}/g, objlist[id]["quantity"])
    product = product.replace(/{"%PRODUCT iMAGE"}/g, objlist[id]["image"])
    if (objlist[id]["organic"] == true)
        product = product.replace(/{%Organic%}/g, "Organic")
    else product = product.replace(/{%Organic%}/g, "Inorganic")
    return product
}
var server = http.createServer(function (req, res) {
    var parseurl = url.parse(req.url, true)
    if (req.url == '/' || req.url == "") {
        var cards=""
        for (var i = 0; i < objlist.length; i++){
            card = replace(i, cardfile)
            cards = cards + card
        }
        HOMEPAGE = HOMEPAGE.replace(/{%cardsarea%}/g, cards)
        res.write(HOMEPAGE)
    }
    else if (parseurl["pathname"] == "/product") {
        id = parseurl["query"]["id"]
        console.log(id)
        product=Oproduct
        product = replace(id,product)
        res.write(product)
    }
    else if (req.url == "/api") {
      res.write(objfile)
    } 
    res.end();
})
var port = process.env.PORT||1502
server.listen(port, function () {
    console.log("Server running on ")
})