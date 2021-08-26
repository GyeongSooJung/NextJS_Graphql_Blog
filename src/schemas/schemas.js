const mongoose = require('mongoose');

const {
    PERSON,
    DOG,
    SCHOOL
} = require('../const/consts'); //const에서 스키마에 관련된것 쓰기 위해 불러옴

const { Schema } = mongoose; // 몽구스 스키마 툴

const personSchema = new Schema(PERSON.schema, {collection : 'Person'}); //모델을 만들기위해 collection이름과 스키마를 정의해서 스키마를 만들어준다
const dogSchema = new Schema(DOG.schema, {collection : 'Dog'})
const schoolSchema = new Schema(SCHOOL.schema, {collection : 'School'})

const Person = mongoose.model('Person',personSchema); // 모델을 만드는 곳
const Dog = mongoose.model('Dog',dogSchema);
const School = mongoose.model('Schema',schoolSchema);

const COLLECTIONS = { //나중에 갖다 쓰기위해 콜렉션즈를 export해주기 위한 폼
    "Person" : Person,
    "Dog" : Dog,
    "School" : School
};

exports.COLLECTIONS = COLLECTIONS;