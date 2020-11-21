const express = require('express');
const router = express.Router();
const expressip = require('express-ip');
var fs = require('fs');
var multer = require('multer');
const moment = require('moment');


var auth = require('./includes/auth');
router.use(expressip().getIpInfoMiddleware);

var User = require('../models/user');
var pcats = require('../models/parent_category');
var ccats = require('../models/child_category');
var items = require('../models/menu_items');
var orders = require('../models/order');

router.get("/:hotel_name/:hotel_id", (req, res) => { 

    hotel_id = req.params.hotel_id;
    Hotel_name = req.params.Hotel_name;

    pcats.find({status:'active'}).then(function (cats) {
        console.log(cats);
        res.render('website/touchView', {
            items:cats
        });
    })
});

router.get("/bot", (req, res) => { 

    pcats.find({status:'active'}).then(function (cats) {
        console.log(cats);
        res.render('website/chatbot', {
            items:cats
        });
    })
    
});

function tableCheck(req, res, next) {

    if (req.cookies['table_no'] =='' || req.cookies['table_no'] ==undefined) {
        console.log('ithy');
        return res.redirect('/getTableNumber');
    }
    else{
        return next();
    }

  }

  router.get('/change_order/:ord_id/:status', function (req, res) {

    orders.findOne({_id:req.params.ord_id}).then(function (_order) {
            if (_order) {

                console.log('oreder',_order);
                let updateItem = {};
                updateItem.current_state = req.params.status;

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);

                    }
                });

            }else{

            }
    });

    res.redirect('/orders');
});  


router.get('/accept_order/:ord_id', function (req, res) {

    table_no = req.cookies['table_no'];

    orders.findOne({_id:req.params.ord_id}).then(function (_order) {
            if (_order) {

                console.log('oreder',_order);
                let updateItem = {};
                updateItem.current_state = 'inKitchen';

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);

                    }
                });

            }else{

            }
    });

    res.redirect('/orders');
});

router.get('/reject_order/:ord_id', function (req, res) {

    table_no = req.cookies['table_no'];

    orders.findOne({_id:req.params.ord_id}).then(function (_order) {
            if (_order) {

                console.log('oreder',_order);
                let updateItem = {};
                updateItem.current_state = 'RejectFromKitchen';
                updateItem.status = 'rejected';

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);

                    }
                });

            }else{

            }
    });

    res.redirect('/orders');
});

router.get('/paid_order/:ord_id', function (req, res) {

    table_no = req.cookies['table_no'];

    orders.findOne({_id:req.params.ord_id}).then(function (_order) {
            if (_order) {

                console.log('oreder',_order);
                let updateItem = {};
                updateItem.status = 'paid';

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);

                    }
                });

            }else{

            }
    });

    res.redirect('/orders');
});



router.get('/sendtoKitchen', function (req, res) {

    table_no = req.cookies['table_no'];

    orders.findOne({table_no:table_no,status:'active',current_state:'onTable'}).then(function (_order) {
            if (_order) {

                console.log('oreder',_order);
                let updateItem = {};
                updateItem.current_state = 'sentToKitchen';

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);

                    }
                });

            }else{

            }
    });

    res.render('website/sent_to_kitchen.ejs');
});


router.get('/orders', function (req, res) {

    orders.find({status:'active'}).sort({ created : "descending"}).then(function (_order) {
        if (_order) {
            console.log(_order);
            items.find({}).then(function (_items) {

                    res.render('admin/orders',{
                        data:_order,
                        items:_items
                    })
            })
            
        }else{

            res.render('admin/orders',{
                data:[],
                items:[]
            })

        }
});            

});


router.get('/getTableNumber', function (req, res) {
    res.render('website/getTableNumber.ejs');
});

router.post('/getTableNumber', function (req, res) {
    
    tableNumber = req.body.table_no;
    res.cookie('table_no', tableNumber).send();
    return res.redirect('/');
    
});

