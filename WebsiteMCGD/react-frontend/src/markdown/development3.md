## Locations, Blocks and BukkitRunnable Timers

This week's topics cover some fundamental Minecraft concepts and how you can alter them with your own creativity. Additionally, we will learn a new way to execute actions (aside from Events and Commands).

## Accessing Player Location

To access the player location (and any living entity's location), we must be careful not to accidentally alter the player's location directly or risk glitchy behavior/accidentally kicking the player from the server for suspicion of hacking.

You must first get an instance of the Player. This can be found in many situations, such as through events like the **PlayerJoinEvent** or commands via casting the commandSender to a Player.

Now, you can access the location of the player via **getLocation()**, then you must call **.clone()** afterwards to not directly change the player's location. If you change the location directly after calling **getLocation()**, you will be changing the player's actual location and it will be usually detected as hacking/mods.

**Example method**:
* Set the block under the player to stone when they join the server

        //in the EventListener class...

        @EventHandler
        public void onJoin(PlayerJoinEvent event) {
            Player p = event.getPlayer();

            p.getLocation().clone().add(0, -1, 0).getBlock().setType(Material.STONE);
        }

## Minecraft Coordinate System

Minecraft uses an XYZ coordinate system to represent the blocks. X and Z go horizontally in the world, and Y goes up and down.

![Coordinate Example](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.minecraftintheclassroom.com%2Fuploads%2F1%2F1%2F6%2F2%2F11628361%2Fminecraft-coordinate-system_orig.png&f=1&nofb=1)

Note that coordinates are either going in a positive or negative direction. Up is positive y, while down is negative y, for example.

You can always see your current coordinate in-game by pressing F3, then looking at the top-left corner where it says **XYZ:**

![F3 Example](https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.wikihow.com%2Fimages%2Fa%2Faf%2FFind-Your-Coordinates-in-Minecraft-Step-3-Version-2.jpg&f=1&nofb=1)

In this example, the coordinates of the player are:

X: -315.459

Y: -68.5000

Z: -154.075

## Setting Blocks

To set a block, you must access the Block class via the Location class. Simply get a location, then call **.getBlock()**, then you can access the Block methods. The one we care about is **.setType(Material material)**, which we can use to set a block to anything we want.

Finally, to define a new Location, we can create a new Location instance and supply coordinates in the parameters. We need a World instance as well, which we can get via any existing location or any living entity.

**Example method**:
* Set 100 blocks from X=0 to 100, Y=100, Z=0 to diamond block.

        //within the CommandHandler class...

        @Override
        public boolean onCommand(CommandSender commandSender, Command command, String commandName, String[] args) {
            if(args[0].equalsIgnoreCase("setzeblocks")) {
                if(commandSender instanceof Player) {
                    Player p = (Player) commandSender;
                    World world = p.getWorld();

                    for(int x = 0; x <= 100; x++) {
                        //                          world, x, y, then z
                        Location loc = new Location(world, x, 100, 0);

                        loc.getBlock().setType(Material.DIAMOND_BLOCK);
                    }
                }
            }
            return true;
        }

## Block State

Block state is reserved for blocks that can change. A diamond block is always a diamond block, but blocks like a chest, for example, can be different. Even if it looks the same on the outside, different chests can each have different items within them, which is stored in Minecraft via "states".

To view all blocks that have states, look under the "All Known Subinterfaces" in this API link: [Interface BlockState](https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/BlockState.html). Click on each one to see methods that you can change for each state.

## Getting Block State to Fill a Chest

Let's look at the chest state for example. To access a block state, we first need the Block instance, which we get from a Location. Then, we will call **getState()** to get a BlockState instance. Finally, we must cast the BlockState instance to the type of block that it is so that we can access the chest-specific methods.

**Example**:

        //assuming the block at X:0, Y:0, Z:0 is a chest
        Chest chest = (Chest) new Location(world, 0, 0, 0).getBlock().getState();

Now, we can access chest-specific methods. See [Interface Chest](https://hub.spigotmc.org/javadocs/spigot/org/bukkit/block/Chest.html) for details, but we basically can now access the chest inventory to change the items in the chest.

**Example**:
* Add a stack of diamonds to the chest.

        //assuming the block at X:0, Y:0, Z:0 is a chest
        Chest chest = (Chest) new Location(world, 0, 0, 0).getBlock().getState();

        Inventory chestInventory = chest.getBlockInventory();
        chestInventory.addItem(new ItemStack(Material.DIAMOND, 64));

## BukkitRunnable, what is it?

Our current ways to execute actions:

1) Listen to an event, and execute actions as a response.
    * Example:
        * **Event:** PlayerJoinEvent 
        * **Action:** Send a message to the player, saying "Hi! Welcome to the server!"

2) Wait for the player to type a command, then execute actions as a response.
    * Example:
        * **Command:** Player types in /gimme diamonds
        * **Action:** The server gives the player 64 diamonds

