const COLLECTIONS = require("../schemas/schemas");
const { GraphQLScalarType } = require('graphql');
const GraphQLJSON = require('graphql-type-json');

//query
const {modelQuery} = require('../schemas/query')
const {COLLECTION_NAME, QUERY} = require('../const/consts');


const dateScalar = new GraphQLScalarType({
  name: "Date",
  description: "Date Type",
  serialize: (value) => {
    const date = new Date(value);
    if(date.toString()==="invalid Date"){ return null; }
    return date;
  }
});

const resolvers = {
  Date: dateScalar,
  JSON: GraphQLJSON,
  Query: {
    
    async modelQuery(_, args) {
      
      const Query = args.Query;
      const Collection = args.Collection;
      const Data = args.Data;
      let Option;
      if( args.Option === undefined) {
        Option = {};
      }
      else if(args.Option === "needResult") {
        const firstFind = await modelQuery(QUERY.Find, COLLECTION_NAME.Company, Data.where, {});
        let firstFindId = [];
        
        for(let i = 0; i < firstFind.length; i ++) {
          firstFindId.push({"_id" : firstFind[i]._id});
        }
        
        const postJob = async function updateResult() { return await modelQuery(QUERY.Find, COLLECTION_NAME.Company, {$or: firstFindId}, {}) };
        
        Option = { "postJob": postJob };
      }
      else {
         Option = args.Option;
      }
      
      let models;
      
      try {
        
        if (Query == "create" || Query == "findone" || Query == "findoneandupdate") {
          models = await modelQuery(Query,Collection,Data,Option);
          models.result = true;
          return [models]; // GraphQL에서 결과값을 배열로 지정해놔서 맞춤 출력
        }
        else if (Query == "find" && models.length == 0) {
          models = await modelQuery(Query,Collection,Data,Option);
          models = {result : false};
          return [models];
        }
        else if (Query == "remove") {
          models = await modelQuery(Query,Collection,Data,Option);
          models.result = true;
          return [models];
        }
        else if (Query == "removeschool") { // 여러개 삭제
          for ( var i = 0; i < Data.length; i ++) {
            await modelQuery(QUERY.Remove,COLLECTION_NAME.School,{_id : Data[i]._id},{});
          }
          models.result = true;
          return [models];
        }
        else {
          models = await modelQuery(Query,Collection,Data,Option);
          models.result = true;
          return models;
        }
      } catch(err) {
        models = {result : false};
        console.error(err);
        return [models];
      }
    },

    schools : () => {
      return modelQuery(QUERY.Find,COLLECTION_NAME.School,{},{});
    }
  },
};

exports.resolvers = resolvers;