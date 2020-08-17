## Challenge Week 1

### Cross the Bridge

**Plugin Template Link**: [Link](https://drive.google.com/uc?export=download&id=1Fw8trvUGky50d5GMEjSr87pdZzHxem1t)

**Description**: Simply get to the other side of the bridge.

**Constraints**: General constraints: you can't set op/gamemode status to fly.

### Featured Solutions

#### Wool Bridge Solution

![Wool Bridge](https://i.postimg.cc/4NC2tWvf/woolbridge.png)

**Event**: PlayerMoveEvent
* Called whenever a player moves (translation or rotation; either they will move around the map or look around the map)

**Action**: Place wool block underneath the player, if it is air
* Essentially, obtain the location of the player, look at the block underneath, and check the type of the block. If it is air, set it to wool.

#### Implementation:

Teacher Notes:

* You can reach the player location via event.getPlayer().getLocation()
* To look at a block that is close to the player location, you must first .clone() it! This ensures that you do not directly change the player's location
* Then, you can use the add(double x, double y, double z) method to find a block relative to this location
* In this case, we are looking at y-1, which is the block below the player
* Then, we can get the block by calling .getBlock(), and we get the type of the block at this location by calling .getType()
* Remember that .getType() returns a Material ENUM, which is just a way for us to label things with words. In this case, we are checking if the type is == Material.AIR

        public class EventListener implements Listener {
            @EventHandler
            public void onPlayerMove(PlayerMoveEvent event) {
                
                if (event.getPlayer().getLocation().clone().add(0, -1 , 0).
                        getBlock().getType() == Material.AIR) {
                    //if the block is air, then set it to WHITE_WOOL via the .setType() method
                    event.getPlayer().getLocation().clone().add(0, -1, 0).
                        getBlock().setType(Material.WHITE_WOOL);
                }
            }
        }

#### Bow Teleportation Solution

![Bow Teleport](https://i.postimg.cc/jdJvSPBp/bow-teleportation.gif)

**Events**: EntityShootBowEvent and ProjectileHitEvent
* EntityShootBowEvent is called whenever someone shoots a bow. This can be the player, a skeleton, etc.
* ProjectileHitEvent is called whenever a projectile, such as an arrow, fireball, etc. hits something, whether it be an entity or a block.

**Action**: Teleport the player to the arrow when it lands
* First, store the player who shot the arrow in the EntityShootBowEvent
* Then, teleport the player who shot the bow in the ProjectileHitEvent

#### Implementation:

Teacher Notes:
* While this is a very creative solution given the time constraint of our first class, it's not the most ideal solution as it will not work in a few circumstances:
    * Essentially, if two or more players shoot the bow before an arrow lands, the player who most recently shot the arrow gets teleported, since we only store one Entity as a field.
    * Also, the location does not need to be stored as a field, and it can be stored as a local variable instead, since it is only accessed once.
* Regardless, I was impressed by how quickly the group member was able to create this solution. It may look simple, but it covers a lot of important and complicated concepts.

        public class EventListener implements Listener {

            private Entity player;
            private Location location;

            @EventHandler
            public void onShoot(EntityShootBowEvent event) {
                player = event.getEntity();
            }

            @EventHandler
            public void onProjectileHit(ProjectileHitEvent e) {
                if (e.getEntity().getType() == EntityType.ARROW) {
                    location = e.getEntity().getLocation();
                    player.teleport(location);
                }
            }
        }

Misc. Notes:
* If you wanted to implement a more stable version of this teleportation technique, one such way to do so is to store a HashMap<Entity, Entity> that will store the key as the entity that shot the arrow and the value as the projectile itself. See [HashMap](https://www.w3schools.com/java/java_hashmap.asp) for an explanation of this data structure.
* Another way to do this is to attach the shooter to the entity itself through something called Metadata. Metadata basically can label specific entities with information, and this information can be retrieved later for however long the entity still exists. See [Metadata](https://bukkit.org/threads/tutorial-metadata-what-it-is-and-how-to-use-it.276338/) for a brief overview.