router.get('/cart', function (req, res) {
    console.log('cart');
    table_no = req.cookies['table_no'];
    var searchQuery = orders.findOne({table_no:table_no,current_state:'onTable'}); 

    searchQuery.lean().exec(function (err, _ords) {
        if (err) {
            console.log(err);
          return res.json({
            "message": "Error.",
            "status": 403,
            "data": err
          });
        } else {
            if(_ords){
                var promises = _ords.items.map(function (ord) {
                    return items.find({_id: ord.item}).then(function (results) {
                    console.log(results);
                    ord._details = results[0];
                    return ord;
                    });
                });
                Promise.all(promises).then(function (userPrefs) {
                    if (userPrefs.length) {
                    console.log(userPrefs);
                    res.render('website/cart',{
                        data: userPrefs
                    });
                    } else {
                    return res.render('website/cart',{
                        'success': false,
                        "message": "No Order found.",
                        "status": 404,
                        "data": ''
                    });
                    }
                }).catch(function (err) {
                    return res.json({
                    "message": "Error.",
                    "status": 503,
                    "data": err
                    });
                })
            }else{
                res.render('website/cart',{
                    data: ''
                });
            }
           
    
        }
    });
});

router.get('/ordersInKitchen', function (req, res) {
    
    table_no = req.cookies['table_no'];

    orders.find({table_no:table_no,status:'active'}).sort({ created : "descending"}).then(function (_order) {
        if (_order) {
            console.log(_order);
            items.find({}).then(function (_items) {

                    res.render('website/ordersInKitchen',{
                        data:_order,
                        items:_items
                    })
            })
            
        }else{

            res.render('ordersInKitchen',{
                data:[],
                items:[]
            })

        }
});       

});

router.post('/add_to_cart',tableCheck, function (req, res) {
    
//    res.json({"data":true});
    table_no = req.cookies['table_no'];

    orders.findOne({table_no:table_no,status:'active', current_state:'onTable'}).then(function (_order) {
            if (_order) {

                console.log('orderrryyyy',_order);


                _order.items.forEach((element, index) => {
                    if (element.item == req.body.item) {
                            req.body.qty = parseInt(req.body.qty) + parseInt(element.qty);
                            _order.items.splice(index, 1);
                    }
                });

                var ord = [];
                
                
                _order.items.forEach((e, index) => {
                    ord.push({item:e.item,qty:e.qty});
                });

                ord.push({item:req.body.item,qty:req.body.qty});

                let updateItem = {};
                updateItem.items = ord;

                let query = {};

                query._id = _order._id.toString();

                console.log(updateItem, query);

                orders.updateOne( query,updateItem, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        console.log(result);
                        return res.json({"status":true,"msg":"Order added."});

                    }
                });

            }else{

                    var ord = [];
                 
                    ord.push({item:req.body.item,qty:req.body.qty});
                    console.log(ord);
                    let newOrder = new orders({
                        table_no: table_no,
                        items: ord,
                    });

                    newOrder.save(function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        console.log(result);
                        req.flash('success', 'Menu item added.');
                        return res.redirect('/admin/menu/item/add');
                    });

            }
    });


    
});

router.get('/menu',tableCheck, function (req, res) {

    pcats.find({status:'active'}).then(function (cats) {
        res.render('website/menu.ejs', {
            items:cats
        });
    })
})


router.get('/menu/:id',function (req, res) {
    
    pcats.find({_id:req.params.id},{title:-1}).then(function (parent) {
        
        if (parent.length) {
            
            ccats.find({status:'active',parent_cat:req.params.id}).then(function (cats) {
        
                if (cats.length) {
                    res.render('website/menu.ejs', {
                        items:cats,
                        parent:parent[0].title
                    });
                }else{
                    items.find({parent:req.params.id}).then(function (itemz) {  
                        res.render('website/menu_items.ejs', {
                            items:itemz,
                            parent:parent[0].title
                        });
                    })
                } 
            })


        }else{
            return res.redirect('/menu');
        }


    }).catch(function (err) {
        console.log(err);
        return res.redirect('/menu');
        
    })

    // ccats.find({status:'active',parent_cat:req.params.id}).then(function (cats) {
        
    //     if (cats.length) {
    //         res.render('website/menu.ejs', {
    //             items:cats
    //         });
    //     }else{
    //         items.find({parent:req.params.id}).then(function (itemz) {  
    //             res.render('website/menu_items.ejs', {
    //                 items:itemz
    //             });
    //         })
    //     } 
    // })

})

