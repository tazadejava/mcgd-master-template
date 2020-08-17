## Basic Plugin Structure

## What is a plugin?
* Allows you to "interface" with Minecraft!
* It opens up basically everything that Minecraft can do in Vanilla mode and lets anyone modify the actions that occur afterwards
* Essentially, we can "listen" into specific events in the game and change the outcomes 
* **Example:** when a diamond ore is dug, then we will spawn 10 zombies behind the player
    * **Event** that we are listening to: digging a diamond ore block
    * **Action** that we are modifying: spawn 10 zombies behind the player
* **Example:** when the player joins the world, then we will clear their inventory, give them a wooden sword, and teleport them to the middle of an arena
    * **Event**: player joins the world
    * **Action**: 3 things happen
        * We clear their inventory
        * We give them a wooden sword
        * We teleport them to a different location

## Basic plugin development environment
* We will use **IntelliJ IDEA** to help us code the plugin in Java.
* We will use a library called **Spigot**. This gives us a relatively easy way to create plugins, as Spigot will give us many methods and classes that we can use to find events and create new actions quickly.
* We will be using something called **Maven** to organize our project. Basically, you can think of it as a personal assistant that will take care of all the dirty work for you when creating a plugin.
    * Maven will automatically find this Spigot library for you and download it into the project.
    * Additionally, when you want to put your plugin in a Minecraft server, Maven will package your project up into a .jar file so that it can be used in a server.
## Important plugin classes
### MainClass.java

* Essentially, this class is our entrance key into Minecraft. It will let us "hook" the plugin into any parts of Minecraft that we choose. In this case, we have one particular line that will connect us to the EventListener.java class and let us listen into any event that occurs in Minecraft.
* The onEnable method is called when the server starts, and the onDisable method is called when the server stops.
* Generally, we register/hook anything we need to do in the onEnable method, and if needed, we will clean up anything we did in the onDisable method.

### EventListener.java

* This class allows us to hook into any event that we want! The docs are very helpful here to understand what exactly we can listen to. Take, for example, the org.bukkit.event.entity package at https://hub.spigotmc.org/javadocs/spigot/org/bukkit/event/entity/package-summary.html. We can see the list of events that we can listen into that are related to entities.
* Recall that an entity is essentially anything in Minecraft that isn't a block. A general rule of thumb is that all monsters, animals, and other living things are entities, but that doesn't mean they are the only entities that can exist.
* To create a new event, we must first create the annotation "@EventListener" above the method. Then, we define the method via the definition:
    * public void onEVENT(EVENT event) {}
        * Where EVENT is the class that we want to listen to. Example: EntityDeathEvent is a class that we can listen to, and it will run everytime an entity dies.
    * Remember that we can call event.METHOD to access anything related to that event. Note that we are accessing a Java instance of the event that allows us to see and modify Minecraft using these methods. 