// Check if a given symbol is a digit
function isDigit(input) {
    var digits = "0123456789";
    return (input.length == 1 && digits.indexOf(input) >= 0);
}

// Get the next number from the string and return
// the next position following the number
function getNumberFromString(string, index) {
    // Get the number
    var number = "";
    while (index < string.length && isDigit(string[index])) {
        number = number + string[index];
        index++;
    }

    // If there is no number to read, the returned number will be NaN
    return { number: parseInt(number), next: index };
}

// Draw the tree given the settings in the system
function drawTree() {
    // Get the L-system parameters
    var start = $("#lsystem-start").val().trim();
    var iterations = parseInt($("#lsystem-iterations").val());
    var length = parseFloat($("#lsystem-length").val());
    var angle = parseFloat($("#lsystem-angle").val());
    var width = parseFloat($("#lsystem-width").val());
    var lengthRatio = parseFloat($("#length-ratio").val());
    var widthRatio = parseFloat($("#width-ratio").val());

    // Create the rules
    var rules = {};
    for (var i = 1; i <= 5; i++) {
        if ($("#lsystem-rule-symbol-" + i).length > 0) {
            var symbol = $("#lsystem-rule-symbol-" + i).val().trim();
            var replacement = $("#lsystem-rule-replacement-" + i).val().trim();

            if (symbol != "" && replacement != "")
                rules[symbol] = replacement;
        }
    }

    // Create the colours
    var colors = {};
    for (var i = 1; i <= 5; i++) {
        if ($("#lsystem-color-symbol-" + i).length > 0) {
            var symbol = $("#lsystem-color-symbol-" + i).val().trim();
            var color = $("#lsystem-color-color-" + i).val().trim();

            if (symbol != "") colors[symbol] = color;
        }
    }

    // Reset the tree area
    turtle.reset();

    // Go to the starting position
    /**
     * TODO: You may adjust the starting position depending
     *       on the positioning of your grass texture
     **/
    turtle.up();
    turtle.goto(250, 405);
    turtle.left(90);
    turtle.down();

    // Run the L-system
    var string = runLSystem(start, rules, iterations);

    // Put the result string in the right place
    $("#lsystem-result-string").val(string);

    // Draw the final string
    drawLSystem(turtle, string, length, angle, width,
                lengthRatio, widthRatio, colors);
}

// Run the L-system to get the final L-system string
function runLSystem(start, rules, iterations) {
    var string = start;

    // Run the L-system for the specified iterations
    for (var i = 0; i < iterations; i++) {
        var result = "";

        for (var j = 0; j < string.length; j++) {
            // The letter/symbol to be replaced
            var symbol = string[j];

            /**
             * TODO: You need to extract the associated depth number,
             *       if there is one, next to the current symbol
             **/
            var temp=getNumberFromString(string,j+1);
            // Assume the replacement is the letter/symbol itself
            var replacement = symbol;

            /**
             * TODO: The above replacement *may* have a depth value
             **/
            if (isNaN(temp["number"])){
                j=j;
            }
            else{
                j=temp["next"]-1;
                replacement =replacement+temp["number"];
                var depthnum=temp["number"];
            }

            // Update the replacement is the letter/symbol is in the rule
            if (symbol in rules) {
                replacement = rules[symbol];

                /**
                 * TODO: Any increment inside the replacement has to be adjusted
                 *       using the depth number of the current symbol
                 **/
                 var result2="";
                 for (var k=0;k<replacement.length;k++){
                    var symbol2=replacement[k];
                    var temp2=getNumberFromString(replacement,k+1);
                    var replacement2=symbol2;
                    if (isNaN(temp2["number"])){
                        k=k;
                    }
                    else{
                        k=temp2["next"]-1;
                        replacement2=replacement2+(depthnum+temp2["number"]);
                    }
                    result2=result2+replacement2;
                 }
                 replacement=result2;
            }

            // Add the replacement at the end of the result string
            result = result + replacement;
        }
        string = result;
    }

    return string;
}

function Stack(){

    var items = [];     //用来保存栈里的元素

    this.push = function (element) {
        items.push(element);
    }

    this.pop = function () {
        return items.pop();
    }

    this.peek = function () {
        return items[items.length-1];
    }

    this.isEmpty = function () {
        return items.length == 0;
    }

    this.size = function () {
        return items.length;
    }

    this.clear = function () {
        items = [];
    }

    this.print = function () {
        console.log(items.toString());
    }
}



// Draw the L-system string using the turtle
function drawLSystem(turtle, string, length, angle, width,
                     lengthRatio, widthRatio, colors) {
    /**
     * TODO: You need to prepare a stack data structure
     *       before drawing the L-system image
     **/
    var stack1=new Stack();
    var stack2=new Stack();
    for (var i = 0; i < string.length; i++) {
        // The letter/symbol to be handled
        var symbol = string[i];

        /**
         * TODO: You need to extract the associated depth number,
         *       if there is one, next to the current symbol
         **/
         var temp=getNumberFromString(string,i+1);
        if (isNaN(temp["number"])){
            i=i;
            var depthnum=0;
        }
         else{
            i=temp["next"]-1;
            depthnum=temp["number"];
        }
               
        // Move and draw forward
        if ("ABCDEF".indexOf(symbol) >= 0) {
            /**
             * TODO: The colour, width and length can all be different
             *       depending on the L-system settings
             **/

            turtle.color(colors[symbol]);
            turtle.width(width*Math.pow(widthRatio,depthnum));
            turtle.forward(length*Math.pow(lengthRatio,depthnum));
        }
        // Move forward without drawing
        else if ("GHIJKL".indexOf(symbol) >= 0) {
            /**
             * TODO: The length can be different depending
             *       on the L-system settings
             **/

            turtle.up();
            turtle.forward(length*Math.pow(lengthRatio,depthnum));
            turtle.down();
        }
        // Turn left
        else if (symbol == "+") {
            turtle.left(angle);
        }
        // Turn right
        else if (symbol == "-") {
            turtle.right(angle);
        }

        /**
         * TODO: You need to extend the above if statement
         *       to include the stack symbols [ and ]
         **/
          else if (symbol == "["){
            stack1.push(turtle.pos());
            stack2.push(turtle.heading());
         }
         else if (symbol == "]"){
            var state1=stack1.pop()
            var state2=stack2.pop();
            turtle.up();
            turtle.goto(state1[0],state1[1]);
            turtle.setHeading(state2);
            turtle.down();
         }
    }
}