router.get('/menu/item/:id',function (req, res) {

            items.find({_id:req.params.id}).then(function (itemz) {

                if (itemz.length) {
                    
                    pcats.find({_id:itemz[0].parent}).then(function (parent) {

                        getSimilarProducts(itemz[0].parent).then(function (similar) {
                            
                            res.render('website/single_item.ejs', {
                                item:itemz[0],
                                parent:parent[0],
                                similar:similar
                            });
                            
                        })
                        
                    })
                }else{
                    return res.redirect('/menu');
                }
                
            })

      

})

router.get('/admin/menu/category/all', auth.adminAuth, function (req, res) {
    pcats.find({status:'active'}).then(function (p_cats) {
        res.render('admin/all_cats.ejs', {
            user: req.user
        });  
    })
});

router.get('/admin/menu/items', auth.adminAuth, function (req, res) {

        let query = {};
    
        var searchQuery = items.find(query) 
        searchQuery.lean().exec(function (err, mitems) {
        if (err) {
            console.log(err);
            return;
        }
        else{
            var promises = mitems.map( function(mitem) {      
            return pcats.find({_id:mitem.parent},{title:-1}).then(function(results){    
                console.log(results);
                mitem.p_title = results[0].title;
                return mitem;
                }).then(function() {
                    if (mitem.child != "") {
                        return ccats.find({_id:mitem.child},{title:-1}).then(function(results){    
                            console.log(results);
                            mitem.c_title = results[0].title;
                            return mitem;
                        });    
                    }else{
                        mitem.c_title = '';
                        return mitem;
                    }
                     
                });       
            });
            Promise.all(promises).then(function(results) {
                console.log(results);
                
                res.render('admin/menu_items.ejs', {
                    user: req.user,
                    items:results
                });
        })
        }
    });

});

router.get('/admin/menu/edit/:item', auth.adminAuth, function (req, res) {
    
    items.find({_id:req.params.item}).then(function (itm) {
        console.log(itm);
        
        if (itm.length > 0 ) {

            pcats.find({status:'active'}).then(function (cats) {
                res.render('admin/edit_item.ejs', {
                    user: req.user,
                    cats:cats,
                    itm:itm[0]
                });    
            });

        }else{
            return "Wrong Id or item not available";
        }
    })
    
});

router.get('/admin/menu/item/add', auth.adminAuth, function (req, res) {
    pcats.find({status:'active'}).then(function (cats) {
        res.render('admin/add_item.ejs', {
            user: req.user,
            cats:cats
        });    
    });
});

router.get('/admin/menu/item/delete/:id', auth.adminAuth, function (req, res) {

    items.find({_id:req.params.id}).then(function (itm) {
        if (itm.length > 0) {

            items.remove({_id:req.params.id}, function(err) {
                if (err) {
                    console.log(err);
                    req.flash('danger', 'Error.');
                    return res.redirect('/admin/menu/items');
                }
                req.flash('success', 'Category deleted.');
                return res.redirect('/admin/menu/items');
            });

        }else{
            req.flash('danger', 'Error.');
            return res.redirect('/admin/menu/items');
        }  
    })
});

router.get('/admin/menu/category/add', auth.adminAuth, function (req, res) {
    res.render('admin/add_cat.ejs', {
        user: req.user
    });
});

router.get('/admin/menu/category/add_parent', auth.adminAuth, function (req, res) {
    res.render('admin/add_parent.ejs', {
        user: req.user
    });
});

router.get('/admin/menu/category/edit_parent/:cat', auth.adminAuth, function (req, res) {
    pcats.find({_id:req.params.cat}).then(function (cat) {
        if (cat.length > 0) {
            res.render('admin/edit_parent.ejs', {
                cat:cat[0],
                user: req.user
            });
        }else{

        }
        
    })
});

