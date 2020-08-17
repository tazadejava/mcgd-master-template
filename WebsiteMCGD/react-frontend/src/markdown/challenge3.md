## Challenge Week 3

### Timing is Everything

**Plugin Template Link**: [Link](https://drive.google.com/uc?export=download&id=1Y8Sg7VoocwTiik5FLW-1zTNww7qe1QZK)

**Description**: Use Minecraft events and/or commands to get all players to the winning beacon platforms without dying!

**Constraints**:

* General constraints: you can't set op/gamemode status to fly. 
* NOTE: this challenge will be more restrictive to encourage using new solutions: 
    * no changing difficulty
    * no flying of any kind (including elytras)
    * no potion effects can be given to players through code
    * you cannot give the player items and must place items in the respective chests to give items

## Example solutions:

### Wave 1:

Task: get across the bridge, but there's arrows flying in both directions

Solution: give the players shields in the chest via accessing the chest inventory, then walk side by side, across the bridge, facing the arrow storm so that all arrows are bounced off your shields. this solution requires 2+ players to succeed!

![Shield pairing](https://i.postimg.cc/pTgrgy7p/2020-07-29-22-16-48.png)

### Wave 2:

Task: parkour across the arena, but there's piglins that are constantly spawning to hit you off. Your armor also disappears over time!

Solution: piglins do not attack you when you are wearing gold armor, so run a BukkitRunnable taskTimer to constantly put gold armor on all players, then you can simply parkour to get to the other side safely!

![Gold armor solution](https://i.postimg.cc/W12zRB96/2020-07-29-22-11-07.png)