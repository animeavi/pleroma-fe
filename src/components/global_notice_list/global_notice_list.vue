<template>
  <div class="global-notice-list">
    <div
      v-for="(notice, index) in notices"
      :key="index"
      class="alert global-notice"
      :class="{ ['global-' + notice.level]: true }"
    >
      <div class="notice-message">
        {{ $t(notice.messageKey, notice.messageArgs) }}
      </div>
      <button
        class="button-unstyled close-notice"
        @click="closeNotice(notice)"
      >
        <FAIcon
          class="fa-scale-110 fa-old-padding"
          icon="times"
        />
      </button>
    </div>
  </div>
</template>

<script src="./global_notice_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.global-notice-list {
  position: fixed;
  top: 50px;
  width: 100%;
  pointer-events: none;
  z-index: 1001;
  display: flex;
  flex-direction: column;
  align-items: center;

  .global-notice {
    pointer-events: auto;
    text-align: center;
    width: 40em;
    max-width: calc(100% - 3em);
    display: flex;
    padding-left: 1.5em;
    line-height: 2em;
    .notice-message {
      flex: 1 1 100%;
    }
    i {
      flex: 0 0;
      width: 1.5em;
      cursor: pointer;
    }
  }

  .global-error {
    background-color: var(--alertPopupError, $fallback--cRed);
    color: var(--alertPopupErrorText, $fallback--text);
    .svg-inline--fa {
      color: var(--alertPopupErrorText, $fallback--text);
    }
  }

  .global-warning {
    background-color: var(--alertPopupWarning, $fallback--cOrange);
    color: var(--alertPopupWarningText, $fallback--text);
    .svg-inline--fa {
      color: var(--alertPopupWarningText, $fallback--text);
    }
  }

  .global-success {
    background-color: var(--alertPopupSuccess, $fallback--cGreen);
    color: var(--alertPopupSuccessText, $fallback--text);
    .svg-inline--fa {
      color: var(--alertPopupSuccessText, $fallback--text);
    }
  }

  .global-info {
    background-color: var(--alertPopupNeutral, $fallback--fg);
    color: var(--alertPopupNeutralText, $fallback--text);
    .svg-inline--fa {
      color: var(--alertPopupNeutralText, $fallback--text);
    }
  }

  .close-notice {
    padding-right: 0.2em;
    .svg-inline--fa:hover {
      opacity: 0.6;
    }
  }
}
</style>
