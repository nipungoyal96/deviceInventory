const express = require('express');
const path = require('path');
const app = express(),
      bodyParser = require("body-parser");
 
const fs = require('fs')

var file = require('./database/db.json')
app.use(express.static(path.join(__dirname, './build')));

const cors = require("cors");

app.use(cors());


function jsonReader( cb) {
    fs.readFile('./database/db.json', (err, fileData) => {
        if (err) {
            return cb && cb(err)
        }
        try {
            const object = JSON.parse(fileData)
            return cb && cb(null, object)
        } catch(err) {
            return cb && cb(err)
        }
    })
}
function jsonWriter(data) {
    fs.writeFile('./database/db.json',data, (err) => {
        if (err) {
            console.log('Error while writing File',err)
        }
        else{
            console.log('Successfully wrote file')
        }
    })
}


app.use(bodyParser.json());
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, './build/index.html'));
  });
app.post('/api/addDevice', (req, res) => {
    const device = req.body.device;
    const devices = file['devices']?file['devices'].concat(device):[].concat(device)
    file.devices=devices
    file["lastDeviceId"]=req.body.lastDeviceId;
    jsonWriter(JSON.stringify(file));
    
    res.sendStatus(200)
});

app.get('/api/devices',(req,res)=>{
    let devices = []
   jsonReader((err,fileData)=>{
        if(err){
            console.log(err)
            return 
        }
        devices=fileData['devices'];
        res.json(devices)
    })
    
    
})

app.get('/api/getLastId',(req,res)=>{
    jsonReader((err,fileData)=>{
        if(err){
            console.log(err)
            return 
        }
        let lastId=fileData['lastDeviceId']?fileData['lastDeviceId']:'a0001'
        
        res.json(lastId)
    })
})

app.post('/api/assignDevice',(req,res)=>{
   
    const allotDevice = req.body.allotDevice;
        const allotedDevices = file['allotedDevices']?file['allotedDevices'].concat(allotDevice):[].concat(allotDevice)
        file.allotedDevices=allotedDevices
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})

app.get('/api/getAssignedDevices',(req,res)=>{
    jsonReader((err,fileData)=>{
        if(err){
            console.log(err)
            return 
        }
        let assignDevice=fileData['allotedDevices']?fileData['allotedDevices']:[]
        
        res.json(assignDevice)
    })
})

app.post('/api/submitDevice',(req,res)=>{
   
    const submitDevice = req.body.subDevice;
        const submittedDevices = file['submitedDevices']?file['submitedDevices'].concat(submitDevice):[].concat(submitDevice)
        file["submitedDevices"]=submittedDevices;
        file["allotedDevices"].splice(req.body.index,1)
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})

app.get('/api/getSubmitedDevices',(req,res)=>{
    jsonReader((err,fileData)=>{
        if(err){
            console.log(err)
            return 
        }
        let submitedList=fileData['submitedDevices']?fileData['submitedDevices']:[]
        
        res.json(submitedList)
    })
})

app.post('/api/updateDevice',(req,res)=>{
    const device = req.body.device;
        let findDevice=file["devices"].find(devices => devices.id === device.id )
        let index=file["devices"].indexOf(findDevice);

        file["devices"].splice(index,1,device);
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})

app.post('/api/updateAllotedDevice',(req,res)=>{
   
        const device = req.body.device;
        let findDevice=file["allotedDevices"].find(devices => devices.id === device.id )
        let index=file["allotedDevices"].indexOf(findDevice);

        file["allotedDevices"].splice(index,1,device);
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})

app.post('/api/updateSubmitDevice',(req,res)=>{
   
    const device = req.body.device;
    let findDevice=file["submitedDevices"].find(devices => devices.id === device.id )
    let index=file["submitedDevices"].indexOf(findDevice);

    file["submitedDevices"].splice(index,1,device);
jsonWriter(JSON.stringify(file));
res.sendStatus(200)
})

app.post('/api/deleteDevice',(req,res)=>{
   
    const id = req.body.id;
      let findDevice=file["devices"].find(devices => devices.id === id )
        let index=file["devices"].indexOf(findDevice);

        file["devices"].splice(index,1);
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})


app.post('/api/delAllotedDevice',(req,res)=>{
   
    const id = req.body.id;
      let findDevice=file["allotedDevices"].find(devices => devices.id === id )

        let index=file["allotedDevices"].indexOf(findDevice);

        file["allotedDevices"].splice(index,1);
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})

app.post('/api/delsubmittedDevice',(req,res)=>{
   
    const id = req.body.id;
      let findDevice=file["submitedDevices"].find(devices => devices.id === id )

        let index=file["submitedDevices"].indexOf(findDevice);

        file["submitedDevices"].splice(index,1);
    jsonWriter(JSON.stringify(file));
    res.sendStatus(200)
})
app.listen(3080);   