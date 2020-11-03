const mongoose = require('mongoose');

const orders = mongoose.Schema({
  created:{
    type : Date,
    default: Date.now,
    required:true
  },
  table_no:{
    type: String,
    required: true
  }, 
  items:[{
    item : String,
    qty : Number
     }],
  current_state:{
    type:String,
    default:'onTable'
  },
  status:{
    type:String,
    default:'active'
  }
});

const orderz = module.exports = mongoose.model('orders', orders);
