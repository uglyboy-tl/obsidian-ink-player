import { Tags } from "@/lib/ink";

const load = () => {
	Tags.add("linkopen", (val: string | null) => {
		if (val) {
			window.open(val);
		}
	});
};
export default load;
