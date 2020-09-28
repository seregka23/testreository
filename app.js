const PAT = "58e0cac77d8014256b6cf683385dab488cc750c3";
const owner_name = "v-sepetr-microsoft.com"
const app_name = "TestTask2"

const axios = require('axios')

//Request configuration
var config = {
    baseURL: `https://api.appcenter.ms/v0.1/apps/${owner_name}/${app_name}`,
    responseType: "json",
    headers: {
        "Content-Type": "application/json",
        "X-API-Token": PAT,
    },
}
//Create request
var apiClient = axios.default.create(config);

//GET request to get branches
async function getBranches() {
    
    var response = await apiClient.get("/branches");
  
    let data = response.data;
    let result = new Array();
    data.forEach(branch => {
        result.push(branch.branch.name)
    })
    return result;
}

//Post request to start build against the branch
async function runBuild(branch) {
    
    var response = apiClient.post(`/branches/${branch}/builds`);
    response.then(x=> {
        let build = x.data;
        console.log(`Build ${build.id} was started against ${build.sourceBranch} branch`)
    })
}

//Get request to print a status report
async function getListOfBuilds(branch) {
    var response = await apiClient.get(`/branches/${branch}/builds`);
    let data = response.data;
    data.forEach(build => {
        var logsLink = "https://appcenter.ms/users/" + owner_name + "/apps/" + app_name + "/build/branches/" + build.sourceBranch + "/builds/" + build.id;
        var buildDuration = (Date.parse(build.finishTime) - Date.parse(build.startTime)) / 1000;
        console.log(build.sourceBranch + " build " + build.id + " " + build.result + " in " + buildDuration + " sec. Link to build logs " + logsLink)
    })
}


async function main(){
var inquirer = require('inquirer');

//Show main menu
inquirer
  .prompt([
    {
      type: 'list',
      name: 'theme',
      message: 'What do you want to do?',
      choices: [
        'Get branches',
        'Run new build',
        'Get report',
        'Exit'
      ]
    }
  ])
  .then((answers) => {
    switch (answers.theme) {
        case 'Get branches':
            console.log("List of branches:")
            getBranches().then(x=>{
                console.log(x);
            });
            break;
        case 'Run new build':
            console.log("Starting new builds.")
            getBranches().then(x=>{
                x.forEach(branch => {
                    runBuild(branch);
                })
            });
            break;
        case 'Get report':
            console.log("List of builds:")
            getBranches().then(x=>{
                x.forEach(branch => {
                    getListOfBuilds(branch);
                })
            });
            break;
        case 'Exit':
            break;
        default:
            break;
    }
  });
}

main();