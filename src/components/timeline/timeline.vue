<template>
  <div :class="[classes.root, 'Timeline']">
    <div :class="classes.header">
      <TimelineMenu v-if="!embedded" />
      <button
        v-if="showLoadButton"
        class="button-default loadmore-button"
        @click.prevent="showNewStatuses"
      >
        {{ loadButtonString }}
      </button>
      <div
        v-else
        class="loadmore-text faint"
        @click.prevent
      >
        {{ $t('timeline.up_to_date') }}
      </div>
      <TimelineQuickSettings v-if="!embedded" />
    </div>
    <div :class="classes.body">
      <div
        ref="timeline"
        class="timeline"
      >
        <template v-for="statusId in pinnedStatusIds">
          <conversation
            v-if="timeline.statusesObject[statusId]"
            :key="statusId + '-pinned'"
            class="status-fadein"
            :status-id="statusId"
            :collapsable="true"
            :pinned-status-ids-object="pinnedStatusIdsObject"
            :in-profile="inProfile"
            :profile-user-id="userId"
          />
        </template>
        <template v-for="status in timeline.visibleStatuses">
          <conversation
            v-if="!excludedStatusIdsObject[status.id]"
            :key="status.id"
            class="status-fadein"
            :status-id="status.id"
            :collapsable="true"
            :in-profile="inProfile"
            :profile-user-id="userId"
            :virtual-hidden="virtualScrollingEnabled && !statusesToDisplay.includes(status.id)"
          />
        </template>
      </div>
    </div>
    <div :class="classes.footer">
      <div
        v-if="count===0"
        class="new-status-notification text-center faint"
      >
        {{ $t('timeline.no_statuses') }}
      </div>
      <div
        v-else-if="bottomedOut"
        class="new-status-notification text-center faint"
      >
        {{ $t('timeline.no_more_statuses') }}
      </div>
      <button
        v-else-if="!timeline.loading"
        class="button-unstyled -link -fullwidth"
        @click.prevent="fetchOlderStatuses()"
      >
        <div class="new-status-notification text-center">
          {{ $t('timeline.load_older') }}
        </div>
      </button>
      <div
        v-else
        class="new-status-notification text-center"
      >
        <FAIcon
          icon="circle-notch"
          spin
          size="lg"
        />
      </div>
    </div>
  </div>
</template>

<script src="./timeline.js"></script>

<style src="./timeline.scss" lang="scss"> </style>
