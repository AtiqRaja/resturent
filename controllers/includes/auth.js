
// Access Control
class auth {
     ensureAuthenticated(req, res, next) {
            console.log('authentication:');

            console.log(req.user);
            if (req.isAuthenticated()) {

                return next();
            } else {
                req.flash('danger', 'Please login');
                res.redirect('/login');
            }
        }

         userAuth(req, res, next) {

            if (req.isAuthenticated()) {
                return next();
            } else {
                req.flash('danger', 'Please login');
                res.redirect('/login');
            }
        }

         adminAuth(req, res, next) {

            if (req.isAuthenticated()) {
                if (req.user.user_type != 'admin') {
                    res.redirect('/dashboard');
                }
                return next();
            } else {
                req.flash('danger', 'Please login');
                res.redirect('/login');
            }
        }

        hotelAuth(req, res, next) {

            if (req.isAuthenticated()) {
                if (req.user.user_type == 'hotel' || req.user.user_type == 'restaurant'){
                    return next();    
                }else{
                    res.redirect('/dashboard');
                }
                
            } else {
                req.flash('danger', 'Please login');
                res.redirect('/login');
            }
        }

}


module.exports = new auth();