var default_content="";
var currency = [];
var conversion = 1;
var code ="SGD"
var arr = []

$(document).ready(function(){
	var curjson = "currency.json";
	$.getJSON(curjson, function(cur) {
	  console.log(cur)
	  currency.push(cur.currencies)
	} 
	) 

	checkURL();
	$('ul li a').click(function (e){
			checkURL(this.hash);
	});

	//filling in the default content
	default_content = $('#pageContent').html();


	setInterval("checkURL()",250);

});

var lasturl="";

function checkURL(hash)
{
	if(!hash) hash=window.location.hash;

	if(hash != lasturl)
	{
		lasturl=hash;
		// FIX - if we've used the history buttons to return to the homepage,
		// fill the pageContent with the default_content
		if(hash=="")
		$('#pageContent').html(default_content);

		else{
		 if(hash=="#products")
		 	loadProducts();
		 else
		   loadPage(hash);
		}
	}
}

function loadPage(url) {
	url = url.replace("#", "");
  
	$("#loading").css("visibility", "visible");
	if (url.includes("detail")) {
	  var specific = url.replace("detail_", "");

	  $.ajax({
		type: "GET",
		url: "products.json",
		dataType: "json",
		success: function (data) {
		  let cont =
			"<img src='" +
			data.products[specific].imgPath +
			"'><br>" +
			data.products[specific].description;
		  $("#pageContent").html(cont);
		  $("#loading").css("visibility", "hidden");
		},
	  });
	} else {
	  $.ajax({
		type: "POST",
		url: "load_page.jsp",
		data: "page=" + url,
		dataType: "html",
		success: function (msg) {
		  if (parseInt(msg) != 0) {
			$("#pageContent").html(msg);
			$("#loading").css("visibility", "hidden");
		  }
		},
	  });
	}
  }
  
function clickPage(val) {

	var imgList= "<ul class=\"products\">";
	let price = arr[val].price * conversion;
	imgList += '<li class=\"pic\"><img src= "' + arr[val].imgPath + '"><h3>' + arr[val].name + '</h3> <p id="dprice">' + code+ " "  + price +
	 '</p></li><li id=\"des\">' + arr[val].description + '</li>' ;
	imgList+='</ul>'
	console.log(imgList)
	$('#pageContent').html(imgList);
	$('#loading').css('visibility','hidden');
}

function loadProducts() {	
	// alert("im here")

  $('#loading').css('visibility','visible');



// console.log(currency)
  var jsonURL = "products.json";
  $.getJSON(jsonURL, function (json)
  {
	console.log(json)
    var imgList= "<ul class=\"products\">";
	 arr = json.products;

	

    $.each(arr, function () {
		let price = this.price * conversion;
      imgList += 
	  `
      <a href="#` +
        this.pageUrl +
        `">
	    <li class=\"pic\">
			<img src= "` +
			this.imgPath +
			`" id='` +
			this.id +
			`'><h3>`
			 + this.name + `</h3> <p id="dprice">` + code+ " "  + price + `</p></li></a>
	  `;
    });
    imgList+='</ul>'
   $('#pageContent').html(imgList);
   $('#loading').css('visibility','hidden');
  });
}

function getSelectValue ()
{
	
	var selectedValue = document.getElementById("currency").value;

	let Index = currency[0].findIndex((a) => a.code == selectedValue);
	conversion = currency[0][Index]['conversion'];
	code = currency[0][Index]['code'];
	loadProducts();

}

// 1. Select Value
// function getSelectValue ()
// {
	// var selectedValue = document.getElementById("currency").value;
	
	// console.log(comValue)