3) The third most common way to execute actions is through **BukkitRunnable**

Essentially, BukkitRunnable allows us to do two distinct things:

1) We can run actions delayed. AKA we can run our actions after a few seconds, a few minutes, a few hours...

2) We can run actions periodically. AKA we can run actions over and over again every 2 seconds, 3 minutes, 1 hour...

## RunTaskTimer vs. RunTaskLater

The implementation can be slightly confusing for those who have never overrided classes within a method before. The general format is this:

        new BukkitRunnable() {
            @Override
            public void run() {
                //do something 1 second later
            }
        }.runTaskLater(plugin, 20L);

        or

        new BukkitRunnable() {
            @Override
            public void run() {
                //do something every 1 second
            }
        }.runTaskTimer(plugin, 0L, 20L);

Note that within the run() method, we will run everything we need to do.

Also note that we will call the method after the closing brackets. We can either call **runTaskLater** or **runTaskTimer**. Both methods need an instance of our main class, the JavaPlugin class. It is labeled as **plugin** in this case. An easy way to pass the JavaPlugin instance to any class that needs it is to pass it in the constructor of the class via a parameter and store it as a Java field variable. If this doesn't make sense to you, see the Helpful Code below for an example of such.

Format: runTaskLater(plugin, DELAY IN TICKS)

Format: runTaskTimer(plugin, DELAY IN TICKS BEFORE FIRST RUN, DELAY BEFORE RUNNING AGAIN IN TICKS)

* Ticks are simply the Minecraft way of counting time. 20 ticks = 1 second. Use this conversion to calculate how long you need to wait.

* The parameters require the **long** primitive type, not an **integer**. Simply put, a long is an integer that can store larger numbers. We denote a long via typing the letter **L** after the number.

* Finally, know that to cancel a timer event, you simply call **cancel()** within the run() method. The rest of the run method will run, but it will be the last time the run() method is called if **cancel()** is called!

## Helpful Code

**Example**:

* Give player a diamond every second after they join the server, up to 500 diamonds.


        public class EventListener implements Listener {

            //store plugin instance as a Java field
            private JavaPlugin plugin;

            //constructor, get the plugin instance and store it as the field
            public EventListener(JavaPlugin plugin) {
                this.plugin = plugin;
            }

            @EventHandler
            public void onJoin(PlayerJoinEvent event) {
                new BukkitRunnable() {

                //since this is essentially a custom class, we can create fields here as well that are accessible by the run() method
                //we will create a counter to count to 500
                private int count = 0; 

                    @Override
                    public void run() {
                        event.getPlayer().getInventory().addItem(new ItemStack(Material.DIAMOND));

                        //increment the count variable up by 1 and check if it is 500 or larger
                        count++;
                        if(count >= 500) {
                            //stop the timer from running again
                            cancel();
                        }
                    }
                }.runTaskTimer(plugin, 0L, 20L);
            }
        }
