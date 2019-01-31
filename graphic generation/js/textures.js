// Convert hexidecimal to floating point RGB
function hexToRGB(hex){
    hex = parseInt(hex.substring(1), 16);
    var r = hex >> 16;
    var g = hex >> 8 & 0xFF;
    var b = hex & 0xFF;
    return [r / 255, g / 255, b / 255];
}

// Refresh the texture of the environment
function refreshTextures() {
    // Cloud parameters
    var cloudColor = hexToRGB($("#cloud-color").val());
    var cloudAmount = parseFloat($("#cloud-amount").val());
    var cloudFrequency = parseFloat($("#cloud-frequency").val());

    // Grass parameters
    var grassColor1 = hexToRGB($("#grass-color-1").val());
    var grassColor2 = hexToRGB($("#grass-color-2").val());
    var grassFrequency = parseFloat($("#grass-frequency").val());

    /**
     * TODO: Add your code here to adjust the cloud texture and grass texture
     **/
    //修改云的数量
    var a1 = document.getElementById("skyamount1");
    var value_exponent1 = a1.getAttribute("exponent");
    a1.setAttribute("exponent", cloudAmount); 
    

    //修改云的频率
    var b = document.getElementById("skyfrequency");
    var value_skybaseFrequency = b.getAttribute("baseFrequency");
    b.setAttribute("baseFrequency", cloudFrequency); 

    //修改草的频率
    var c = document.getElementById("grassfrequency");
    var value_grassbaseFrequency = c.getAttribute("baseFrequency");
    c.setAttribute("baseFrequency", grassFrequency); 

    //修改云的rgb
    var d = document.getElementById("skyrgb");
    var value_values = d.getAttribute("values");
    d.setAttribute("values", [(1-cloudColor[0]),0,0,0,(cloudColor[0]),(1-cloudColor[1]),0,0,0,(cloudColor[1]),(1-cloudColor[2]),0,0,0,(cloudColor[2]),0,0,0,0,1]);

    //修改草的rgb
    var e = document.getElementById("grassrgb");
    var value_values = e.getAttribute("values");
    e.setAttribute("values", [Math.abs(grassColor2[0]-grassColor1[0]),0,0,0,Math.min(grassColor1[0],grassColor2[0]),Math.abs(grassColor2[1]-grassColor1[1]),0,0,0,Math.min(grassColor1[1],grassColor2[1]),Math.abs(grassColor2[2]-grassColor1[2]),0,0,0,Math.min(grassColor1[2],grassColor2[2]),0,0,0,0,1]);


}
