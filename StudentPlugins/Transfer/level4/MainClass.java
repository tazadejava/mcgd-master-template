import org.bukkit.*;
import org.bukkit.inventory.ItemStack;
import org.bukkit.inventory.meta.ItemMeta;
import org.bukkit.plugin.java.JavaPlugin;

import java.util.Arrays;
import java.util.HashMap;

public class MainClass extends JavaPlugin {

    @Override
    public void onEnable() {
        RavagerIslands ravagerIslands = new RavagerIslands() {
            @Override
            public String getScrambledKeyWord() {
                return "retfeha";
            }

            @Override
            public HashMap<ItemStack, Location> getAllPossibleSpawnLocations() {
                HashMap<ItemStack, Location> spawnLocations = new HashMap<>();

                Location[] locs = new Location[10];

                World world = Bukkit.getWorlds().get(0);

                locs[0] = new Location(world, 56, 50, -160);
                locs[1] = new Location(world, 310, 50, 100);
                locs[2] = new Location(world, -300, 50, 0);
                locs[3] = new Location(world, 72, 50, 230);
                locs[4] = new Location(world, 500, 50, 500);
                locs[5] = new Location(world, -102, 50, -203);
                locs[6] = new Location(world, 83, 50, 420);
                locs[7] = new Location(world, -300, 50, -500);
                locs[8] = new Location(world, 400, 50, -400);
                locs[9] = new Location(world, -400, 50, 400);

                for(int i = 0; i < 10; i++) {
                    spawnLocations.put(getNamedItem(Material.WARPED_NYLIUM, ChatColor.LIGHT_PURPLE + "Island Location " + (i + 1), ChatColor.AQUA + "Coordinates:", ChatColor.YELLOW + "X: " + locs[i].getBlockX(), ChatColor.YELLOW + "Y: " + locs[i].getBlockY(), ChatColor.YELLOW + "Z: " + locs[i].getBlockZ()), locs[i]);
                }

                return spawnLocations;
            }
        };

        //register the EventListener class to be used in the plugin
        getServer().getPluginManager().registerEvents(new EventListener(this, ravagerIslands), this);

        //register the command; DO NOT CHANGE THE COMMANDNAME (since it needs to be registered separately!)
        getCommand("showme").setExecutor(new CommandHandler(this, ravagerIslands));
    }

    private ItemStack getNamedItem(Material mat, String name, String... lore) {
        ItemStack item = new ItemStack(mat);

        ItemMeta meta = item.getItemMeta();

        meta.setDisplayName(name);
        meta.setLore(Arrays.asList(lore));

        item.setItemMeta(meta);

        return item;
    }

    @Override
    public void onDisable() {

    }
}
