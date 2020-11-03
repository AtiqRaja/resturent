const mongoose = require('mongoose');

const category = mongoose.Schema({
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
  title:{
    type: String,
    required:true
  },
  web_img:{
    type: String,
    default:''
  },
  mob_img:{
    type: String,
    default:''
  },
  bg_img:{
    type: [String],
    default:[]
  },
  status:{
    type:String,
    default:'active'
  }
});

const ccats = module.exports = mongoose.model('ccats', category);
