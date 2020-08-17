import org.bukkit.*;
import org.bukkit.block.Sign;
import org.bukkit.command.CommandExecutor;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

public class MainClass extends JavaPlugin {

    private List<Location> signLocations = new ArrayList<>();

    @Override
    public void onEnable() {
        //register the CommandHandler class to listen to commands
        CommandHandler commandHandler = new CommandHandler();
        getCommand("wave").setExecutor(commandHandler);

        World world = Bukkit.getWorlds().get(0);
        signLocations.add(new Location(world, 11, 50, 0));
        signLocations.add(new Location(world, -11, 50, 0));
        signLocations.add(new Location(world, 0, 50, 11));
        signLocations.add(new Location(world, 0, 50, -11));

        commandHandler.wordVerifier = new WordVerifier() {
            @Override
            public boolean verifyWords(String word1, String word2) {
                if(word1 == null || word1.isEmpty() || word2 == null || word2.isEmpty()) {
                    Bukkit.broadcastMessage(ChatColor.RED + "Incorrect arguments were passed into the verifier! Are you sure word1 and word2 are not null?");
                    return false;
                }

                List<String> signWords = new ArrayList<>();
                List<String> passedWords = new ArrayList<>(Arrays.asList(word1, word2));

                for(Location loc : signLocations) {
                    if(loc.getBlock().getType() == Material.OAK_SIGN) {
                        Sign sign = (Sign) loc.getBlock().getState();
                        signWords.add(sign.getLine(0));
                    }
                }

                if(signWords.isEmpty()) {
                    Bukkit.broadcastMessage(ChatColor.RED + "The signs have not yet spawned!");
                }

                signWords.sort(new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        return o1.compareTo(o2);
                    }
                });

                passedWords.sort(new Comparator<String>() {
                    @Override
                    public int compare(String o1, String o2) {
                        return o1.compareTo(o2);
                    }
                });

                if(signWords.equals(passedWords)) {
                    Bukkit.broadcastMessage(ChatColor.GREEN + "The words matched!");
                    createMatchFile();
                    return true;
                } else {
                    Bukkit.broadcastMessage(ChatColor.RED + "The words did not match! Try again...");
                    return false;
                }
            }
        };
    }

    private void createMatchFile() {
        try {
            File matchFile = new File(getDataFolder().getParentFile().getAbsolutePath() + "/TeamChallengeMCGD/matched");

            if(!matchFile.exists()) {
                matchFile.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDisable() {

    }
}
