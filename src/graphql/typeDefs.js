const { gql } = require('apollo-server');
const { COMPANY } = require('../const/consts');

  let array = [];

  for (var item in COMPANY) {
    if( item === "schema") {
      
    }
    else if( item === "CCA" || item === "CUA" ) {
      array.push(item + `: Date`);
    }
    else {
      array.push( item + `: String`);
    }
  }
  
  

const typeDefs = gql`
  scalar Date
  scalar JSON

  type modelQuery {
  
    _id: ID
    
    ${array.map((i) => {
      return i;
    } )}
    
    result: Boolean
  }
  
  type Query {
    modelQuery(Query : String, Collection : String, Data : JSON, Option : JSON ) : [modelQuery]
  }
  
`;

exports.typeDefs = typeDefs;