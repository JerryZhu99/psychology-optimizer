var scope;
angular.module("app", [])
.controller("editor",function($scope, $http){
    scope = $scope;
    $http.get('qs.json').then(function(data, status, headers, config) {
        $scope.questions = data.data;
    }).catch(function(data, status, headers, config) {
        console.log(data);
    });
    $http.get('studies.json').then(function(data, status, headers, config) {
        $scope.studies = data.data;
        $scope.size = $scope.studies.length;
    }).catch(function(data, status, headers, config) {
        console.log(data);
    });
    $scope.update = function(){
        var question = $scope.questions[$scope.currentquestion];
        var studies = $scope.selectedstudies;
        $scope.output = JSON.stringify(
            {
                Question:question.Question,
                Marks: question.Marks,
                Required: question.Required,
                Studies:studies
            }, null, "\t");
    }
});