router.get('/admin/menu/category/del_parent/:cat', auth.adminAuth, function (req, res) {
    pcats.find({_id:req.params.cat}).then(function (cat) {
        if (cat.length > 0) {
            delete_data('pcat',{_id:req.params.cat});

            items.remove({parent:req.params.cat}, function(err) {
                if (err) {
                    console.log(err);
                }
            });

            req.flash('success', 'Category deleted.');
            return res.redirect('/admin/menu/category/parent_cats');

        }else{
            req.flash('danger', 'Error.');
            return res.redirect('/admin/menu/category/parent_cats');
        }  
    })
});

router.get('/menu/category/add_child', auth.adminAuth, function (req, res) {
    pcats.find({status:'active'}).then(function (cats) {
        res.render('admin/add_child.ejs', {
            user: req.user,
            cats:cats
        });    
    });
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname.replace('controllers', '') + 'public/uploads/');
    },
    filename: function (req, file, callback) {
       
        var ext = file.mimetype.split('/')[1];
        callback(null, req.user.username + '-' + Date.now() + '.' + ext);
    }
});

const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

router.post('/admin/menu/item/edit', auth.adminAuth, function (req, res) {

    var upload = multer({ storage: storage, fileFilter: imageFilter }).fields([{name:'web_img'}]);

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            

            if ( req.body.parent_cat === undefined || req.body.parent_cat === '' ) {
                console.log('Parent category is required.');

                req.flash('danger', 'Parent category is required.');
                return res.redirect('/admin/menu/edit/'+req.body.item_id);
            }

            if ( req.body.item === undefined || req.body.item == "" ) {
                console.log('Menu item name is required');
            
                req.flash('danger', 'Menu item is Required.');
                return res.redirect('/admin/menu/edit/'+req.body.item_id);

            }

            if (req.files.web_img == '' && req.body.web_img_old_ == '') {           
                
                console.log('web img is required.');
                
                req.flash('danger', 'Website Image is Required.');
                return res.redirect('/admin/menu/edit/'+req.body.item_id);
                
            }

            let updateItem = {};
            updateItem._id = req.body.item_id;

            let query = {};

            getFileNames(req.files.web_img).then(function (images) {
                
                if (req.body.web_img_old == '') {
                    query.web_img = images;
                }
                else if (req.body.web_img_old !== '' && images != []) {
                    old_web_array = req.body.web_img_old.split(',');
                     query.web_img = old_web_array.concat(images);
                }
                else{
                    query.web_img = req.body.web_img_old.split(',');
                }

                query.item = req.body.item;
                query.price = req.body.price;
                query.desc = req.body.desc;
                query.parent = req.body.parent_cat;

                if (req.body.child_cat) {
                    query.child = req.body.child_cat;                        
                }

                items.updateOne(updateItem, query, function (err, result) {
                    if (err) {
                        console.log(err);
                        return;
                    } else {
                        
                        req.flash('success', 'Item is updated successfully.');
                        res.redirect('/admin/menu/edit/'+req.body.item_id);
                    }
                });            


            })


        }
    });

});

router.post('/admin/menu/item/add', auth.adminAuth, function (req, res) {

    var upload = multer({ storage: storage, fileFilter: imageFilter }).fields([{name:'web_img'}]);

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {

            if ( req.body.parent_cat === undefined || req.body.parent_cat === '' ) {
                console.log('Parent category is required.');

                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                
                
                req.flash('danger', 'Parent category is required.');
                return res.redirect('/admin/menu/item/add');
            }

            if ( req.body.item === undefined || req.body.item == "" ) {
                console.log('Menu item name is required');

                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                
                req.flash('danger', 'Menu item is Required.');
                return res.redirect('/admin/menu/item/add');

            }

            if (!req.files.web_img) {           
                console.log('web img is required.');
                
                req.flash('danger', 'Website Image is Required.');
                return res.redirect('/admin/menu/item/add');
                
            }
                
            getFileNames(req.files.web_img).then(function (webImages) {
               
                    let newItem = new items({
                        item: req.body.item,
                        price: req.body.price,
                        desc: req.body.desc,
                        admin_id: req.user._id,
                        parent:req.body.parent_cat,
                        child:req.body.child_cat,
                        status:req.body.status,
                        web_img: webImages,
                    });

                        newItem.save(function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(result);
                            req.flash('success', 'Menu item added.');
                            return res.redirect('/admin/menu/item/add');
                        });
                    
                    console.log(req.body);
                   
            });        

                 

                
        }
    });

});

