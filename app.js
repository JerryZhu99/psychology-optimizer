var scope;
var deps = ['ngRoute','ui.bootstrap'];
try{
    angular.module('angulartics');
    deps.push('angulartics');
}catch(e){
    console.error(e);
}
try{
    angular.module('angulartics.google.analytics');
    deps.push('angulartics.google.analytics');
}catch(e){
    console.error(e);
}

var app = angular.module("app", deps);

app.config(['$routeProvider', '$locationProvider',
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
.controller("main",function($scope, $window, $location, $http){

    scope = $scope;
    Promise.all([$http.get('questions.json'),$http.get('studies.json')]).then(function(response){
        $scope.questions = response[0].data;
        $scope.studies = response[1].data;
        var s = localStorage.getItem('selected');
        if(s){
            var studies = JSON.parse(s);
            console.log(studies);
            for(var i in studies){
                var study = studies[i];
                for(var j in $scope.studies){
                    if($scope.studies[j].Name==study.Name){
                        $scope.studies[j].selected = study.selected;
                    }
                }
            }
        }
        $scope.size = $scope.studies.length;
        if($scope.optimizer){
            $scope.optimizer.update();
            $scope.$apply();
        }
    }).catch(function(response){
        console.log(response);
    });

})
.controller("optimizer",function($scope){
    $scope.searchFilter = function (obj) {
        if(!$scope.search)return true;
        if(!$scope.search.$)return true;
        var terms = String($scope.search.$).split(",");
        for(var s in terms){
            var str = terms[s].trim();
            var found = false;
            var re = new RegExp(str, 'i');
            found = (re.test(obj.Question) || re.test(obj.Marks)|| re.test(obj.Unit) || re.test(obj.Studies.toString()));
            if(!found)return false;
        }
        if($scope.search.Unit == obj.Unit ||!$scope.search.Unit){
            return true;
        }
        return false;
    };
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
        var cog8 = 0, soc8 = 0, bio8 = 0, cog22 = 0, soc22 = 0, bio22 = 0, hea22 = 0, dev22 = 0;
        var cog8t = 0, soc8t = 0, bio8t = 0, cog22t = 0, soc22t = 0, bio22t = 0, hea22t = 0, dev22t = 0;
        for(var i in $scope.$parent.questions){
            var q = $scope.$parent.questions[i];
            switch (q.Unit) {
                case "Cognitive":
                if(q.Marks == 8){
                    cog8t++;
                    if(q.number>=q.Required){
                        cog8++;
                    }
                }else{
                    cog22t++;
                    if(q.number>=q.Required){
                        cog22++;
                    }
                }
                break;
                case "Sociocultural":
                if(q.Marks == 8){
                    soc8t++;
                    if(q.number>=q.Required){
                        soc8++;
                    }
                }else{
                    soc22t++;
                    if(q.number>=q.Required){
                        soc22++;
                    }
                }
                break;
                case "Biological":
                if(q.Marks == 8){
                    bio8t++;
                    if(q.number>=q.Required){
                        bio8++;
                    }
                }else{
                    bio22t++;
                    if(q.number>=q.Required){
                        bio22++;
                    }
                }
                break;
                case "Health":
                hea22t++;
                if(q.number>=q.Required){
                    hea22++;
                }
                break;
                case "Developmental":
                dev22t++;
                if(q.number>=q.Required){
                    dev22++;
                }
                break;
                default:
                console.log(q);

                break;
            }
        }

        $scope.cog8 = {status: cog8/cog8t==1?'bg-success':'bg-danger', text : "Cognitive 8pts:"+(cog8/cog8t*100).toFixed(0)+"%"};
        $scope.soc8 = {status: soc8/soc8t==1?'bg-success':'bg-danger', text : "Sociocultural 8pts:"+(soc8/soc8t*100).toFixed(0)+"%"};
        $scope.bio8 = {status: bio8/bio8t==1?'bg-success':'bg-danger', text : "Biological 8pts:"+(bio8/bio8t*100).toFixed(0)+"%"};
        $scope.cog22 = {status: cog22/cog22t==1?'bg-success':'bg-danger', text : "Cognitive 22pts:"+(cog22/cog22t*100).toFixed(0)+"%"};
        $scope.soc22 = {status: soc22/soc22t==1?'bg-success':'bg-danger', text : "Sociocultural 22pts:"+(soc22/soc22t*100).toFixed(0)+"%"};
        $scope.bio22 = {status: bio22/bio22t==1?'bg-success':'bg-danger', text : "Biological 22pts:"+(bio22/bio22t*100).toFixed(0)+"%"};
        $scope.hea22 = {status: hea22/(hea22t-2)>=1?'bg-success':'bg-danger', text : "Health 22pts:"+(hea22/hea22t*100).toFixed(0)+"%"};
        $scope.dev22 = {status: dev22/(dev22t-2)>=1?'bg-success':'bg-danger', text : "Developmental 22pts:"+(dev22/dev22t*100).toFixed(0)+"%"};
    };
    if($scope.$parent.questions){
        $scope.update();
    }else{
        $scope.$parent.optimizer = $scope;
    }
    $scope.highlight = function(study, value){
        for(var i=0;i<$scope.$parent.questions.length;i++){
            var question = $scope.$parent.questions[i];
            if(question.Studies.indexOf(study.Name)>=0){
                var num = 0;
                if(value){
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
    };
})
.controller("studies",function($scope){

})
.controller("study",function($scope, $routeParams){
    $scope.study = $scope.$parent.studies.find(function(study){
        return study.Name == $routeParams.name.split('_').join(' ');
    });
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
            if(q22soc.length === 0)q22soc.push({Marks:22, Question: 'A sociocultural level of analysis question.',Unit:'Sociocultural'});
            $scope.questions = randomFrom(q22cog,1).concat(randomFrom(q22soc,1),randomFrom(q22bio,1),randomFrom(q8cog,1),randomFrom(q8soc,1),randomFrom(q8bio,1));
            break;
            case "2":
            var health = [];
            var developmental = [];
            for(var index in $scope.$parent.questions){
                var question = $scope.$parent.questions[index];
                if(question.Unit == "Health"){
                    health.push(question);
                }
                if(question.Unit == "Developmental"){
                    developmental.push(question);
                }
            }
            $scope.questions = randomFrom(health, 3).concat(randomFrom(developmental,3));
            break;
            default:
            break;
        }
        localStorage.setItem("paper",JSON.stringify($scope.questions));
    };
});
