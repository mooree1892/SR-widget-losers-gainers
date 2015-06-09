"use strict";

/*
    input becomes the Ticker name and used to store data under the correct company name
    arrayPercent stores all of the percent changes calculated in the Runner
    arraySaver stores the deleted percentages when a new is added
    testArray stores the Ticker and its associated percent change together
*/
var input;
var arrayPercent = []; 
var arraySaver = [];
var testArray = [];

/*
    todayPrice is the value of the most recent price found in the database
    yesterdayPrice is the value of the second most recent price found in the database
    change is the percent change between the two values
    k is the index of testArray where the data is stored 
*/
var todayPrice, yesterdayPrice;
var change;
var k = 0;  

/*
    min and max are the values of the highest and lowest percent changes
    counter and ek are counters used to keep track of indexes in arrays
    maxName and minName are the names of the companies who have the highest and lowest percent changes
*/
var min = 0, max = 0;
var counter = 1, ek = -1;
var maxName = "", minName = "";

StockRender.AppRender.register({
    id: "49e90eee6ce1942a94136fc8db19319c",
    name: "LoserGainersProgram",
    version: "1.0.0",
    defaults: {
    terminal: {
        x: 0,
        y: 0,
        w: 100,
        h: 100
        }
    },

beforeRender: function () {
console.log("running beforeRender!");
},

/* 
    gets values from Tickerlist
    the first for statement creates the testArray 
    the second for loop runs the Runner function and fills all of the arrays with the necessary values
    
    the below data has commented out statements due to the time to load all 3339 values in the database
*/
ready: function(AppMemory, AppData) {

    AppData.v1.Tickerlist.GET("json")
    .then(function(data){        
        console.log(data);

        testArray = new Array(data.response.length);
        for (var x = 0; x < data.response.length; x++){
            testArray[x]= new Array(2)
        }

        for (var i = 0; i < data.response.length; i++ ){
            input = data.response[i].Ticker;
            Runner.loadData(AppData,input);
        }
        console.log(arrayPercent); 

//this is the text size change function
        var changeSize, isChanged;

        $( "#inpText" ).change(function() {
        var newTextSize = document.getElementById('inpText').value;
        console.log(newTextSize);
            if(newTextSize == 12){
                changeSize = '12px';
                isChanged = true;
            }
            if(newTextSize == 13){
                changeSize = '13px';
                isChanged = true;
            }
            if(newTextSize == 14){
                changeSize = '14px';
                isChanged = true;
            }
            if(newTextSize == 15){
                changeSize = '15px';
                isChanged = true;
            }
            if(newTextSize == 16){
                changeSize = '16px';
                isChanged = true;
            }
            if(newTextSize == 17){
                changeSize = '17px';
                isChanged = true;
            }
            if(newTextSize == 18){
                changeSize = '18px';
                isChanged = true;
            }
            if(newTextSize == 19){
                changeSize = '19px';
                isChanged = true;
            }
            if(newTextSize == 20){
                changeSize = '20px';
                isChanged = true;
            }
        });

//this is the function for opening and closing the settings
        var count = 0;
        var click = 0;
        var fundChanged;

        $( "#opener" ).click(function() {
            count += 1;
            click = count % 2;
            console.log('click', click);
            if(click == 1){
                $("#settings").show();
                $("#table1").hide();
            } 
            if(click == 0) {
                $("#settings").hide();
                $("#table1").show();

                if(isChanged == true){
                    console.log(changeSize);
                    var pLength = document.getElementsByTagName('tr').length;
                    for(var x = 0; x < pLength; x++){
                        document.getElementsByTagName('tr')[x].style.fontSize = changeSize;
                    }
                    var emLength = document.getElementsByTagName('tr').length;
                    for(var x = 0; x < emLength; x++){
                        document.getElementsByTagName('tr')[x].style.fontSize = changeSize;
                    }
                    isChanged = false;
                }
            }
        });

//functions that determine which color wheel you changed
        $( "#inpColorScheme1" ).click(function() {
          Runner.colorType('scheme1');
        });
        $( "#inpColorScheme2" ).click(function() {
          Runner.colorType('scheme2');
        });
        $( "#btnTextColor" ).click(function() {
          Runner.colorType('text');
        });
    });
}        
})
function Runner () {}   //creates the Runner function

