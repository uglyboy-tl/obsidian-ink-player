<script lang="ts">
import type { InkStory } from "@inkweave/core";
import { Image } from "@inkweave/plugins/svelte";
import { CommandBar, Story } from "@inkweave/svelte";
import { t } from "./locales/i18n";

let { ink }: { ink: InkStory } = $props();
</script>

<div id="inkweave-player" class="container">
  <nav class="view-header">
    <div class="view-header-title-container mod-at-start mod-fade"></div>
    <CommandBar
      {ink}
      class="view-actions"
      buttonClass="clickable-icon nav-action-button"
      modalClass="modal"
      t={t}
    />
  </nav>
  <Story {ink} class="markdown-preview-view">
    <Image class="inkweave-image" />
  </Story>
</div>
