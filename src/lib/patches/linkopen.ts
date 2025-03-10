import { Tags } from "@/lib/ink";

Tags.add("linkopen", (val: string | null) => {
	if (val) {
		window.open(val);
	}
});
