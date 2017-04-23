const alexa = require('alexa-sdk');

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', "Welcome to your Forumla One Factbook, ask me some questions and I'll try to answer!");
    },
    'CurrentSeasonTeams': function () {
        var handler = this;
        var http = require('http');
        var url='http://ergast.com/api/f1/current/constructors.json';
    
        http.get(url, function(res) {
            var body = '';
            res.on('data', function(chunk) { body += chunk; });
            
            res.on('end', function() {
                const teamList = JSON.parse(body);
                var teamInfoList = teamList['MRData']['ConstructorTable']['Constructors'];
                var teamEmitString = '';
                for(var i=0; i< teamInfoList.length; i++) {
                    if(i != teamInfoList.length-1 ) {
                        teamEmitString += teamInfoList[i]['name']+', ';
                    }
                    else {
                      teamEmitString += 'and '+teamInfoList[i]['name']    
                    }
               }
                handler.emit(':tell', "The current Formula One teams are: "+ teamEmitString);
                
            });
        });
    },
    'CurrentSeasonDrivers': function() {
        const team = this.event.request.intent.slots.Constructor.value;
        var urlTeam = team;
        if(urlTeam.indexOf(' ') >= 0) {
            urlTeam = urlTeam.replace(/ /g,'_');
        }
            
        var handler = this;
        var http = require('http');
        var url='http://ergast.com/api/f1/current/constructors/'+urlTeam+'/drivers.json';
     
        http.get(url, function(res) {
            var body = '';
            res.on('data', function(chunk) { body += chunk; });
            res.on('end', function() {
                
                var givenName='';
                var familyName='';
                var driverName='';
                var driverEmitString = '';
                
                const driverList = JSON.parse(body);
                var driverInfoList = driverList['MRData']['DriverTable']['Drivers'];
                
                for(var i=0; i< driverInfoList.length; i++) {
                    givenName = driverInfoList[i]['givenName'];
                    familyName = driverInfoList[i]['familyName'];
                    driverName = givenName+' '+familyName;
                
                    if(i != driverInfoList.length-1 ) {
                        driverEmitString += driverName+', ';
                    }
                    else {
                        driverEmitString += 'and '+ driverName 
                    }
               }
               
                handler.emit(':tell', driverEmitString + " are the current drivers for " + team);
                
            });
        });
    }
};

exports.handler = (event, context) => {
    const handler = alexa.handler(event, context);
    handler.registerHandlers(handlers);
    handler.execute();
};