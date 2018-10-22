var express = require('express')
var app = express();
const fs = require('fs')
const path = require('path')


dir=pathofIndexfile;
filePath= pathofVideofile;

app.get("/samplePlayer",function(request,response){
	response.sendFile(path.join(dir+ '/index.html'))
})

app.get("/video",function(request,response){
	var stat = fs.statSync(filePath)
	var range = request.headers.range;
	var size= stat.size;
	if(range){
		var start=((range.split("="))[1]).split("-")[0];
		start = parseInt(start)
		var end = ((range.split("="))[1]).split("-")[1]
		if(!end)end=Math.min(size-1,start+1000)
		end=parseInt(end)
		

		headers ={
			'Content-Range':'bytes '+ start+'-'+end+'/'+size,
			'Accept-Ranges':'bytes',
			'Content-Length': end-start+1+"",
        	'Content-Type': 'video/mp4'
		}
		
		response.writeHead(206,headers);
		const file = fs.createReadStream(filePath, {start,end});
		file.pipe(response)
	}

})

app.listen(3000)