import type { InkStory, StatusBarConfig } from "@inkweave/core";
import { Image } from "@inkweave/plugins/solidjs";
import { CommandBar, StatusBar, Story } from "@inkweave/solidjs";
import { t } from "./locales/i18n";

interface AppProps {
  ink: InkStory;
  statusBar?: StatusBarConfig[];
}

const App = (props: AppProps) => {
  return (
    <div id="inkweave-player" class="container">
      <nav class="view-header">
        {props.statusBar && <StatusBar ink={props.ink} variables={props.statusBar} />}
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