router.post('/menu/category/add_child', auth.adminAuth, function (req, res) {

    var upload = multer({ storage: storage, fileFilter: imageFilter }).fields([ {  name: 'web_img'}, {  name: 'mob_img'},, {  name: 'bg_img'}]);

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {

            if ( req.body.parent_cat === undefined || req.body.parent_cat === '' ) {
                console.log('Parent category is required.');

                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                if (req.files.mob_img) {                
                    deteFile(req.files.mob_img[0].filename);
                }
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Parent category is required.');
                return res.redirect('/menu/category/add_child');

            }


            if ( req.body.cat_title === undefined || req.body.cat_title == "" ) {
                console.log('Cat title is not there');

                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                if (req.files.mob_img) {                
                    deteFile(req.files.mob_img[0].filename);
                }
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Category Title is Required.');
                return res.redirect('menu/category/add_child');

            }

            if (!req.files.web_img) {           
                console.log('web img is required.');
                     
                if (req.files.mob_img) {                
                    deteFile(req.files.mob_img[0].filename);
                }
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Website Image is Required.');
                return res.redirect('menu/category/add_child');
                
            }

            if (!req.files.mob_img) {     
                console.log('mob img is required.');
                           
                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }
            }


            getFileNames(req.files.bg_img).then(function (images) {
                
                let newCat = new ccats({
                    title: req.body.cat_title,
                    admin_id: req.user._id,
                    parent:req.body.parent_cat,
                    status:req.body.status,
                    web_img: req.files.web_img[0].filename,
                    mob_img: req.files.mob_img[0].filename,
                    bg_img: images
                }); 
                newCat.save(function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    req.flash('success', 'Category Added.');
                    return res.redirect('/menu/category/add_child');
                });
            })
            
            console.log(req.body);
        }
    });

    
});

router.post('/menu/category/add_parent', auth.adminAuth, function (req, res) {

    console.log(req.body);

    var upload = multer({ storage: storage, fileFilter: imageFilter }).fields([ {  name: 'web_img'}, {  name: 'bg_img'}]);

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {

            if ( req.body.cat_title === undefined || req.body.cat_title == "" ) {
                console.log('Cat title is not there');
                
                if (req.files.mob_img) {                
                    deteFile(req.files.mob_img[0].filename);
                }
                
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Category Title is Required.');
                return res.render('admin/add_parent.ejs', {
                    user: req.user
                });

            }

            if (!req.files.web_img) {           
                console.log('web img is required.');
                     
                if (req.files.mob_img) {                
                    deteFile(req.files.mob_img[0].filename);
                }
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Website Image is Required.');
                return res.render('admin/add_parent.ejs', {
                    user: req.user
                });
                
            }


            getFileNames(req.files.bg_img).then(function (images) {
                
                let newCat = new pcats({
                    title: req.body.cat_title,
                    admin_id: req.user._id,
                    status:req.body.status,
                    web_img: req.files.web_img[0].filename,
                    bg_img: images
                }); 
                newCat.save(function(err, result) {
                    if (err) {
                        console.log('error',err);
                    }
                    console.log('result',result);
                });
            })
            
        }
    });

    req.flash('success', 'Category Added.');
    res.render('admin/add_parent.ejs', {
        user: req.user, 
    });
});

