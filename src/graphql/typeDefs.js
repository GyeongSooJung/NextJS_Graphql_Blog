const { gql } = require('apollo-server');
const { PERSON, SCHOOL } = require('../const/consts');

  let array = [];

  for (var item in PERSON) {
    if( item === "schema") {
      
    }
    else if( item === "CCA" || item === "CUA" ) {
      array.push(item + `: Date`);
    }
    else {
      array.push( item + `: String`);
    }
  }

  for (var item in SCHOOL) {
    if( item === "schema") {
      
    }
    else if( item ==='name' )
    {}
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

  type School {
    _id : ID
    name : String
    division : String
    type : String
  }
  
  type Query {
    modelQuery(Query : String, Collection : String, Data : JSON, Option : JSON ) : [modelQuery]
    schools : [School]
  }
  
`;

exports.typeDefs = typeDefs;