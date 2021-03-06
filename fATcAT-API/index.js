
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');

const socketio = require("socket.io");

const get_objects = require('./controllers/get_objects.js');
const device_data = require('./controllers/device_data.js');
const verify_bowl = require('./controllers/verify_bowl.js');
const add_new_object = require('./controllers/add_new_object.js');
const check_weight = require('./controllers/check_weight.js');
const change_method = require('./controllers/change_method.js');
const bowl = require('./controllers/bowlControllers.js');
const logs_request = require('./controllers/logs_request.js');
const remove_object = require('./controllers/remove_object.js');
const sockets_status = require('./controllers/get_currentConnectedClients.js');
const current_weight = require('./controllers/get_current_weight.js');

const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config({path: './config.env'});
const server = http.createServer(app);
const io = require('./services/sockets.js').listen(server);

const DB = process.env.DATABASE.replace( 
	'<PASSWORD>', 
	process.env.DATABASE_PASSWORD
	);

mongoose.connect(DB, {
	useNewUrlParser: true,
	useCreateIndex: true,
	useFindAndModify: false,
}).then(() =>console.log("DB connected successfully!"));

app.get('/currentConnectedClients', sockets_status.handleCurrentConnectedClients());
app.get('/weightRequestsMailbox', sockets_status.handleWeightRequestsMailbox());
app.get('/cats', get_objects.handleGetAllCats());
app.get('/bowls', get_objects.handleGetAllBowls());
app.post('/device_data', device_data.handleDeviceData());
app.post('/verify_bowl', verify_bowl.handleVerifyBowl());
app.post('/add_new_object/bowl', add_new_object.handleNewBowl());
app.post('/add_new_object/cat', add_new_object.handleNewCat());
app.post('/check_weight', check_weight.handleCheckWeight());
app.post('/change_method', change_method.handleChangeMethod());
app.post('/bowl/update_data', bowl.handleUpdateData()); 
app.post('/bowl/new_log', bowl.handleNewLog()); 
app.post('/bowl/current_weight', bowl.handlCurrentWeight()); 
app.post('/logs', logs_request.handleLogs());
app.post('/remove_object/bowl', remove_object.handleRemoveBowl());
app.post('/remove_object/cat', remove_object.handleRemoveCat());
app.post('/current_weight', current_weight.handleGetCurrentBowlWeight());

const port = process.env.PORT || 3000;
server.listen(port, ()=> {
	console.log(`app is running on ${port}`);
})
