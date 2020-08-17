## How to make a Spigot Server

* Spigot is in charge of both helping you create a server and create a plugin. Crazy, isn't it.
* To make a server, you only need two files: the jar file that will initialize your server, and a BAT/sh file, depending if you're on Windows/Mac, to run the server.

1) Instead of using spigot directly, we will use something called **Paper**. This builds upon Spigot's base code and makes it more optimized so that your server will run faster. 
    * To download the latest version of Paper, go here: [Link](https://papermc.io/downloads)
    * Click on the latest Build and download the jar file
    * Rename the file to **paper.jar** and place it in an empty folder.

2) Now, you must create the thing that will run the jar file for you.

* If you are on Windows, create a new text file and put this inside:
    
      java -server -Xms1G -Xmx2G -jar paper.jar nogui

    * "paper.jar" is the jar name that you just downloaded
    * 1G and 2G is the lowest and highest amount of RAM you are giving to your server to let it run. Typically, 1-2 gigabytes is good, but if you don't have as much, adjust accordingly.
        * G = gigabyte
        * M = megabyte (ex: 512M)
    * Finally, save the file and **change the file extension** to **.bat**. Typically, you can name it something easy to remember like **RUN.bat**
    * To start the server, double-click on the .bat file.

* If you are on Mac, the process is very similar. Create a new text file and put this inside:
    
      java -server -Xms1G -Xmx2G -jar paper.jar nogui

    * "paper.jar" is the jar name that you just downloaded
    * 1G and 2G is the lowest and highest amount of RAM you are giving to your server to let it run. Typically, 1-2 gigabytes is good, but if you don't have as much, adjust accordingly.
        * G = gigabyte
        * M = megabyte (ex: 512M)
    * Finally, save the file and **change the file extension** to **.command**. Typically, you can name it something easy to remember like **RUN.command**
    * To start the server, double-click on the .command file.
    * If the .command file is not executing and it is just opening as a text file, you may need to add "execute" permissions to run it. On a Mac, try [Link](https://support.apple.com/guide/terminal/make-a-file-executable-apdd100908f-06b3-4e63-8a87-32e71241bab4/mac). If this step is confusing, try doing step 2 and on from this website instead: [Link](https://www.spigotmc.org/wiki/spigot-installation/#mac-os-x).

3) Before the server can run, it will most likely make you accept the EULA agreement. Open eula.txt and change false to true, then rerun the server.

4) Let the server load, and it will finish when it says something like Done (XXXs).

5) Your server is now ready! You can join it by direct connecting to **localhost** if you are using the same computer to play Minecraft.

6) To stop the server, simply type **stop** in the console.

7) (unrecommended) If you want to reload plugins that you just added to the plugins folder quickly, type **reload** into the console. Typically, you should avoid this command on a normal basis since it can make some things stop working, but it is faster than stopping and starting a server all over again.

***

## How to load your plugin

* In IntelliJ, you will be using Maven to package your project into a .jar file so that you can load it into your server.
* Notice that after your server starts, you will have a folder named **plugins**. This is where you will copy-paste your .jar plugin file to load it into the server.

1) Start with your server offline. Go to your project in IntelliJ, and on the right-side of the screen, there should be a few tabs, one of which called Maven. Click Maven.

2) Expand the Lifecycle folder, then double click on **package**. This will automatically build and package your project into a jar if there are no errors.

3) If it says BUILD SUCCESS, it is complete! The jar is in the **target** folder inside your project folder. Copy and paste this jar file into the **plugins** folder of your server.

4) Now, start your server, and your plugin should load. That's it!

* Note that you will either have to restart your server everytime you change your plugin, or use the **reload** command, which is not that safe but OK if you are just testing.

***

## How to load external plugins

* Typically, you can find user-made plugins from https://dev.bukkit.org/bukkit-plugins or https://www.curseforge.com/minecraft/bukkit-plugins

1) Download the .jar file for the appropiate Minecraft version. Typically, this will be the newest .jar.

2) Your server folder should have a folder called plugins. If not, run the server and let it load, then stop it again.

3) Drag the .jar file into the plugins folder.

4) Start the server. You're done!

***

## How does the MCGD class load plugins so quickly? (optional)

* We use a series of optimization techniques to load plugins onto your group's server as fast as possible. If you want to understand how this works, read a brief outline below:

1) You upload your code onto the server.

2) The webserver downloads the code and places it into a project folder.

3) A verifier is run to ensure that the code is not doing anything prohibited (like changing gamemode).

4) If the verifier passes, then the Maven package is called, and if there are errors, print to the website log.

5) If there are no errors, then we copy the jar file from the project folder to the group server.

6) Instead of restarting the server, we use a plugin called **PlugMan** that can reload plugins with a simple command instead of reloading the entire server.

7) There is a custom plugin that is on all group servers called **AutoPluginReload** that will automatically call PlugMan to reload the plugin if it notices that a jar file has been replaced.

8) The plugin is loaded onto the server, and you can now use it! Success!