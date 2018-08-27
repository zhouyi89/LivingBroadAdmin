npm start      //运行
npm run build  //编译

npm install -g pushstate-server
pushstate-server build
start http://localhost:9000

在start.js的76行后增加
serverConfig["proxy"] = proxySetting;