## Minecraft UI

Minecraft User Interfaces, commonly referred to as UI, is a way to send information to the player. Additionally, in some cases, it allows us to receive information from the player to do specific actions!

Examples of the types of UI available in Minecraft:

* **Chest UI:** show an inventory, and allow the player to click on items to traverse menus
* **Boss Bar UI:** edit the boss bar title on the top of the screen to give the player information and possibly a progress bar
* **Scoreboard UI:** edit the sidebar text to give the player easily-readable information
* **Title UI:** make announcements through the Title UI, which will overlay text on the player's screen
* **ActionBar UI:** show text near the bottom of the screen, but above the name of the item that the player is scrolling at
* **Armor Stand UI:** set armor stands to have displaynames, then place them in places in the world with invisibility to make it look like floating text
* **Map UI:** you are allowed to draw over a map to put whatever you want, and you can easily paste images onto maps to create banners (128x128 pixels)
* **Chat UI:** you can send messages to players, broadcast messages to all players, and even interact via commands and chatting in the chatbox!
* **Block UI:** simply create blocks that spell out something for the player. common and easy to see.

## Example Implementations:

### Adding color to messages

* Use the ChatColor enum

Example:

        String yellow = ChatColor.YELLOW + "This is yellow!";

* For bold/italics/magic/etc with a color, you must put it AFTER the color. Also, put an empty String before the first ChatColor to cast it all automatically to a String, otherwise it will error.

Example:

        String boldedBlue = "" + ChatColor.BLUE + ChatColor.BOLD + "THIS IS BOLDED BLUE!!!";

### Chest UI

* You need to register a command to open the UI, and an event to register when the UI is clicked
* Command:

        Inventory inv = new Bukkit.createInventory(*NAME OF INVENTORY*);
        inv.addItem(...);
        //recall that you create items via: new ItemStack(Material.*NAMEOFITEM*)        

        player.openInventory(inv);

* Event:

        Event: InventoryClickEvent

        can call event.getCurrentItem() to get the item that was clicked

                NOTE THAT IT CAN BE NULL: CHECK FIRST
        
        To get the material of what was clicked, AFTER CHECKING IF NOT NULL,
                
                event.getCurrentItem().getType()

### Boss Bar UI

* BossBar class, create via

        Bukkit.createBossBar(NAME, BARCOLOR, BARSTYLE)
* Show to player via
        
        bossBar.addPlayer(...);

### Scoreboard UI

* Create scoreboard class

        Scoreboard scoreboard = Bukkit.getScoreboardManager().getNewScoreboard();

* Create sidebar via the Objective class

        Objective sidebar = scoreboard.registerNewObjective(HIDDEN_NAME, "dummy", DISPLAYNAME);
        sidebar.setDisplaySlot(DisplaySlot.SIDEBAR);

* Add scores via

        sidebar.getScore("NAME").setScore(INTEGER VALUE);

* Show to player via

        player.setScoreboard(scoreboard);

## Arrays, Lists, and HashMaps

* Three ways to represent and store data for Minecraft
* Most of you guys are probably familiar with arrays:

        int[] test = new int[5];
        int[] test2 = new int[] {1, 2, 3};

        System.out.println(test2[0]); //outputs 1
        System.out.println(test.length); //outputs 5

* The two data structures that may be new to many of you is the **List** and **HashMap**

### List

* Similar to array, but you do not have to specify the size of the array
* It can get as big as you want it to be
* Important note: you must use the capital-letter version of primitive java types (ex: int -> Integer, char -> Character), or they will not work.

* Syntax:

        List<String> list = new ArrayList<>();

* Adding to the list:

        list.add("Hi");

* Removing from the list:

        list.remove("Hi");

* Getting index 0 from the list:

        list.get(0);

* Clearing the list:

        list.clear();

* Looping the list using a for-each loop:

        for(String str : list) {}

* Looping the list using a basic for loop:

        for(int i = 0; i < list.size(); i++) {
            String str = list.get(i);
        }

### HashMap

* Special type of data that allows you to store "key-value" pairs
* Basically, lets you attach values to things
    * Example: store player scores in a HashMap. The players are keys, and the scores are the values
* Note that there can only be one score for each player. In other words, the keys must be unique, but the values do not have to be unique.

* Syntax:

                //key   //value
        HashMap<Player, Integer> scores = new HashMap<>();

* Adding to the list:

        scores.put(player, 0);

* Checking if a player exists:

        scores.containsKey(player)

* Incrementing the score by one, assuming the player exists in the scores HashMap:

        scores.put(player, scores.get(player) + 1);

* Looping the HashMap using a for-each loop:

        for(Player p : scores.keySet()) {}

* Note that you cannot use a basic for loop to traverse a HashMap!