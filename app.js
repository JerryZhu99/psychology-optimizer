var scope;
angular.module("app", [])
.controller("editor",function($scope, $http){
    scope = $scope;

    /*$http.get('questions.json').then(function(data, status, headers, config) {
        $scope.questions = data.data;
        $http.get('studies.json').then(function(data, status, headers, config) {
            $scope.studies = data.data;
            var s = localStorage.getItem('selected');
            if(s){
                $scope.studies = JSON.parse(s);
            }
            $scope.size = $scope.studies.length;
            $scope.update();
        }).catch(function(data, status, headers, config) {
            console.log(data);
        });
    }).catch(function(data, status, headers, config) {
        console.log(data);
    });*/
    Promise.all([$http.get('questions.json'),$http.get('studies.json')]).then(function(response){
        console.log(response);
        $scope.questions = response[0].data;
        $scope.studies = response[1].data;
        var s = localStorage.getItem('selected');
        if(s){
            $scope.studies = JSON.parse(s);
        }
        $scope.size = $scope.studies.length;
        $scope.update();
        $scope.$apply();
    }).catch(function(response){
        console.log(response);
    });
    $scope.update = function(){
        for(var i=0;i<$scope.questions.length;i++){
            var total = 0;
            var question = $scope.questions[i];
            var num = 0;
            for(var j=0;j<$scope.studies.length;j++){
                if($scope.studies[j].selected){
                    total++;
                    if(question.Studies.indexOf($scope.studies[j].Name)>=0){
                        num++;
                    }
                }
            }
            $scope.total = total;
            console.log(num);
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
        localStorage.setItem('selected', JSON.stringify($scope.studies));
    }

    $scope.highlight = function(study, value){
        for(var i=0;i<$scope.questions.length;i++){
            var question = $scope.questions[i];
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
});
