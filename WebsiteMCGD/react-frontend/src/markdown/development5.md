## Saving/Loading Files

## JSON File Format

Example JSON file:

    {
        "points": 17,
        "missionName": "Apples in the Wind",
        "hasLost": false,
        "players": [
            "Suzie",
            "Adam",
            "Harold"
        ]
    }

Notable components:
- Names are always surrounded by quotes (the key)
    - Example: "points", "missionName"
- The entire JSON file is surrounded by {}
- Only Strings need "", numbers and booleans do not

## Accessing the Plugin Data Folder

- You need an instance of the JavaPlugin
    - The plugin variable works good here

1) Get the folder via plugin.getDataFolder()

2) If the folder isn't created, you must create it via:

        if(!dataFolder.exists()) {
            dataFolder.mkdirs();
        }

3) You should create a file within this folder via:

        File dataFile = new File(dataFolder.getAbsolutePath() + "/myfile.json");

        //to make sure the file exists

        if(!dataFile.exists()) {
            dataFile.createNewFile();
        }

4) Make sure the file creation is wrapped in a try-catch statement! (try catch is required when you are trying to save files, read files, or write to files)

        try {
            //... put code here
        } catch(IOException e) {
            e.printStackTrace();
        }

5) To save and read files, see below.

## Saving JSON files using the GSON Library

- To save JSON file, use the GSON library
- You need an instance of Gson first:

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

- Now you can create data via the JsonObject class:

        JsonObject data = new JsonObject();

        data.addProperty("NAME", "STRING VALUE");
        data.addProperty("NAME", true);
        data.addProperty("NAME", 1044);

- You can create lists via the JsonArray class (new JsonArray, then add to it)

- Save to a file via:

        FileWriter writer = new FileWriter(new File(FILE));
        gson.toJson(data, writer);
        writer.close();

- Make sure above is inside a try-catch statement

## Reading JSON files using the GSON Library

- To read a JSON file, use the JSON library
- You need an instance of Gson first:

        Gson gson = new GsonBuilder().setPrettyPrinting().create();

- Now you can get the JsonObject from gson:

        FileReader reader = new FileReader(new File("test.txt"));
        JsonObject data = gson.fromJson(reader, JsonObject.class);
        reader.close();

- Make sure above is inside a try-catch statement
- You can access specific values via the **data.get("NAME")** method. Example:

        String value = data.get("NAME").getAsString();