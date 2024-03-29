<template>
  <div
    v-if="usePlaceholder"
    :class="{ 'fullwidth': fullwidth }"
    @click="openModal"
  >
    <a
      v-if="type !== 'html'"
      class="placeholder"
      target="_blank"
      :href="attachment.url"
      :alt="attachment.description"
      :title="attachment.description"
    >
      <FAIcon :icon="placeholderIconClass" />
      <b>{{ nsfw ? "NSFW / " : "" }}</b>{{ placeholderName }}
    </a>
  </div>
  <div
    v-else
    v-show="!isEmpty"
    class="attachment"
    :class="{[type]: true, loading, 'fullwidth': fullwidth, 'nsfw-placeholder': hidden}"
  >
    <a
      v-if="hidden"
      class="image-attachment"
      :href="attachment.url"
      :alt="attachment.description"
      :title="attachment.description"
      @click.prevent.stop="toggleHidden"
    >
      <img
        :key="nsfwImage"
        class="nsfw"
        :src="nsfwImage"
        :class="{'small': isSmall}"
      >
      <FAIcon
        v-if="type === 'video'"
        class="play-icon"
        icon="play-circle"
      />
    </a>
    <button
      v-if="nsfw && hideNsfwLocal && !hidden"
      class="button-unstyled hider"
      @click.prevent="toggleHidden"
    >
      <FAIcon icon="times" />
    </button>

    <a
      v-if="type === 'image' && (!hidden || preloadImage)"
      class="image-attachment"
      :class="{'hidden': hidden && preloadImage }"
      :href="attachment.url"
      target="_blank"
      @click="openModal"
    >
      <StillImage
        class="image"
        :referrerpolicy="referrerpolicy"
        :mimetype="attachment.mimetype"
        :src="attachment.large_thumb_url || attachment.url"
        :image-load-handler="onImageLoad"
        :alt="attachment.description"
      />
    </a>

    <a
      v-if="type === 'video' && !hidden"
      class="video-container"
      :class="{'small': isSmall}"
      :href="allowPlay ? undefined : attachment.url"
      @click="openModal"
    >
      <VideoAttachment
        class="video"
        :attachment="attachment"
        :controls="allowPlay"
        @play="$emit('play')"
        @pause="$emit('pause')"
      />
      <FAIcon
        v-if="!allowPlay"
        class="play-icon"
        icon="play-circle"
      />
    </a>

    <audio
      v-if="type === 'audio'"
      :src="attachment.url"
      :alt="attachment.description"
      :title="attachment.description"
      controls
      @play="$emit('play')"
      @pause="$emit('pause')"
    />

    <div
      v-if="type === 'html' && attachment.oembed"
      class="oembed"
      @click.prevent="linkClicked"
    >
      <div
        v-if="attachment.thumb_url"
        class="image"
      >
        <img :src="attachment.thumb_url">
      </div>
      <div class="text">
        <!-- eslint-disable vue/no-v-html -->
        <h1><a :href="attachment.url">{{ attachment.oembed.title }}</a></h1>
        <div v-html="attachment.oembed.oembedHTML" />
        <!-- eslint-enable vue/no-v-html -->
      </div>
    </div>

    <Flash
      v-if="type === 'flash'"
      :src="attachment.large_thumb_url || attachment.url"
    />
  </div>
</template>

<script src="./attachment.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.attachments {
  display: flex;
  flex-wrap: wrap;

  .non-gallery {
    max-width: 100%;
  }

  .placeholder {
    display: inline-block;
    padding: 0.3em 1em 0.3em 0;
    color: $fallback--link;
    color: var(--postLink, $fallback--link);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 100%;

    svg {
      color: inherit;
    }
  }

  .nsfw-placeholder {
    cursor: pointer;

    &.loading {
      cursor: progress;
    }
  }

  .attachment {
    position: relative;
    margin-top: 0.5em;
    align-self: flex-start;
    line-height: 0;

    border-style: solid;
    border-width: 1px;
    border-radius: $fallback--attachmentRadius;
    border-radius: var(--attachmentRadius, $fallback--attachmentRadius);
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    overflow: hidden;
  }

  .non-gallery.attachment {
    &.flash,
    &.video {
      flex: 1 0 40%;
    }
    .nsfw {
      height: 260px;
    }
    .small {
      height: 120px;
      flex-grow: 0;
    }
    .video {
      height: 260px;
      display: flex;
    }
    video {
      max-height: 100%;
      object-fit: contain;
    }
  }

  .fullwidth {
    flex-basis: 100%;
  }
  // fixes small gap below video
  &.video {
    line-height: 0;
  }

  .video-container {
    display: flex;
    max-height: 100%;
  }

  .video {
    width: 100%;
    height: 100%;
  }

  .play-icon {
    position: absolute;
    font-size: 64px;
    top: calc(50% - 32px);
    left: calc(50% - 32px);
    color: rgba(255, 255, 255, 0.75);
    text-shadow: 0 0 2px rgba(0, 0, 0, 0.4);
  }

  .play-icon::before {
    margin: 0;
  }

  &.html {
    flex-basis: 90%;
    width: 100%;
    display: flex;
  }

  .hider {
    position: absolute;
    right: 0;
    margin: 10px;
    padding: 0;
    z-index: 4;
    border-radius: $fallback--tooltipRadius;
    border-radius: var(--tooltipRadius, $fallback--tooltipRadius);
    text-align: center;
    width: 2em;
    height: 2em;
    font-size: 1.25em;
    // TODO: theming? hard to theme with unknown background image color
    background: rgba(230, 230, 230, 0.7);
    .svg-inline--fa {
      color: rgba(0, 0, 0, 0.6);
    }
    &:hover .svg-inline--fa {
      color: rgba(0, 0, 0, 0.9);
    }
  }

  video {
    z-index: 0;
  }

  audio {
    width: 100%;
  }

  img.media-upload {
    line-height: 0;
    max-height: 200px;
    max-width: 100%;
  }

  .oembed {
    line-height: 1.2em;
    flex: 1 0 100%;
    width: 100%;
    margin-right: 15px;
    display: flex;

    img {
      width: 100%;
    }

    .image {
      flex: 1;
      img {
        border: 0px;
        border-radius: 5px;
        height: 100%;
        object-fit: cover;
      }
    }

    .text {
      flex: 2;
      margin: 8px;
      word-break: break-all;
      h1 {
        font-size: 14px;
        margin: 0px;
      }
    }
  }

  .image-attachment {
    &,
    & .image {
      width: 100%;
      height: 100%;
    }

    &.hidden {
      display: none;
    }

    .nsfw {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    img {
      image-orientation: from-image; // NOTE: only FF supports this
    }
  }
}
</style>
