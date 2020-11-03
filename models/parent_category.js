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
  title:{
    type: String,
    required:true
  },
  web_img:{
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

const pcats = module.exports = mongoose.model('pcats', category);
