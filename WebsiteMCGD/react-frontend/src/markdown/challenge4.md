## Challenge Week 4

### Ravager Islands

**Plugin Template Link**: [Link](https://drive.google.com/uc?export=download&id=12MuNYCxvoHl6s9FS1q_cvpSK6qmlAez8)

**Description**: Use Minecraft events and/or commands to find and defeat the ravager! The ravager can only be hurt using one item... what can it be?

**Constraints**:

* General constraints: you can't set op/gamemode status to fly.
* You also cannot change game difficulty.
* Finally, you cannot send player messages using sendMessage, broadcastMessage, nor use System.out.print.
* Like in challenge 2, you will not be given the MainClass, but it will be supplied after you upload the other 3 java files.

## Example solutions:

To find the ravager, you can implement a Chest UI that will take in the HashMap ItemStacks and show them via the addItem method to the player. When the player clicks on an item, you can check if that item exists in the HashMap, and if so, teleport the player to the location tied to that ItemStack in the HashMap.

To find the scrambled word, you can implement a variety of UIs to tell the player the scrambled word. One such way is to implement a boss bar and show the player the scrambled word, which is "retfeha".

The answer is "feather", which is the only item that can kill the ravager.

To get to the ravager island from the main island, you can simply give the player blocks to go over. To kill the blazes that are in the way, you can give the player armor and a sword, or simply give the player infinite health via potion effect or setting their max health to a very high number (ex: 100000).