<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-if="!hideStatus"
    class="Status"
    :class="[{ '-focused': isFocused }, { '-conversation': inlineExpanded }]"
  >
    <div
      v-if="error"
      class="alert error"
    >
      {{ error }}
      <span
        class="fa-scale-110 fa-old-padding"
        @click="clearError"
      >
        <FAIcon icon="times" />
      </span>
    </div>
    <template v-if="muted && !isPreview">
      <div class="status-container muted">
        <small class="status-username">
          <FAIcon
            v-if="muted && retweet"
            class="fa-scale-110 fa-old-padding repeat-icon"
            icon="retweet"
          />
          <router-link :to="userProfileLink">
            {{ status.user.screen_name_ui }}
          </router-link>
        </small>
        <small
          v-if="showReasonMutedThread"
          class="mute-thread"
        >
          {{ $t('status.thread_muted') }}
        </small>
        <small
          v-if="showReasonMutedThread && muteWordHits.length > 0"
          class="mute-thread"
        >
          {{ $t('status.thread_muted_and_words') }}
        </small>
        <small
          class="mute-words"
          :title="muteWordHits.join(', ')"
        >
          {{ muteWordHits.join(', ') }}
        </small>
        <button
          class="unmute button-unstyled"
          @click.prevent="toggleMute"
        >
          <FAIcon
            icon="eye-slash"
            class="fa-scale-110 fa-old-padding"
          />
        </button>
      </div>
    </template>
    <template v-else>
      <div
        v-if="showPinned"
        class="pin"
      >
        <FAIcon
          icon="thumbtack"
          class="faint"
        />
        <span class="faint">{{ $t('status.pinned') }}</span>
      </div>
      <div
        v-if="retweet && !noHeading && !inConversation"
        :class="[repeaterClass, { highlighted: repeaterStyle }]"
        :style="[repeaterStyle]"
        class="status-container repeat-info"
      >
        <UserAvatar
          v-if="retweet"
          class="left-side repeater-avatar"
          :better-shadow="betterShadow"
          :user="statusoid.user"
        />
        <div class="right-side faint">
          <bdi
            class="status-username repeater-name"
            :title="retweeter"
          >
            <router-link
              v-if="retweeterHtml"
              :to="retweeterProfileLink"
            >
              <RichContent
                :html="retweeterHtml"
                :emoji="retweeterUser.emoji"
              />
            </router-link>
            <router-link
              v-else
              :to="retweeterProfileLink"
            >{{ retweeter }}</router-link>
          </bdi>
          <FAIcon
            icon="retweet"
            class="repeat-icon"
            :title="$t('tool_tip.repeat')"
          />
          {{ $t('timeline.repeated') }}
        </div>
      </div>

      <div
        v-if="!deleted"
        :class="[userClass, { highlighted: userStyle, '-repeat': retweet && !inConversation }]"
        :style="[ userStyle ]"
        class="status-container"
        :data-tags="tags"
      >
        <div
          v-if="!noHeading"
          class="left-side"
        >
          <router-link
            :to="userProfileLink"
            @click.stop.prevent.capture.native="toggleUserExpanded"
          >
            <UserAvatar
              :compact="compact"
              :better-shadow="betterShadow"
              :user="status.user"
            />
          </router-link>
        </div>
        <div class="right-side">
          <UserCard
            v-if="userExpanded"
            :user-id="status.user.id"
            :rounded="true"
            :bordered="true"
            class="usercard"
          />
          <div
            v-if="!noHeading"
            class="status-heading"
          >
            <div class="heading-name-row">
              <div class="heading-left">
                <h4
                  v-if="status.user.name_html"
                  class="status-username"
                  :title="status.user.name"
                  v-html="status.user.name_html"
                />
                <h4
                  v-else
                  class="status-username"
                  :title="status.user.name"
                >
                  {{ status.user.name }}
                </h4>
                <router-link
                  class="account-name"
                  :title="status.user.screen_name_ui"
                  :to="userProfileLink"
                >
                  {{ status.user.screen_name_ui }}
                </router-link>
                <img
                  v-if="!!(status.user && status.user.favicon)"
                  class="status-favicon"
                  :src="status.user.favicon"
                >
              </div>

              <span class="heading-right">
                <router-link
                  class="timeago faint-link"
                  :to="{ name: 'conversation', params: { id: status.id } }"
                >
                  <Timeago
                    :time="status.created_at"
                    :auto-update="60"
                  />
                </router-link>
                <span
                  v-if="status.visibility"
                  class="visibility-icon"
                  :title="status.visibility | capitalize"
                >
                  <FAIcon
                    fixed-width
                    class="fa-scale-110"
                    :icon="visibilityIcon(status.visibility)"
                  />
                </span>
                <button
                  v-if="expandable && !isPreview"
                  class="button-unstyled"
                  :title="$t('status.expand')"
                  @click.prevent="toggleExpanded"
                >
                  <FAIcon
                    fixed-width
                    class="fa-scale-110"
                    icon="plus-square"
                  />
                </button>
                <button
                  v-if="unmuted"
                  class="button-unstyled"
                  @click.prevent="toggleMute"
                >
                  <FAIcon
                    fixed-width
                    icon="eye-slash"
                    class="fa-scale-110"
                  />
                </button>
              </span>
            </div>

            <div class="heading-reply-row">
              <div
                v-if="isReply"
                class="reply-to-and-accountname"
              >
                <StatusPopover
                  v-if="!isPreview"
                  :status-id="status.parent_visible && status.in_reply_to_status_id"
                  class="reply-to-popover"
                  style="min-width: 0"
                  :class="{ '-strikethrough': !status.parent_visible }"
                >
                  <button
                    class="button-unstyled reply-to"
                    :aria-label="$t('tool_tip.reply')"
                    @click.prevent="gotoOriginal(status.in_reply_to_status_id)"
                  >
                    <FAIcon
                      class="fa-scale-110 fa-old-padding"
                      icon="reply"
                      flip="horizontal"
                    />
                    <span
                      class="faint-link reply-to-text"
                    >
                      {{ $t('status.reply_to') }}
                    </span>
                  </button>
                </StatusPopover>

                <span
                  v-else
                  class="reply-to-no-popover"
                >
                  <span class="reply-to-text">{{ $t('status.reply_to') }}</span>
                </span>
                <router-link
                  class="reply-to-link"
                  :title="replyToName"
                  :to="replyProfileLink"
                >
                  {{ replyToName }}
                </router-link>
                <span
                  v-if="replies && replies.length"
                  class="faint replies-separator"
                >
                  -
                </span>
              </div>
              <div
                v-if="inConversation && !isPreview && replies && replies.length"
                class="replies"
              >
                <span class="faint">{{ $t('status.replies_list') }}</span>
                <StatusPopover
                  v-for="reply in replies"
                  :key="reply.id"
                  :status-id="reply.id"
                >
                  <button
                    class="button-unstyled -link reply-link"
                    @click.prevent="gotoOriginal(reply.id)"
                  >
                    {{ reply.name }}
                  </button>
                </StatusPopover>
              </div>
            </div>
          </div>

          <StatusContent
            :status="status"
            :no-heading="noHeading"
            :highlight="highlight"
            :focused="isFocused"
            @mediaplay="addMediaPlaying($event)"
            @mediapause="removeMediaPlaying($event)"
          />

          <transition name="fade">
            <div
              v-if="!hidePostStats && isFocused && combinedFavsAndRepeatsUsers.length > 0"
              class="favs-repeated-users"
            >
              <div class="stats">
                <UserListPopover
                  v-if="statusFromGlobalRepository.rebloggedBy && statusFromGlobalRepository.rebloggedBy.length > 0"
                  :users="statusFromGlobalRepository.rebloggedBy"
                >
                  <div class="stat-count">
                    <a class="stat-title">{{ $t('status.repeats') }}</a>
                    <div class="stat-number">
                      {{ statusFromGlobalRepository.rebloggedBy.length }}
                    </div>
                  </div>
                </UserListPopover>
                <UserListPopover
                  v-if="statusFromGlobalRepository.favoritedBy && statusFromGlobalRepository.favoritedBy.length > 0"
                  :users="statusFromGlobalRepository.favoritedBy"
                >
                  <div
                    class="stat-count"
                  >
                    <a class="stat-title">{{ $t('status.favorites') }}</a>
                    <div class="stat-number">
                      {{ statusFromGlobalRepository.favoritedBy.length }}
                    </div>
                  </div>
                </UserListPopover>
                <div class="avatar-row">
                  <AvatarList :users="combinedFavsAndRepeatsUsers" />
                </div>
              </div>
            </div>
          </transition>

          <EmojiReactions
            v-if="(mergedConfig.emojiReactionsOnTimeline || isFocused) && (!noHeading && !isPreview)"
            :status="status"
          />

          <div
            v-if="!noHeading && !isPreview"
            class="status-actions"
          >
            <reply-button
              :replying="replying"
              :status="status"
              @toggle="toggleReplying"
            />
            <retweet-button
              :visibility="status.visibility"
              :logged-in="loggedIn"
              :status="status"
            />
            <favorite-button
              :logged-in="loggedIn"
              :status="status"
            />
            <ReactButton
              v-if="loggedIn"
              :status="status"
            />
            <extra-buttons
              :status="status"
              @onError="showError"
              @onSuccess="clearError"
            />
          </div>
        </div>
      </div>
      <div
        v-else
        class="gravestone"
      >
        <div class="left-side">
          <UserAvatar :compact="compact" />
        </div>
        <div class="right-side">
          <div class="deleted-text">
            {{ $t('status.status_deleted') }}
          </div>
          <reply-button
            v-if="replying"
            :replying="replying"
            :status="status"
            @toggle="toggleReplying"
          />
        </div>
      </div>
      <div
        v-if="replying"
        class="status-container reply-form"
      >
        <PostStatusForm
          class="reply-body"
          :reply-to="status.id"
          :attentions="status.attentions"
          :replied-user="status.user"
          :copy-message-scope="status.visibility"
          :subject="replySubject"
          @posted="toggleReplying"
        />
      </div>
    </template>
  </div>
<!-- eslint-enable vue/no-v-html -->
</template>

<script src="./status.js"></script>

<style src="./status.scss" lang="scss"></style>
