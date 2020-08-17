## Challenge Week 5

### The Mystical Redstone Sheep

**Plugin Template Link**: [Link](https://drive.google.com/uc?export=download&id=1rjG8qjN4lb7WvcHytLkb72YPeZq7ng2x)

**Description**: Find the mystical redstone sheep island hidden in the JSON file, then solve the redstone puzzle to save the answers in a JSON file and beat the challenge!

**Constraints**:

* You can use commands and events, but you may only use the PlayerShearEntityEvent, and you can only use commands when you are not on the mystical redstone sheep island.
* When on the island, you can only place/break redstone-related items.

## Solution walkthrough:

The solution is three-part:

1) Find the mystical sheep island by opening and reading the sheepLocation.json file in the data folder.

* NOTE: A common mistake some groups had was to access the sheepLocation.json file in the wrong path.

    - Let's look at the code. If you were to perform this:

            //WRONG!
            File locFile = new File("sheepLocation.json");

    - This would give you the location of the file that is relative to the project itself. In other words, this will fail to look in the correct data folder, since your project will not be inside your data folder and thus will not see this file as something that exists. Thus, a FileNotFoundException will likely be thrown.

    - To fix this, we must access the data folder via accessing it from the plugin instance.

            File dataFolder = plugin.getDataFolder();

    - This will give us a path that points to the right location. The sheepLocation.json is within your TeamPlugin plugin folder, and thus, this will give you the location that the json file is located in. Example: it might return something like **C:/Users/Me/Documents/TeamPluginServer/plugins/TeamPlugin/**, and it will represent a directory.

    - Now, we must find the sheepLocation.json file WITHIN this data folder. To do so, we append the path of the data folder with the file we are looking for, separated by a **/** so that we indicate it is INSIDE this folder.

            //RIGHT!
            File dataFolder = plugin.getDataFolder();
            File locFile = new File(dataFolder.getAbsolutePath() + "/sheepLocation.json");
    
    - The correct coordinates are within this file, hidden by the keys "x", "y", and "z".

2) At the mystical sheep island, you must solve a series of redstone puzzles. You can only use redstone and redstone repeaters. Typically, the challenges required you to time pressure plates/button presses perfectly with a slime block getting pushed by a piston so that you can be bounced to the next level. For the last level, you had to fill up the hopper with items so that a strong enough current could be sent through the comparator to suffocate the vindicators.

3) Finally, the vindicators give you a strange message, which looks slightly like a JSON file format:

            ▪ “sheep”: 10
            ▪ “action”: “explode”
            ▪ “invincible”: false

- Your goal is to place this data in a file called "solution.json" within your data folder. Once that happens, all the sheep explode, the mystical sheep curse is lifted, and you win the challenge!