router.post('/menu/category/edit_parent', auth.adminAuth, function (req, res) {

    var parent_id = '';

    var upload = multer({ storage: storage, fileFilter: imageFilter }).fields([ {  name: 'web_img'}, {  name: 'bg_img'}]);

    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
             parent_id = req.body.parent_id;

            if ( req.body.cat_title === undefined || req.body.cat_title == "" ) {
                
                if (req.files.web_img) {                
                    deteFile(req.files.web_img[0].filename);
                }
                
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Category Title is Required.');
                return res.redirect('/admin/menu/category/edit_parent/'+req.params.parent_id);

            }

            if (req.files.web_img == '' && req.body.web_img_old_ == '') {           
                console.log('web img is required.');
                     
                
                if (req.files.bg_img) {
                        req.files.bg_img.forEach(element => {
                            deteFile(element.filename);
                        });                
                }

                req.flash('danger', 'Website Image is Required.');
                return res.redirect('/admin/menu/category/edit_parent/'+req.params.parent_id);
                
            }

            
            getFileNames(req.files.bg_img).then(function (images) {

            let updateCat = {};
            updateCat._id = req.body.parent_id;

            let query = {};

                    query.title = req.body.cat_title;
                    query.status = req.body.status;

                    console.log(req.body.web_img_old_);

                    if (req.body.web_img_old_ == '') {
                        query.web_img = req.files.web_img[0].filename;                        
                    }


                    if (req.body.bg_img_old == '') {
                        query.bg_img = images;
                    }
                    else if (req.body.bg_img_old !== '' && images != []) {
                        old_bg_array = req.body.bg_img_old.split(',');
                         query.bg_img = old_bg_array.concat(images);
                    }
                    else{
                        query.bg_img = req.body.bg_img_old.split(',');
                    }

                    console.log('To be updated',query);

                    pcats.updateOne(updateCat, query, function (err, result) {
                        if (err) {
                            console.log(err);
                            return;
                        } else {
                            console.log(result);
                            
                            req.flash('success', 'Category is updated successfully.');
                            res.redirect('/admin/menu/category/edit_parent/'+parent_id);
                        }
                    });
            });
            
            console.log(req.body);
        
        }
    });

});

router.get('/admin/menu/category/parent_cats', auth.adminAuth, function (req, res) {
    pcats.find({}).then(function (cats) {
        res.render('admin/parent_cats.ejs', {
            user: req.user,
            cats:cats
        });    
    });
});

router.get('/admin/menu/category/child_cats', auth.adminAuth, function (req, res) {

    let query = {};
  
    if (req.params.status != 'all') {
      query.status = req.params.status; 
  
    }
    var searchQuery = ccats.find({}) 
    searchQuery.lean().exec(function (err, c_cats) {
      if (err) {
        console.log(err);
        return;
      }
      else{
        var promises = c_cats.map( function(c_cat) {
            
            if (c_cat.length) {
                return pcats.find({_id:c_cat.parent},{title:-1}).then(function(results){  
                    console.log('length-',results);
                      
                        if (results.length) {
                            c_cat.p_title = results[0].title;    
                        }else{
                            c_cat.p_title = '';
                        }            
                    return c_cat;
                });
            }else{
                return c_cat;
            }      
                  
        });
        Promise.all(promises).then(function(results) {
            
            res.render('admin/child_cats.ejs', {
                user: req.user,
                cats:results
            });
      })
      }

    // ccats.find({status:'active'}).then(function (cats) {
    //     res.render('admin/child_cats.ejs', {
    //         user: req.user,
    //         cats:cats
    //     });    
    // });
});
});

router.post('/admin/ads/ad_links', auth.adminAuth, function (req, res) {

    var admin_id = req.user._id;
    var links = req.body.links.split(",");
    var link_type = req.body.link_type;
    console.log(links);

        links.forEach(link => {
            let newLink = new adlinks({
                ad_type: link_type,
                admin_id: admin_id,
                ad_link:link
            });
            newLink.save(function(err, result) {});
        });

            req.flash('success', 'Ads are added.');
            res.redirect('/admin/ads/ad_links');
        
});

router.post('/admin/menu/get_childs', auth.adminAuth, function (req, res) {

    var parent = req.body.parent;

        ccats.find({parent:parent},{title:-1}).then(function(results){    
            console.log(results);
            
            if (results.length < 1) {
               return res.send({
                    childs:""
                })    
            }
           return res.send({
                childs:results
            })
        }).catch(function (err) {
            console.log(err);
            
           return res.send( {
                childs:""
            })    
        })     

        
});