/* 
    takes the data from the database of the price for current and previous day
    uses this data to find the percentage of change over the two days.
    adds this value to an array called arrayPercent
    checks arrayPercent for undefined values and removes them 
    returns AppData, change, stockName, ArrayPercent, and testArray
*/
Runner.loadData = function loadData(AppData, stockId){
    var checks = 0;

    AppData.v1.pricedata.GET(stockId)
    .then(function(data){

        todayPrice = data.response.data.slice(0,1)[0][1];
        yesterdayPrice = data.response.data.slice(1,2)[0][1];

        change = ((todayPrice - yesterdayPrice) / todayPrice ) * 100;
        change = Math.round(change * 100) / 100;

        arrayPercent.push(change);

        testArray[k][1] = change;
        testArray[k][2] = stockId;

        k++;

    }, function(jqXHR){
        throw new Error('Failed to load data!',jqXHR);
    }).then(function(){
            checks ++;
        if(checks === 2){
            Runner.toggleOverhead();
        }
    });
    //the below removes undefined values from the arrayPercent Array
    for (var s = 0; s < arrayPercent.length; s++ ){
        if(arrayPercent[s] === undefined) {
            arrayPercent.delete(s);
        }
    }

    return AppData;
    return change;
    return arrayPercent;
    return testArray;
    return k;
};

/* 
    the below adds a row to the table

    table is just the table getting called from the HTML
    row is the row number to add the info to
    each cell# is where the data is displayed

    the next two sections find the min and max, then remove it from arrayPercent and push
    it into arraySaver to prevent duplication of data

    the next two for statements obtain the name of the company from the testArray by searching
    for the percent change value

    finally the value are inputted into the table for display

    counter and ek are changed to properly keep track of values
*/
function addRowFunction() {
    var table = document.getElementById("table1");
    var row = table.insertRow(counter);
    var cell1 = row.insertCell(0), cell2 = row.insertCell(1), cell3 = row.insertCell(2), cell4 = row.insertCell(3);

    min = Math.min.apply(null, arrayPercent);
    arraySaver.push(min);
    arrayPercent.splice(arrayPercent.indexOf(min),1);

    max = Math.max.apply(null, arrayPercent);
    arraySaver.push(max);
    arrayPercent.splice(arrayPercent.indexOf(max),1);

    for(var m = 0; m < testArray.length; m++){
        if(testArray[m][1] == min){
            minName = testArray[m][2];
        }
    }

    for(var n = 0; n < testArray.length; n++){
        if(testArray[n][1] == max){
            maxName = testArray[n][2];
        }
    }   

    var newTextSize = document.getElementById('inpText').value;
    var changeSize = '16px';
        if(newTextSize == 12){
            changeSize = '12px';
        }
        if(newTextSize == 13){
            changeSize = '13px';
        }
        if(newTextSize == 14){
            changeSize = '14px';
        }
        if(newTextSize == 15){
            changeSize = '15px';
        }
        if(newTextSize == 16){
            changeSize = '16px';
        }
        if(newTextSize == 17){
            changeSize = '17px';
        }
        if(newTextSize == 18){
            changeSize = '18px';
        }
        if(newTextSize == 19){
            changeSize = '19px';
        }
        if(newTextSize == 20){
            changeSize = '20px';
        }

//this changes the font size of newly added rows
    var emLength = document.getElementsByTagName('tr').length;
    for(var x = 0; x < emLength; x++){
        document.getElementsByTagName('tr')[x].style.fontSize = changeSize;
    }
//this changes the color of the newly added rows
    var txtcolor = document.getElementById('inpColorScheme1').value;
    txtcolor = '#' + txtcolor;
    var rowLength = document.getElementById('table1').rows.length;
    for(var x = 0; x < rowLength; x += 2){
        document.getElementById('table1').rows[x].style.background = txtcolor;
    }
    txtcolor = document.getElementById('inpColorScheme2').value;
    txtcolor = '#' + txtcolor;
    for(var x = 1; x < rowLength; x += 2){
        document.getElementById('table1').rows[x].style.background = txtcolor;
    }
    txtcolor = document.getElementById('btnTextColor').value;
    txtcolor = '#' + txtcolor;
    var pLength = document.getElementsByTagName('tr').length;
    for(var x = 0; x < pLength; x++){
        document.getElementsByTagName('tr')[x].style.color = txtcolor;
    }
    
    var loserName = minName, loserChange = min + " %", gainerName = maxName, gainerChange = max + " %";

    cell1.innerHTML = loserName;
    cell2.innerHTML = loserChange;
    cell3.innerHTML = gainerName;
    cell4.innerHTML = gainerChange;

    counter++;
    ek += 2;    
}

