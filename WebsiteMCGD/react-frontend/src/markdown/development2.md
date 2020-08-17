## Commands

## What is a command?
* When player enters servers, they can type commands to do things for them.
* Example: **/help** will return a list of commands that are available to the player.
* Example: **/tp Bobby Cynthia** will teleport the player Bobby to the player Cynthia.

## Why use commands?
* Use commands when you want to do something when the player wants it to happen.
* AKA: when you don't use events, will a command work instead?
* Example use cases:
    * Teleport the player to another player after they type a command.
    * In SkyBlock, create a new island via **/skyblock new** or teleport to your island via **/home**. Teleport to the shops via **/shops**.
    * In Hypixel, you can create a party via the **/party** command, which allows you to invite specific players to play games with you.
* The player is given the freedom to execute the command whenever they please.

## How to register a command
* Spigot has a convenient interface to let you register a command easily.
* In the main class (the one that extends JavaPlugin), you register the command via:

        getCommand("nameofcommand").setExecutor(new CommandHandler());

* There's a couple things we can look at here, but for the sake of challenge 2, you can skip this explanation and look below for how to register your command arguments:
    * "nameofcommand" is the thing that the player will type after the slash.
    * Example: /help, /tp, /spawn, /home
    * Don't include the slash in the String.
* We need to register a new instance of something called **CommandHandler**. This is our custom class that will **implement CommandExecutor** so we can handle commands that are typed. Let's look on how we can do that:

## How to handle commands that are typed
* Now that you have the **/commandname** defined, you can do a few things based on what the player types afterwards, if at all.
* The **CommandHandler** class handles your command. It will look like this, and inherits one method from the interface:

        public class CommandHandler implements CommandExecutor {
            @Override
            public boolean onCommand(CommandSender commandSender, Command command, String label, String[] args) {

            }
        }

* There's a lot of parameters in this method, but we only typically care about 2.
* **CommandSender commandSender**:
    * This is the individual who typed in this command. In most cases, it is a Player, but it can also sometimes be the console (if the server types in a command)!
    * It is good to make sure the sender is a Player before using Player-only actions. We can do that using the **instanceof** keyword and via casting.
        * To check if the individual who sent the command is a player, we can add an if statement:

                if(commandSender instanceof Player) {}
        
        * If this is true, then the commandSender is a player, and we can now use Player methods safely. To access these methods, we have to **cast** the commandSender to a player. See one way of doing so below by creating a new variable:

                Player player = (Player) commandSender;
        
        * Now we can use this new **player** variable to do things like get the player's location, teleport the player, add items to their inventory, etc.
* **String[] args**:
    * This is the things that the player types after the command name, separated by spaces. If the player doesn't type anything, it is empty (length of 0).
    * Example: /tp Suzie Thomas
        * The command name is "tp"
        * There are 2 arguments (args). The args variable will hold: {"Suzie", "Thomas"}.
    * Usually, if you are creating a command that uses arguments, you should make sure that the player actually typed in any arguments. Otherwise, the plugin will crash!
        * Example: to check if the player typed in at least one argument, do:

                if(args.length > 0) {}
    * Remember if you are checking if a String is equal to something, you use the **.equals()** method, NOT ==
        * **equals** will only return true if the two Strings match exactly, including uppercase/lowercase. You can use **equalsIgnoreCase** instead to ignore the casing.
        
* The method returns a value. Typically, you would return true if the player typed a correct command, and return false if the player mistyped, and Spigot will automatically send an error message to the player. **Usually, you can just return true** and just send the player custom error messaages.

## Example implementation

* Example that will teleport one player to another player
* Assume the command has been registered in the onEnable method using the line:

         getCommand("tp").setExecutor(new CommandHandler());

* CommandHandler class:

* Notes:
    * The command will take two arguments: the name of the player that will be teleported (from), and the name of the player that will be teleported to (to).
    * There are multiple checks to make sure the args array is long enough, and to make sure the names typed are valid players.
    * The player who executed the command and the two players who were involved in the teleporting will be sent messages.

            public class CommandHandler implements CommandExecutor {

                @Override
                public boolean onCommand(CommandSender sender, Command command, String label, String[] args) {
                    if(sender instanceof Player) {
                        if (args.length < 2) {
                            sender.sendMessage("You need to specify who is to be teleported. Format: /tp <from player> <to player>");
                        } else {
                            String playerFromName = args[0];
                            String playerToName = args[1];

                            //will be set to null if the player name doesn't exist
                            Player playerFrom = Bukkit.getPlayer(playerFromName);
                            Player playerTo = Bukkit.getPlayer(playerToName);

                            if(playerFrom == null || playerTo == null) {
                                sender.sendMessage("One or more of those players do not exist!");
                            } else {
                                playerFrom.teleport(playerTo);
                                sender.sendMessage("You teleported " + playerFromName + " to " + playerToName + "!");

                                playerFrom.sendMessage("You were teleported to " + playerToName + "!");
                                playerTo.sendMessage(playerToName + " was just teleported to you!");
                            }
                        }
                    } else {
                        //sender is not a player
                        sender.sendMessage("You are not a player! You can't use this teleport command...");
                    }

                    return true;
                }
            }