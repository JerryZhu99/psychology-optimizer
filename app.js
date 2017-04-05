var scope;
angular.module("app", ['ngRoute','ui.bootstrap'])
.config(['$routeProvider', '$locationProvider',
function($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {
        templateUrl: 'optimizer.html',
        controller: 'optimizer',
    })
    .when('/studies', {
        templateUrl: 'studies.html',
        controller: 'studies',
    })
    .when('/studies/:name', {
        templateUrl: 'study.html',
        controller: 'study'
    })
    .otherwise({
        templateUrl: 'optimizer.html',
        controller: 'optimizer',
    });
}])
.filter('replace', function () {
  return function (input, from, to) {
    input = input || '';
    from = from || '';
    to = to || '';
    return input.replace(new RegExp(from, 'g'), to);
  };
})
.controller("main",function($scope, $http){
    scope = $scope;
    Promise.all([$http.get('questions.json'),$http.get('studies.json')]).then(function(response){
        $scope.questions = response[0].data;
        $scope.studies = response[1].data;
        var s = localStorage.getItem('selected');
        if(s){
            $scope.studies = JSON.parse(s);
        }
        $scope.size = $scope.studies.length;
    }).catch(function(response){
        console.log(response);
    });

})
.controller("optimizer",function($scope){
    scope = $scope;
    $scope.update = function(){
        for(var i=0;i<$scope.$parent.questions.length;i++){
            var total = 0;
            var question = $scope.$parent.questions[i];
            var num = 0;
            for(var j=0;j<$scope.$parent.studies.length;j++){
                if($scope.$parent.studies[j].selected){
                    total++;
                    if(question.Studies.indexOf($scope.$parent.studies[j].Name)>=0){
                        num++;
                    }
                }
            }
            $scope.total = total;
            question.number = num;
            question.num = num;
            if(num>=question.Required){
                question.status="success";
            }else if(num>0){
                question.status="warning";
            }else{
                question.status="danger";
            }
        }
        localStorage.setItem('selected', JSON.stringify($scope.$parent.studies));
    }
    $scope.update();
    $scope.highlight = function(study, value){
        for(var i=0;i<$scope.$parent.questions.length;i++){
            var question = $scope.$parent.questions[i];
            if(question.Studies.indexOf(study.Name)>=0){
                if(value){
                    var num = 0;
                    if(study.selected){
                        num = question.number - 1;
                    }else{
                        num = question.number + 1;
                    }
                    question.num = num;
                    if(num>=question.Required){
                        question.status="success";
                    }else if(num>0){
                        question.status="warning";
                    }else{
                        question.status="danger";
                    }
                }else{
                    num = question.number;
                    question.num = num;
                    if(num>=question.Required){
                        question.status="success";
                    }else if(num>0){
                        question.status="warning";
                    }else{
                        question.status="danger";
                    }
                }
            }
        }
    }
})
.controller("studies",function($scope){

})
.controller("study",function($scope, $routeParams){
    $scope.study = $scope.$parent.studies.find(function(study){return study.Name == $routeParams.name.split('_').join(' ')});
    console.log($scope.study);
})
.controller("practice",function($scope, $http){
    
});