/* 
    the below removes a row from the table

    the if statement insures that you cannot remove the entire table

    the next statements remove or add values to arrayPercent to keep track of values

    counter and ek are changed to properly keep track of values
*/
function deleteRow(rowNum) {
    var i = rowNum.parentNode.parentNode.rowIndex;
    i -= 1;
    if(i > 0){
        var v = ek - 1;
        document.getElementById("table1").deleteRow(i);

        arrayPercent.push(arraySaver[ek]);
        arrayPercent.push(arraySaver[v]);

        arraySaver.splice([ek],1);
        arraySaver.splice([v],1);
        
        counter--;
        ek-= 2;
    } 
    //this changes the color of the newly added rows
    var txtcolor = document.getElementById('inpColorScheme1').value;
    txtcolor = '#' + txtcolor;
    var rowLength = document.getElementById('table1').rows.length;
    for(var x = 0; x < rowLength; x += 2){
        document.getElementById('table1').rows[x].style.background = txtcolor;
    }
    txtcolor = document.getElementById('inpColorScheme2').value;
    txtcolor = '#' + txtcolor;
    for(var x = 1; x < rowLength; x += 2){
        document.getElementById('table1').rows[x].style.background = txtcolor;
    }
    txtcolor = document.getElementById('btnTextColor').value;
    txtcolor = '#' + txtcolor;
    var pLength = document.getElementsByTagName('tr').length;
    for(var x = 0; x < pLength; x++){
        document.getElementsByTagName('tr')[x].style.color = txtcolor;
    }
}

/*
    the below is the options menu
*/

//finds which table row set you are changing
var colorChangeType;
Runner.colorType = function colorType(type){
colorChangeType = type;
};

//changes the color of the rows
Runner.colorChange = function colorChange(){
    var txtcolor;
    if(colorChangeType == 'text'){
        txtcolor = document.getElementById('btnTextColor').value;
        txtcolor = '#' + txtcolor;
            var pLength = document.getElementsByTagName('tr').length;
            for(var x = 0; x < pLength; x++){
                document.getElementsByTagName('tr')[x].style.color = txtcolor;
            }
    }
    if(colorChangeType == 'scheme1'){
        txtcolor = document.getElementById('inpColorScheme1').value;
        txtcolor = '#' + txtcolor;
            var rowLength = document.getElementById('table1').rows.length;
            for(var x = 0; x < rowLength; x += 2){
                document.getElementById('table1').rows[x].style.background = txtcolor;
            }
    }
    if(colorChangeType == 'scheme2'){
        txtcolor = document.getElementById('inpColorScheme2').value;
        txtcolor = '#' + txtcolor;
            var rowLength = document.getElementById('table1').rows.length;
            for(var x = 1; x < rowLength; x += 2){
                document.getElementById('table1').rows[x].style.background = txtcolor;
            }
    }     
}