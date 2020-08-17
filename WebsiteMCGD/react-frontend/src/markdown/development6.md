## Item Meta

* Item Meta allows you to change an item's name, lore, or special effects
* This allows you to put enchantments on items, create custom splash potions, etc.

## General Item Meta formula:

1) Create an ItemStack for an item that you want to change.

2) Create an object, ItemMeta, via retrieving it from the ItemStack instance from item.getItemMeta()

3) Modify this ItemMeta object to your desire.

4) Set the ItemStack's ItemMeta to this modified ItemMeta via item.setItemMeta(META OBJECT)

5) Give the ItemStack to the player, drop it, etc! You're done!

## How to set an item's Display Name and Lore

![Example Display Name, Lore, and Enchantment](https://i.postimg.cc/1tnTZJ3q/example-display-name-lore-and-enchantment.png)

* Following the pattern above, we will create a new ItemStack, pull the ItemMeta from this item, then modify the display name and lore to make a special item.

        //create our item!
        ItemStack item = new ItemStack(Material.NETHERITE_SWORD);

        //get the ItemMeta
        ItemMeta meta = item.getItemMeta();

        //set displayname
        meta.setDisplayName(ChatColor.LIGHT_PURPLE + "My Special Sword");

        //lore has to be set via passing in a List instance! Remember lists are like arrays, but they can be any size.
        List<String> lore = new ArrayList<>();
        lore.add(ChatColor.BLUE + "This is my special sword.");
        lore.add(ChatColor.RED + "Not yours!");
        meta.setLore(lore);

        //finalize by setting the item's ItemMeta!
        item.setItemMeta(meta);

        //give to the player
        p.getInventory().addItem(item);

## How to add enchantments

* Very similar to above example. After you get the ItemMeta, simply call

        meta.addEnchant(Enchantment.ENCHANTMENT, POWER, BREAK_LEVEL_CAP);

* Enchantment is an enum, like the Material class

* POWER is an integer from 1+

* The level cap is vanila Minecraft caps on enchantments. For example, Sharpness can only reach level 5.
    
    * You can break this level cap by passing in "true" for the third argument in this method. This allows you to put Sharpness 100, for example

## How to set Potion Effects:

* First, create an ItemStack for an object that can have a potion effect. Example: Material.SPLASH_POTION

* Now, we can CAST the ItemMeta to PotionMeta so that we can add potion effects. See the whole list of possible casts here (Look under **All Known Subinterfaces**): [List of subclasses of ItemMeta](https://hub.spigotmc.org/javadocs/spigot/org/bukkit/inventory/meta/ItemMeta.html)

        //create splash potion item
        ItemStack item = new ItemStack(Material.SPLASH_POTION);

        //we need to CAST the ItemMeta to a PotionMeta so that we can access the potion methods
        PotionMeta meta = (PotionMeta) item.getItemMeta();

        //we can add a potion effect now! The last boolean true is if we want to override the player's current potion effect
        meta.addCustomEffect(new PotionEffect(PotionEffectType.REGENERATION, 100, 1, true), true);

        item.setItemMeta(meta);
        
        p.getInventory().addItem(item);