import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins/solidjs";
import { CommandBar, Story } from "@inkweave/solidjs";
import { t } from "./locales/i18n";

const App = (props: { ink: InkStory }) => {
  return (
    <div id="inkweave-player" class="container">
      <nav class="view-header">
        <div class="view-header-title-container mod-at-start mod-fade" />
        <CommandBar
          ink={props.ink}
          class="view-actions"
          buttonClass="clickable-icon nav-action-button"
          modalClass="modal"
          t={t}
        />
      </nav>
      <Story ink={props.ink} class="markdown-preview-view">
        <Image class="inkweave-image" />
      </Story>
    </div>
  );
};

export default App;
