const mongoose = require('mongoose');

const items = mongoose.Schema({
  created:{
    type : Date,
    default: Date.now,
    required:true
  },
  admin_id:{
    type: String,
    required: true
  }, 
  parent:{
    type: String,
    required:true
  },
  child:{
    type: String,
    default:""
  },
  item:{
    type: String,
    required:true
  },
  desc:{
    type: String,
    default:''
  },
  price:{
    type: Number,
    default:0,
  },
  web_img:{
    type: [String],
    default:[]
  },
  mob_img:{
    type: [String],
    default:[]
  },
  status:{
    type:String,
    default:'active'
  }
});

const menu_items = module.exports = mongoose.model('items', items);
