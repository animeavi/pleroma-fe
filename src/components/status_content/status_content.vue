<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="StatusContent">
    <slot name="header" />
    <div
      v-if="status.summary_html"
      class="summary-wrapper"
      :class="{ 'tall-subject': (longSubject && !showingLongSubject) }"
    >
      <div
        class="media-body summary"
        @click.prevent="linkClicked"
        v-html="status.summary_html"
      />
      <button
        v-if="longSubject && showingLongSubject"
        class="button-unstyled -link tall-subject-hider"
        @click.prevent="showingLongSubject=false"
      >
        {{ $t("status.hide_full_subject") }}
      </button>
      <button
        v-else-if="longSubject"
        class="button-unstyled -link tall-subject-hider"
        :class="{ 'tall-subject-hider_focused': focused }"
        @click.prevent="showingLongSubject=true"
      >
        {{ $t("status.show_full_subject") }}
      </button>
    </div>
    <div
      :class="{'tall-status': hideTallStatus}"
      class="status-content-wrapper"
    >
      <button
        v-if="hideTallStatus"
        class="button-unstyled -link tall-status-hider"
        :class="{ 'tall-status-hider_focused': focused }"
        @click.prevent="toggleShowMore"
      >
        {{ $t("general.show_more") }}
      </button>
      <div
        v-if="!hideSubjectStatus"
        :class="{ 'single-line': singleLine }"
        class="status-content media-body"
        @click.prevent="linkClicked"
        v-html="postBodyHtml"
      />
      <button
        v-if="hideSubjectStatus"
        class="button-unstyled -link cw-status-hider"
        @click.prevent="toggleShowMore"
      >
        {{ $t("status.show_content") }}
        <FAIcon
          v-if="attachmentTypes.includes('image')"
          icon="image"
        />
        <FAIcon
          v-if="attachmentTypes.includes('video')"
          icon="video"
        />
        <FAIcon
          v-if="attachmentTypes.includes('audio')"
          icon="music"
        />
        <FAIcon
          v-if="attachmentTypes.includes('unknown')"
          icon="file"
        />
        <FAIcon
          v-if="status.poll && status.poll.options"
          icon="poll-h"
        />
        <FAIcon
          v-if="status.card"
          icon="link"
        />
      </button>
      <button
        v-if="showingMore && !fullContent"
        class="button-unstyled -link status-unhider"
        @click.prevent="toggleShowMore"
      >
        {{ tallStatus ? $t("general.show_less") : $t("status.hide_content") }}
      </button>
    </div>

    <div v-if="status.poll && status.poll.options && !hideSubjectStatus">
      <poll :base-poll="status.poll" />
    </div>

    <div
      v-if="status.attachments.length !== 0 && (!hideSubjectStatus || showingLongSubject)"
      class="attachments media-body"
    >
      <attachment
        v-for="attachment in nonGalleryAttachments"
        :key="attachment.id"
        class="non-gallery"
        :size="attachmentSize"
        :nsfw="nsfwClickthrough"
        :attachment="attachment"
        :allow-play="true"
        :set-media="setMedia()"
        @play="$emit('mediaplay', attachment.id)"
        @pause="$emit('mediapause', attachment.id)"
      />
      <gallery
        v-if="galleryAttachments.length > 0"
        :nsfw="nsfwClickthrough"
        :attachments="galleryAttachments"
        :set-media="setMedia()"
      />
    </div>

    <div
      v-if="status.card && !hideSubjectStatus && !noHeading"
      class="link-preview media-body"
    >
      <link-preview
        :card="status.card"
        :size="attachmentSize"
        :nsfw="nsfwClickthrough"
      />
    </div>
    <slot name="footer" />
  </div>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script src="./status_content.js"></script>
<style lang="scss">
@import '../../_variables.scss';

$status-margin: 0.75em;

.StatusContent {
  flex: 1;
  min-width: 0;

  .status-content-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
  }

  .tall-status {
    position: relative;
    height: 220px;
    overflow-x: hidden;
    overflow-y: hidden;
    z-index: 1;
    .status-content {
      min-height: 0;
      mask: linear-gradient(to top, white, transparent) bottom/100% 70px no-repeat,
            linear-gradient(to top, white, white);
      /* Autoprefixed seem to ignore this one, and also syntax is different */
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }
  }

  .tall-status-hider {
    display: inline-block;
    word-break: break-all;
    position: absolute;
    height: 70px;
    margin-top: 150px;
    width: 100%;
    text-align: center;
    line-height: 110px;
    z-index: 2;
  }

  .status-unhider, .cw-status-hider {
    width: 100%;
    text-align: center;
    display: inline-block;
    word-break: break-all;

    svg {
      color: inherit;
    }
  }

  img, video {
    max-width: 100%;
    max-height: 400px;
    vertical-align: middle;
    object-fit: contain;

    &.emoji {
      width: 32px;
      height: 32px;
    }
  }

  .summary-wrapper {
    margin-bottom: 0.5em;
    border-style: solid;
    border-width: 0 0 1px 0;
    border-color: var(--border, $fallback--border);
    flex-grow: 0;
  }

  .summary {
    font-style: italic;
    padding-bottom: 0.5em;
  }

  .tall-subject {
    position: relative;
    .summary {
      max-height: 2em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tall-subject-hider {
    display: inline-block;
    word-break: break-all;
    // position: absolute;
    width: 100%;
    text-align: center;
    padding-bottom: 0.5em;
  }

  .status-content {
    font-family: var(--postFont, sans-serif);
    line-height: 1.4em;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    word-wrap: break-word;
    word-break: break-word;

    blockquote {
      margin: 0.2em 0 0.2em 2em;
      font-style: italic;
    }

    pre {
      overflow: auto;
    }

    code, samp, kbd, var, pre {
      font-family: var(--postCodeFont, monospace);
    }

    p {
      margin: 0 0 1em 0;
    }

    p:last-child {
      margin: 0 0 0 0;
    }

    h1 {
      font-size: 1.1em;
      line-height: 1.2em;
      margin: 1.4em 0;
    }

    h2 {
      font-size: 1.1em;
      margin: 1.0em 0;
    }

    h3 {
      font-size: 1em;
      margin: 1.2em 0;
    }

    h4 {
      margin: 1.1em 0;
    }

    &.single-line {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      height: 1.4em;
    }
  }
}

.greentext {
  color: $fallback--cGreen;
  color: var(--postGreentext, $fallback--cGreen);
}
</style>
