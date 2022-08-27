/// Generates the data by quering the Modrinth Search API

interface Mod {
  title: string;
  description: string;
  downloads: number;
  follows: number;
}

// Gets mods from the modrinth search api. Returns a JSON object with { hits: [{...}, ...] }.
// If hits is less than 100, the following page has no more mods.
async function grabData(page = 0): Promise<{ hits: Mod[] }> {
  const res = await fetch(
    `https://api.modrinth.com/v2/search?limit=100&offset=${page * 100}`,
  );
  const data = await res.json();
  return data;
}

// Grab all of the data from modrinth
async function getAllData(): Promise<Mod[]> {
  let data: Mod[] = [];
  let page = 0;
  while (true) {
    console.log("Grabbing page", page);
    const newData = await grabData(page);
    if (newData.hits.length < 100) {
      break;
    }
    data = data.concat(newData.hits);
    page++;
  }
  return data;
}

const data = await getAllData();

await Deno.writeTextFile("data.json", JSON.stringify(data));

await Deno.writeTextFile("data.txt", `A list of different Minecraft Mods and their descriptions:

`);

for (const mod of data) {
    await Deno.writeTextFile("data.txt", `${mod.title} - ${mod.description}\n\n`, { append: true });
}

console.log("Done!");