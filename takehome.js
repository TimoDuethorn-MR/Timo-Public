var express = require('express');
var graphqlHTTP = require('express-graphql');
var { buildSchema } = require('graphql');
var fetch = require("node-fetch");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Tiles {
    data: [Data]
  }

  type Data {
    type: String
    id: Int
    attributes: Attributes
  }

  type Attributes {
    name: String
    url: String
    tileImage: URL
  }

  type URL {
    url: String
  }

  type Query {
    getTiles: Tiles
  }
`);

const URL = "https://shop-directory-heroku.laybuy.com/api/tiles?page%5Bsize%5D=8&page%5Bnumber%5D=1&include=activePromotion&filter%5Border%5D=Offers%20%26%20Deals&filter%5Bcategory_id%5D=1";
const options = {
    method: "GET",
    headers: { "Content-Type": "application/json" }
}

var output;
// var testoutput = {"id":"1","type":"tiles"};

fetch(URL, options)
.then(res => res.json())
.then((data) => {console.log(data),output = data})
.catch(console.error);

// setTimeout(() => console.log(output), 3000);

// The root provides a resolver function for each API endpoint
var root = {
  getTiles: () => {
    return output;
  }
};

var app = express();
app.use('/takehome', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(5000);
console.log('Running a GraphQL API server at localhost:5000/takehome');