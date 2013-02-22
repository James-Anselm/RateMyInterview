'use strict'

function RatingsListCtrl($scope, $location){
  var companyInfoObject = Parse.Object.extend("companyInfoObject");

  //check that a user is logged in. Otherwise send them to the login page
    var currentUser = Parse.User.current();
    if (currentUser) {
      // do stuff with the user
      $scope.username = currentUser.get("username");
    } else {
      // show the signup or login page
      $location.path('/login');
    }

/* referenced https://github.com/adelevie/ParseAngularJS/blob/master/todo.js*/
  function getRatings() {
    var query = new Parse.Query(companyInfoObject);
    query.find({
      success: function(results) {
        $scope.$apply(function() {
          $scope.companies = results.map(function(obj) {
            return {name: obj.get("name"), rating: obj.get("rating"), parseObject: obj};
          });
        });
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
 
  getRatings();

  function getIndex(companyName) {
    for(var i = 0; i < $scope.companies.length; i++) {
      if($scope.companies[i].name == companyName)
        return i;
    }
    return -1;
  }

  $scope.addCompany = function(newCompany) {
   var x = new companyInfoObject();
   x.save( { name: newCompany.name, 
              rating: Number(newCompany.rating),
              numRatings: 1 
           }, 
           { success: function(addedCompany) {
                $scope.$apply(function() {
                  $scope.companies.push({name: addedCompany.get("name"), rating: addedCompany.get("rating"), parseObject: addedCompany});
                });
              }
           }
         );
  }

  $scope.updateCompany = function(company, newRating) {
    var companyEntry = $.grep($scope.companies, function(e){ return company.name == e.name});
    var parseObject = companyEntry[0].parseObject;
    parseObject.set("rating", (parseObject.get("rating")*parseObject.get("numRatings") + Number(newRating))/(1 + parseObject.get("numRatings")));
    parseObject.set("numRatings", parseObject.get("numRatings")+1);
    parseObject.save(null,
      { success: function(updatedCompany) {
          $scope.$apply(function(){
            var index = getIndex(updatedCompany.get("name"));
            $scope.companies[index].rating = updatedCompany.get("rating");
            $scope.companies[index].parseObject = updatedCompany; 
            //$scope.companies.push({name: updatedCompany.get("name"), rating: updatedCompany.get("rating"), parseObject: updatedCompany});
          });
        }
      }
    );
  }

  $scope.logOutUser = function() {
    Parse.User.logOut();
    $location.path('/login');
  }

}

function LoginCtrl($scope, $location) {

  $scope.registerUser = function(registerCredentials){
    var user = new Parse.User();
    user.set("username", registerCredentials.username);
    user.set("password", registerCredentials.password);
 
    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
        $scope.$apply(function(){
          $location.path('/ratings');
        });
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    }); 
  }

  $scope.loginUser = function(loginCredentials) {
    Parse.User.logIn(loginCredentials.username, loginCredentials.password, {
      success: function(user) {
        // Do stuff after successful login.
        $scope.$apply(function(){
          $location.path('/ratings');
        });
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        alert("Error: " + error.code + " " + error.message);
      }
    });
  }
}
