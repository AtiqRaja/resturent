const express = require('express');
var mongoose = require('mongoose');

var Table = require('../models/tables');

const router = express.Router();
var auth = require('./includes/auth');
var bcrypt = require('bcryptjs');
const moment = require('moment');

var User = require('../models/user');
var QRCode = require('qrcode');


// Tables --------------------------------------------------------------------------------


router.get('/get_all_tables', auth.adminAuth , function (req, res) {

    Table.find({hotel_id : req.user._id}).then(function (_tables) {

        console.log(_tables);

        res.send({
            "meta": {
                "page": 1,
                "pages": 1,
                "perpage": -1,
                "total": _tables.length,
                "sort": "asc",
                "field": "_id"
            },
            "data":_tables
        });        
    })
  
  });

router.get('/addTable', auth.adminAuth, function (req, res) {
   
        res.render('admin/add_table.ejs', {
            page_title: 'Tables',
        });        
    
});

//show Tables

router.get('/allTable',auth.adminAuth, function (req, res) {
    console.log('hi');

    Table.find({hotel_id : req.user._id},(err , docs) => {

                res.render('admin/all_tables.ejs', {
                    tables: docs,
                });              
              });  
});

//Add Table
router.post('/addTable', auth.adminAuth, function (req, res) {
    insertTable(req , res);
});
//Insert Table
function insertTable(req, res) {

    TableId(function (table_id) {
    var table = new Table();
    table.table_name = req.body.table_name;
    table.chairs = req.body.chairs;
    table.area_name = req.body.area_name;
    table.hotel_id = req.user._id;
    table.table_id = table_id;

    //res.send(table);

    table.save((err, doc) => {
        if (err) {
            req.flash('danger', err);
            res.redirect('/tables/addTable');
        }
        else {
            req.flash('success', 'Table added successfully.');
            res.redirect('/tables/allTable');

        }
    });
});
}

//edit Table
router.get('/editTable/:id', (req, res, next) => {
    //res.send(req.params);
    Table.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true }, (err, docs) => {
        tableId = docs.table_id;
        var link = 'http://159.8.105.84:8085/' + req.user.username + '/' + tableId;
        //res.send(link);

        QRCode.toDataURL(link, { errorCorrectionLevel: 'H' }, function (err, url) {
            //console.log(url)
            res.render('admin/edit_table.ejs', {
                table: docs,
                qr: url,
                link : link
            });

        });

    });

});

//Update Table
router.post('/updateTable/:id', (req, res, next) => {
    
    Table.findByIdAndUpdate({_id: req.params.id},req.body, (err)=>{
        if (err) {
            console.log(err);
            next(err);
            req.flash('danger', err);
        } else {
            req.flash('success', 'Table Updated successfully.');
            res.redirect('/tables/allTable');
        }
    })
});

//delete Table
router.get('/deleteTable/:id',(req, res)=>{
    Table.findByIdAndDelete({_id:req.params.id}, err=>{
        if(err){
            console.log(err);
        }else{
            req.flash('success', 'Table Deleted successfully.');
            res.redirect('/admin/hotel/allTable');
        }
    });
});




//------------------------------------------------------------------------------

/* Generate Table ID For New Table */
// Generate Table ID
function generateTableId(callback) {
    var tableid = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    for (var i = 0; i < 6; i++)
        tableid += possible.charAt(Math.floor(Math.random() * possible.length));

    return callback(tableid);
}

// Check Table ID Exist
function TableId(callback) {

    generateTableId(function(table_id) {
        Table.findOne({ table_id: table_id }, function(err, _table) {
            console.log(table_id);
            if (!_table) {
                return callback(table_id);
            } else if (_table) {
                return TableId();
            }
        });
    });
}
/* End Generate Table ID For New Table */


router.get('/qr/table/:hotel_id/:table_id',(req, res)=>{

    hotel_id = req.params.hotel_id;

    User.findOne({hotel_id:hotel_id}).then(function (_hotel) {
        if (_hotel) {
            pcats.find({admin_id:_hotel._id}).then(function (_menu) {

                res.send(_menu);

        
            })            
        }
    })


});

router.get('/test', auth.hotelAuth , function(req , res)
{
    getTotalStuff(req.user.username).then(function(result)
    {
        //res.send(result);
        // res.render('admin/hotel_dashboard.ejs' , {
        //     result : result
        // })
    });
})

function getTotalStuff(username)
{
    arr = {};
    let total = 0;
    return new Promise((resolve, reject) => {
        Order.countDocuments({ status: 'paid' , hotel_id : username }).then(function (orders, err) {
  
            arr.completed_orders = orders;
            arr.unoccupied_tables = orders;

        }).then(function () {
            Order.countDocuments({ status: 'active' , hotel_id : username }).then(function (orders, err) {
  
                arr.active_orders = orders;
                arr.occupied_tables = orders;
            })
            .then(function()
            {
                resolve(arr);
            })
        })
    })
            
}




module.exports = router;