router.get('/admin/menu/status/:tab/:status/:id', auth.adminAuth, function (req, res){

    var tab = req.params.tab;    
    
            if (tab == 'pcat') {

                    status_change(tab,{_id:req.params.id},req.params.status);
                    req.flash('danger', 'Category status updated.');
                    res.redirect('/admin/menu/category/parent_cats');
            
                }else if(tab == 'ccat'){
                    
                    status_change(tab,{_id:req.params.id},req.params.status);
                    req.flash('danger', 'Category status updated.');
                    res.redirect('/admin/menu/category/child_cats');
            
                }else if(tab == 'item'){
                    
                    status_change(tab,{_id:req.params.id},req.params.status);
                    req.flash('danger', 'Item status updated.');
                    res.redirect('/admin/menu/items');
            
                }else{
                res.redirect('/dashboard');
            }

})

router.get('/admin/menu/reports', auth.adminAuth, function(req, res) {

    res.render('admin/report', {
        user: req.user,
        data:[]
    });

});

router.post('/admin/settings/reports', auth.adminAuth, function(req, res) {

    str = req.body.daterange.replace(/\s/g, '');

    var dates = str.split('-');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth());
    todate = moment(today).format();
    console.log('====================================');
    console.log(todate);
    console.log('====================================');    
    let fdate, tdate, pfdate, ptdate = '';
  

      fdate = Date.parse(dates[0]).toString();
      pfdate = new Date(dates[0]);

         tdate = Date.parse(dates[1]).toString();
         ptdate = new Date(dates[1]);
    

    console.log('Dates are ', pfdate, ptdate);
    

                                                        
    orders.aggregate([{
      $match: { $and: [{ current_state: 'served',  created:  {$gte:pfdate  ,  $lte:ptdate} }] },
              }]).then(function (totalData) {

                items.find({}).then(function (_items) {

                    res.render('admin/report', {
                        user: req.user,
                        data: totalData,
                        items:_items,
                        moment:moment
                    });

                })


               })

});


router.post('/get_items',function (req,res) {

    p_id = req.body.parent;
    console.log(req.body);
    items.find({parent:p_id}).then(function (itemz) {  
        
        res.send({items:itemz})
    })

})



function getSimilarProducts(parent) {
    var arr = [];
    return new Promise((resolve, reject) => {

        items.find({parent:parent}).limit(3).then(function (similar) {
            
                resolve(similar)

            }).catch(function (err) {
            console.log(err);
            resolve([]);
            
        })
        
    })

}

function deteFile(file) {
    return new Promise((resolve, reject) => {    
        var dest =  __dirname.replace('controllers', '') + 'public/uploads/';
        dest = dest+file;
    
        fs.unlink(dest,function(err){
            if(err) return console.log(err);
            console.log('file deleted successfully');      
       });
       resolve();
    })
}

function getFileNames(files) {
    var arr = [];
    return new Promise((resolve, reject) => {
        if (!files) {
            return resolve([]);
        }
        files.forEach((file, key) => {
            arr.push(file.filename);
            if (files.length -1 == key) {
                resolve(arr);                
            }
        });
    })

}

function delete_data(tab, data) {
    return new Promise((resolve, reject) => {

        if (tab == 'pcat') {
            pcats.remove(data, function(err) {
                if (err) {
                    console.log(err);
                    resolve('');
                }
                resolve('');
            });
        }
        
    });
}

function status_change(tab, data, status) {
    return new Promise((resolve, reject) => {

        if (tab == 'pcat') {

            pcats.updateOne(data, {status:status}, function (err, result) {
                if (err) {
                    console.log(err);
                    resolve('');
                } else {
                    console.log(result);
                    resolve('');

                }
            });
        }
        
        if (tab == 'ccat') {

            ccats.updateOne(data, {status:status}, function (err, result) {
                if (err) {
                    console.log(err);
                    resolve('');
                } else {
                    console.log(result);
                    resolve('');

                }
            });
        }

        if (tab == 'item') {

            items.updateOne(data, {status:status}, function (err, result) {
                if (err) {
                    console.log(err);
                    resolve('');
                } else {
                    console.log(result);
                    resolve('');

                }
            });
        }
    });
}

module.exports = router;





