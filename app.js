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
    .when('/practice/', {
        templateUrl: 'practice.html',
        controller: 'practice'
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
    scope = $scope;
    $scope.questions = [];
    if(localStorage.getItem("paper"))$scope.questions = JSON.parse(localStorage.getItem("paper"));
    $scope.generate = function(paper){
        function randomFrom(array, n) {
            var at = 0;
            var tmp, current, top = array.length;

            if(top) while(--top && at++ < n) {
                current = Math.floor(Math.random() * (top - 1));
                tmp = array[current];
                array[current] = array[top];
                array[top] = tmp;
            }

            return array.slice(-n);
        }
        console.log("generating");
        switch (paper) {
            case "1":
            var q22cog = [];
            var q22soc = [];
            var q22bio = [];
            var q8cog = [];
            var q8soc = [];
            var q8bio = [];
            for(var index in $scope.$parent.questions){
                var question = $scope.$parent.questions[index];
                if(question.Unit == "Cognitive"){
                    if(question.Marks == "8"){
                        q8cog.push(question);
                    }else{
                        q22cog.push(question);
                    }
                }else if(question.Unit == "Sociocultural"){
                    if(question.Marks == "8"){
                        q8soc.push(question);
                    }else{
                        q22soc.push(question);
                    }
                }else if(question.Unit == "Biological"){
                    if(question.Marks == "8"){
                        q8bio.push(question);
                    }else{
                        q22bio.push(question);
                    }
                }
            }
            if(q22soc.length == 0)q22soc.push({Marks:22, Question: 'A sociocultural level of analysis question.',Unit:'Sociocultural'})
            $scope.questions = randomFrom(q22cog,1).concat(randomFrom(q22soc,1),randomFrom(q22bio,1),randomFrom(q8cog,1),randomFrom(q8soc,1),randomFrom(q8bio,1));
            break;
            case "2":
            var qs = [];
            for(var index in $scope.$parent.questions){
                var question = $scope.$parent.questions[index];
                if(question.Unit == "Health"){
                    qs.push(question);
                }
            }
            $scope.questions = randomFrom(qs, 3);
            break;
            default:
            break;
        }
        localStorage.setItem("paper",JSON.stringify($scope.questions));
    };
});
