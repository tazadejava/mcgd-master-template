## Challenge Week 2

### Mission Codewords

**Plugin Template Link**: [Link](https://drive.google.com/uc?export=download&id=12m2rcWmYH_woSbCupXQjAeXf_ad7bDm1)

**Description**: Implement Minecraft commands to survive the apocalyptic waves and successfully deliver the correct codewords to the server!

**Constraints**: General constraints: you can't set op/gamemode status to fly.

### Featured Solutions

#### Wave 1
#### Difficulty: Peaceful

![Challenge 2 map](https://i.postimg.cc/J7bWF3MQ/2020-07-20-19-11-08.png)

A very simple yet very effective solution to the first wave is to simply set the difficulty of the world to Peaceful. Then, the zombies can't spawn, and you can just walk over to the signs without any interruption! Nice job to the groups that ended up thinking of and employing this strategy.

#### Implementation:

Teacher Notes:

* Remember that if you don't know where something is, you have to consider all the classes that it can be associated with. In this case, the difficulty of a world is tied to the [World](https://hub.spigotmc.org/javadocs/spigot/org/bukkit/World.html#setDifficulty(org.bukkit.Difficulty)) class, and an instance of the world class can be found by accessing any [Player](https://hub.spigotmc.org/javadocs/spigot/org/bukkit/entity/Entity.html#getWorld()) that is currently on the server. You can access the player via a casting of the commandSender to Player, as discussed in class.

        public class CommandHandler implements CommandExecutor {

            //...challenge-specific comments hidden...

            @Override
            public boolean onCommand(CommandSender commandSender, Command command, String commandName, String[] args) {
                if (args.length == 1 && args[0].equals("zombie")) {
                    if (commandSender instanceof Player){
                        Player p = (Player) commandSender;
                        p.getWorld().setDifficulty(Difficulty.PEACEFUL);
                    }
                }

                if(args.length == 3 && args[0].equals("verify"))
                {
                    wordVerifier.verifyWords(args[1], args[2]);
                }
                return true;
            }
        }

#### Wave 2
#### Elytras and Firework Rockets 

![Example wave 2 solution](https://i.postimg.cc/W3gxQjL4/2020-07-20-19-13-22.png)

One group took a simple approach to a difficult problem and gave the player vanilla items to beat the challenge. Since the entire floor eventually burned away from fire, the players were able to just use the Minecraft elytra and firework rockets to fly around and read the signs from above.

#### Implementation:

Teacher Notes:

* Notice that the group has 3 different **if** sections, one for each of "verify", "zombie", and "fire".
    * Also note that since the if statements for "zombie" and "fire" do not check for if the argument exists, then this program will crash if anyone types in **/wave** without any arguments. To prevent this crash, check if the argument exists before accessing args[0] via

            if(args.length > 0 && args[0].equals("zombie")) {...}

* One way to give items to players is to get the World instance of where the player is, then drop an item where the player is currently located. If you want to directly add the item to a player's inventory, you can access the inventory via the player method getInventory(), then call addItem(item) to add it to the player's inventory.

        public class CommandHandler implements CommandExecutor {

            //...challenge-specific comments hidden...

            @Override
            public boolean onCommand(CommandSender commandSender, Command command, String commandName, String[] args) {
                if (args.length == 3 && args[0].equals("verify")) {
                    wordVerifier.verifyWords(args[1], args[2]);
                }
                if (args[0].equals("zombie")) {
                    if (commandSender instanceof Player) {
                        Player p = (Player) commandSender;
                        ItemStack totem = new ItemStack(Material.TOTEM_OF_UNDYING, 64);
                        p.getWorld().dropItem(p.getLocation(), totem);
                    }
                }
                if (args[0].equals("fire")) {
                    if (commandSender instanceof Player) {
                        Player p = (Player) commandSender;
                        ItemStack totem = new ItemStack(Material.TOTEM_OF_UNDYING, 64);
                        ItemStack elytra = new ItemStack(Material.ELYTRA, 1);
                        ItemStack firework = new ItemStack(Material.FIREWORK_ROCKET, 64);
                        ItemStack water = new ItemStack(Material.ENCHANTED_GOLDEN_APPLE, 64);
                        p.getWorld().dropItem(p.getLocation(), totem);
                        p.getWorld().dropItem(p.getLocation(), elytra);
                        p.getWorld().dropItem(p.getLocation(), firework);
                        p.getWorld().dropItem(p.getLocation(), water);
                    }
                }
                return true;
            }
        }