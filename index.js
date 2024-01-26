const express = require('express');
require('./connection/db_connection');
const Player = require('./models/playerSchema')
const handleErrors = require('./utils/handleErrors')
const app = express();
const port = 3000;

app.use(express.json());

app.get('/roll-dice', (req, res) => {
    try {
      const outcome = Math.floor(Math.random() * 6) + 1;
      
      return res.status(200).json({
        status: true,
        outcome: outcome,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      return res.status(400).json({ status: false, errormessage: 'Invalid input or missing required fields.' });
    }
  });
  

app.get('/allplayers', async (req, res) => {
    try {
      const players = await Player.find({}, '-__v');
      
      const playersDetails = players.map((player) => ({
        player_id: player._id,
        player_name: player.player_name,
        health: player.health,
        strength: player.strength,
        attack: player.attack,
        created_at: player.createdAt,
        updated_at: player.updatedAt,
      }));
  
      return res.status(200).json({
        status: true,
        players: playersDetails,
      });
    } catch (error) {
      return handleErrors(error, res);
    }
});
  

app.get('/players/:player_id', async (req, res) => {
    try {
      const player = await Player.findById(req.params.player_id);
  
      if (!player) {
        return res.status(404).json({ status: false, errormessage: ['Player not found.'] });
      }
  
      return res.status(200).json({
        status: true,
        player_id: player._id,
        player_name: player.player_name,
        health: player.health,
        strength: player.strength,
        attack: player.attack,
        created_at: player.createdAt,
        updated_at: player.updatedAt,
      });
    } catch (error) {
      return handleErrors(error, res);
    }
});


app.post('/players', async (req, res) => {
    try {
      const { player_name, health, strength, attack } = req.body;
      const player = await Player.create({
        player_name,
        health,
        strength,
        attack,
      });
  
      return res.status(201).json({
        status: true,
        player_id: player._id,
        player_name: player.player_name,
        health: player.health,
        strength: player.strength,
        attack: player.attack,
        created_at: player.createdAt,
        updated_at: player.updatedAt,
      });
    } catch (error) {
        return handleErrors(error, res);
    }
});


app.put('/calculate-damage', async (req, res) => {
    try {
      const { attacker_id, defender_id, attacking_dice_outcome, defending_dice_outcome } = req.body;
  
      const attacker = await Player.findById(attacker_id).select('-__v');
      const defender = await Player.findById(defender_id).select('-__v');
  
      if (!attacker || !defender) {
        return res.status(404).json({ status: false, errormessage: ['Attacker or defender not found.'] });
      }
      
      const damagecreatedbyattacker = (attacking_dice_outcome*attacker.attack);
      const damagedefendedbydefender = (defending_dice_outcome*attacker.strength);
      const damage =  damagecreatedbyattacker - damagedefendedbydefender;
      defender.health = (damage>0)?(defender.health-damage<=0)?0:defender.health-damage:defender.health;
      
  
      // Save changes
      await attacker.save();
      await defender.save();
  
      return res.status(200).json({
        status: true,
        players: [
          JSON.parse(JSON.stringify(attacker)),
          JSON.parse(JSON.stringify(defender)),
        ],
      });
  
    } catch (error) {
        console.log(error)
      return res.status(400).json({ status: false, errormessage: 'Invalid input or missing required fields.' });
    }
  });


app.listen(port,()=>{
    console.log(`server listening at http://localhost:${port}`)
})
