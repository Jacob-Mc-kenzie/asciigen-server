// server.js
import express from 'express';
import {AccessToken, RoomServiceClient, Room} from'livekit-server-sdk';

const createToken = (room,ident) => {
  // if this room doesn't exist, it'll be automatically created when the first
  // client joins
  const roomName = room;
  // identifier to be used for participant.
  // it's available as LocalParticipant.identity with livekit-client SDK
  const participantName = ident;

  const at = new AccessToken(process.env.LK_API_KEY, process.env.LK_API_SECRET, {
    identity: participantName,
  });
  at.addGrant({ roomJoin: true, room: roomName });

  return at.toJwt();
}

const app = express();
const port = 3000;

app.get('/getToken/:room/:ident', (req, res) => {
  res.send(createToken(req.params.room, req.params.ident));
});

app.get('/', (req,res) =>{
  res.send("all quiet on the western front");
});

app.get('/participants/:room', async (req, res) =>{
  const livekitHost = 'https://map-me-ascii-4bdqi7ia.livekit.cloud';
const roomService = new RoomServiceClient(livekitHost, process.env.LK_API_KEY, process.env.LK_API_SECRET);
const rooms = await roomService.listRooms();
if(rooms.some((r, i) => r.name == req.params.room)){
  const ress = await roomService.listParticipants(req.params.room);
  console.log(ress);
  res.send(ress);
}
else{
  res.send({"code": 404, "message": "Room not found"});
}
  
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})