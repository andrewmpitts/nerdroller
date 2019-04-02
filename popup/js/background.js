function getRandomInt(rollContainer) {
    let multiplier =  parseInt(rollContainer.children[0].value);
    let max =  parseInt(rollContainer.children[1].value);
    let mod =  parseInt(rollContainer.children[2].value);
    let min = multiplier;
    let value = "";
    let values = [];
    if (multiplier <= 0) {
        value = mod;
    }
    else {
        for (n = 0; n < multiplier; n++) {
            values.push(Math.floor(Math.random() * (max)) + 1);
            if (n < multiplier - 1) {
                value += values[n] + " + ";
            }
            else {
                value += values[n];
            }
            
        }
        if (mod != 0) {
            if (mod < 0) {
                value += " - " + mod * -1;
            }
            else {
                value += " + " + mod;
            }
            values.push(mod);
        }
        
        rollContainer.children[4].value = value;
        rollContainer.children[5].value = values.reduce((partial_sum, a) => partial_sum + a);
        

        chrome.storage.local.get('rolls', function(rollHistory){
            if (Object.entries(rollHistory).length === 0 && rollHistory.constructor === Object) { 
                chrome.storage.local.set({'rolls': []}, function() {
                });
            }
            var rolls = rollHistory.rolls;
            if (rolls.length > 9) {
                rolls.pop();
            }
            rolls.unshift(value + " = <strong>" + rollContainer.children[5].value + "</strong>");
            chrome.storage.local.set({"rolls": rolls}, function() {
                renderHistory(rolls);
                });

            });
    };
    
}

function renderHistory(history) {
    document.getElementById('historyContainer').innerHTML = "";
    history.forEach(function(element) {
        document.getElementById('historyContainer').innerHTML += "<div class = 'rollHistoryPoint'>" + element + "</div><hr>";
      });
}

function init() {
    
    document.addEventListener('DOMContentLoaded', function() {
        let nodes = [
            document.getElementById("d4Button"),
            document.getElementById("d6Button"),
            document.getElementById("d8Button"),
            document.getElementById("d10Button"),
            document.getElementById("d12Button"),
            document.getElementById("d20Button"),
            document.getElementById("d100Button")
        ];

        nodes.forEach(function(node){
            node.addEventListener('click', function() {
                getRandomInt(this.parentNode);
            });
          });
    });

    document.getElementById("iconLink").addEventListener('click', function() {
        chrome.tabs.create({url: "https://www.flaticon.com/authors/vitaly-gorbachev"}, function(){});
    });

    document.getElementById("authorLink").addEventListener('click', function() {
        chrome.tabs.create({url: "http://apitts.com"}, function(){});
    });
    chrome.storage.local.get('rolls', function(rollHistory){
        if (Object.entries(rollHistory).length === 0 && rollHistory.constructor === Object) { 
            chrome.storage.local.set({'rolls': []}, function() {
            });
        }
        else {
            renderHistory(rollHistory.rolls);
        }
        
        });
}
init();