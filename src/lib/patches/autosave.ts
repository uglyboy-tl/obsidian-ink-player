import memory from "./memory";
import { Patches, Tags, InkStory } from "@/lib/ink";

var options = {
	autosave_enabled: true,
};

Tags.add("autosave", (_: string, ink: InkStory) => {
	console.log("autosave");
	if (ink.options.autosave_enabled) {
		memory.save(2, ink);
	}
});

Patches.add(null, options);
