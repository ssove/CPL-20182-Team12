// opens file system
var fs = require('fs');

// creates WebServer
var http = require('http');
var connect = require('connect');
var app = connect();
var socketio = require('socket.io');

// mongodb 연결
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/capstone123',{ useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  	console.log("open: success");
});

//  <<db schcema>>
//mongodb schema
var user = mongoose.Schema({
  id: String,
  pwd: String,
  Wpostnum: [Number] //숫자형 배열 미안.. 너 중복이야
});
var post  = mongoose.Schema({
  postNum: Number,
  writer: String,
  content: String,
  tag: String,
  comment: [String], //안씀 개르륵
  like: Number
});
var tags  = mongoose.Schema({
  tagname: String,
  postNum: [Number]
});


//model
var UserModel = mongoose.model('Users',user);
var PostModel = mongoose.model('Posts',post);
var TagModel = mongoose.model('Tags',tags);

// request from web browser - html
app.use('/', function(req,res,next){
	if(req.url != '/favicon.ico'){
		fs.readFile(__dirname+'/client.html', function(error, data){
			res.writeHead(200, {'Content-Type':'text/html'});
			res.write(data);
			res.end();
		});
	}
});

// creates server
var server = http.createServer(app);
server.listen(1337, function(){
	console.log('server listen on port 1337');
});

// creates WebSocket Server
var io = socketio.listen(server);

// executed on connection
// <<web socket server>>
//connection 실행
//참고 https://socket.io/ -> 이거랑 조그므 다음
//io.sockets.on -> 나를 포함한 모든 클라이언트들에게 이벤트 보내기
// io는 socket.io 패키지를 import한 변수고, socket은 커넥션이 성공했을 때
//커넥션에 대한 정보를 담고 있는 변수입니다. socket 변수를 사용해 서버에서 이벤트 리스너를 등록하면 됩니다.
//여기서는 broadcast의 역할을 io.socket.emit이 대신함
var endPostNum=0;
io.sockets.on('connection', function(socket) {
	console.log("web server connect");
	socket.on('disconnect',function(){
			console.log('user disconnected');
		});
		//client connect test
		/*
		io.emit('test','hello');
	*/

	  //post 가져오기
	  PostModel.find(function(err,result){
	    for(var i=0;i<result.length;i++){
	      var dbData = { postNum: result[i].postNum, writer: result[i].writer, content: result[i].content, tag: result[i].tag,comment: result[i].comment,like: result[i].like};
				//console.log(dbData);
				if(endPostNum < dbData.postNum)
					endPostNum = dbData.postNum;
				socket.emit('prePost',dbData);
	    }
	   // console.log('server transmit prepost endPostNum: ',+endPostNum);
	  });

	  //login
	  socket.on('checkUser',function(data){
	    UserModel.findOne({id:data.id}).exec(function(err,docs){
	      if(err) throw err;
	      console.log("checkUser by login button");
			//	console.log("the contents are \n" + docs);

				var result;
	      //값이 없으면 docs가 null로 반환됨
	      if(docs==null)
	      {
	        result = 1;
	        var newUser = UserModel({id:data.id,pwd:data.pwd,Wpostnum:0});
	        newUser.save(function(err,data){
	          if(err){
	            console.log("new user error");
	          }
	          console.log("new uesr create "+ data.id + data.pwd);
	        });
	      }
	      else {
	        //비밀번호 확인
					console.log("ordinary user find!");
					if(docs.pwd == data.pwd)
						//비밀 번호가 맞음
						result = 1;
					else
						result = 0;
	      }
	      socket.emit("enableUser",{rst:result});
	    });
	  });

		//post 등록
		socket.on('sendPost',function(data){
			endPostNum++;
			var Post = new PostModel({postNum: endPostNum,writer:data.writer,content:data.content,tag:data.tag,comment:null,like:0});
			Post.save(function(err,data){
				if(err){
					console.log("new post error");
				}
				console.log("new post create "+ data.postNum + data.writer);
			});
			console.log('new post content is \n'+Post);

			//tag #기준으로 파싱해서 TagModel에 저장해두기!
			var taglist=data.tag.split('#');
			for(var i=1;i<taglist.length;i++){
				var tname = taglist[i];
				 TagModel.findOne({tagname:taglist[i]}).exec(function(err,docs){
					 if(docs==null)
					 {
						 //값이 없다.
						 var list=[];
						 console.log(endPostNum);
						 list.push(endPostNum);
			 			var Tag = new TagModel({tagname:tname,postNum:list});
						Tag.save(function(err,data){
							if(err){
								console.log("new tag error");
							}
							console.log("new tag create ");
						});
						console.log('new tag content is \n'+Tag);
					 }
					 else {
						 var list = docs.postNum;
						 list.push(endPostNum);
						 TagModel.update({tagname:tname},{$set:{postNum:list}},function(err,docs){
							 if(err) throw err;
							// res.send(docs);
						 });
					 }
				 });
			}
			//모든 클라이언트에게 입력된 POST등록하기
			io.sockets.emit('prePost',Post);
		});

		//serch 결과 찾아서 보내기
		socket.on('searchTag',function(data){
			if(data.tag != ""){ //검색어가 없을 경우
				//post가 없을 경우
				TagModel.findOne({tagname:data.tag}).exec(function(err,docs){
					if(docs!=null){
						for(var i=0;i<docs.postNum.length;i++){
							PostModel.find({postNum:docs.postNum[i]}).exec(function(err,result){
								if(result[0] != null){
									var dbData = { postNum: result[0].postNum, writer: result[0].writer, content: result[0].content, tag: result[0].tag,comment: result[0].comment,like: result[0].like};
									socket.emit('searchResult',dbData);
								}
							});
						}
					}
				});
			}
		});

		//delete
		socket.on('deleteP',function(data){
			var pn = parseInt(data,10);
			PostModel.remove({postNum:pn},function(err,docs){
				if(err) throw err;
			});
			// tag에 정보를 없애는 것은 searchTag에서 처리

			//귀찮으니 새로 prepost
			PostModel.find(function(err,result){
				for(var i=0;i<result.length;i++){
					if(result[i].postNum == pn)
							continue;
					var dbData = { postNum: result[i].postNum, writer: result[i].writer, content: result[i].content, tag: result[i].tag,comment: result[i].comment,like: result[i].like};
					socket.emit('prePost',dbData);
				}
			});

		});

		//like up
		socket.on('upLike',function (data) {
	//like++
	PostModel.findOne({postNum:data}).exec(function(err,result){
		console.log(result);
		var plus = result.like+1;
		console.log(plus);
		PostModel.update({postNum:data},{$set:{like:plus}},function(err,docs){
				if(err) throw err;
		});
		//귀찮으니 새로 prepost
		PostModel.find(function(err,result){
			for(var i=0;i<result.length;i++){
				if(data == result[i].postNum){
					var dbData = { postNum: result[i].postNum, writer: result[i].writer, content: result[i].content, tag: result[i].tag,comment: result[i].comment,like: plus};
				}
				else{
					var dbData = { postNum: result[i].postNum, writer: result[i].writer, content: result[i].content, tag: result[i].tag,comment: result[i].comment,like: result[i].like};
				}
				socket.emit('prePost',dbData);
			}
		});
	});

	});



});
