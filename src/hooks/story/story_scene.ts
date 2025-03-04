import { create } from "zustand";
import createSelectors from "@/lib/utils/createSelectors";

type StoryScene = {
  stats: string[];
  background: string;
  image: string;
  sound: HTMLAudioElement | null;
  music: HTMLAudioElement | null;
  setStats: (stats: string[]) => void;
  setBackground: (background: string) => void;
  setImage: (image: string) => void;
  setSound: (path: string) => void;
  setMusic: (path: string) => void;
  sound_stop: () => void;
  processTag: (tag: string, val: string) => void;
};

const useStoryScene = create<StoryScene>((set, get) => ({
  stats: [],
  background: "",
  image: "",
  sound: null,
  music: null,
  setStats: (stats) => set({ stats }),
  setBackground: (background) => set({ background }),
  setImage: (image) => set({ image }),
  setSound: (path: string) => {
    get().sound?.pause();
    set({ sound: new Audio(path) || null });
    let audio = get().sound;
    audio?.addEventListener("canplaythrough", () => {
      audio.play();
    });
  },
  setMusic: (path: string) => {
    get().music?.pause();
    set({ music: new Audio(path) || null });
    let music = get().music;
    music?.addEventListener("canplaythrough", () => {
      music.loop = true;
      music.play();
    });
  },
  sound_stop: () => {
    // TODO: 现在有问题，声音停不了
    get().sound?.pause();
    get().music?.pause();
  },
  processTag: (tag, val = "") => {
    if (tag == "AUDIO") {
      get().setSound(val);
    }
    // AUDIOLOOP: src
    else if (tag == "AUDIOLOOP") {
      get().setMusic(val);
    }
    // LINKOPEN: url
    else if (tag == "LINKOPEN") {
      window.open(val);
    }
    // IMAGE: src
    else if (tag == "IMAGE") {
      get().setImage(val);
    }
    // BACKGROUND: src
    else if (tag == "BACKGROUND") {
      get().setBackground(val);
    }
    // STATS: stat1,stat2,stat3
    else if (tag == "STATS") {
      get().setStats(val.split(",").map((stat) => stat.trim()));
    }
  },
}));

export default createSelectors(useStoryScene);
